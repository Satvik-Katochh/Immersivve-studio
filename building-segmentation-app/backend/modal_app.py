import modal
from pathlib import Path
import os

# Create Modal app
app = modal.App("building-segmentation-sam2")

# Define the image with all dependencies
image = modal.Image.debian_slim(python_version="3.11").pip_install(
    "fastapi==0.104.1",
    "uvicorn==0.24.0",
    "python-multipart==0.0.6",
    "Pillow==10.1.0",
    "numpy==1.24.3",
    "opencv-python==4.8.1.78",
    "torch==2.1.0",
    "torchvision==0.16.0",
    "aiofiles==23.2.1",
    "python-dotenv==1.0.0",
)

# Add SAM2 installation
image = image.run_commands(
    "apt-get update && apt-get install -y git",
    "pip install git+https://github.com/facebookresearch/segment-anything-2.git",
    "mkdir -p /root/models",
)

# Download SAM2 model


@app.function(image=image, gpu="A10G")
def download_sam2_model():
    """Download SAM2 model weights"""
    import urllib.request

    model_url = "https://dl.fbaipublicfiles.com/segment_anything_2/sam2_h.pt"
    model_path = "/root/models/sam2_h.pt"

    print("Downloading SAM2 model...")
    urllib.request.urlretrieve(model_url, model_path)
    print("SAM2 model downloaded successfully!")

    return model_path

# Web endpoint


@app.function(
    image=image,
    gpu="A10G",
    timeout=300,
    min_containers=1
)
@modal.fastapi_endpoint(method="POST")
async def generate_masks_endpoint(file_data: bytes, filename: str):
    """Generate masks for uploaded image"""
    from services.sam2_service import SAM2Service
    import tempfile
    import base64

    # Save uploaded file
    with tempfile.NamedTemporaryFile(delete=False, suffix=Path(filename).suffix) as f:
        f.write(file_data)
        temp_path = f.name

    try:
        # Initialize SAM2 service
        sam2_service = SAM2Service()

        # Generate masks
        masks = await sam2_service.generate_masks(temp_path)

        return {
            "success": True,
            "masks": masks,
            "message": "Masks generated successfully"
        }

    finally:
        # Clean up
        os.unlink(temp_path)

# Color application endpoint


@app.function(
    image=image,
    gpu="A10G",
    timeout=300
)
@modal.fastapi_endpoint(method="POST")
async def apply_color_endpoint(file_data: bytes, filename: str, mask_indices: list, color: str):
    """Apply color to selected masks"""
    from services.sam2_service import SAM2Service
    import tempfile
    import base64
    from PIL import Image
    import io

    # Save uploaded file
    with tempfile.NamedTemporaryFile(delete=False, suffix=Path(filename).suffix) as f:
        f.write(file_data)
        temp_path = f.name

    try:
        # Initialize SAM2 service
        sam2_service = SAM2Service()

        # Apply color
        colored_image = await sam2_service.apply_color_to_masks(temp_path, mask_indices, color)

        # Convert to base64 for response
        buffer = io.BytesIO()
        colored_image.save(buffer, format='PNG')
        image_base64 = base64.b64encode(buffer.getvalue()).decode()

        return {
            "success": True,
            "colored_image": image_base64,
            "message": "Color applied successfully"
        }

    finally:
        # Clean up
        os.unlink(temp_path)

# Health check endpoint


@app.function(image=image)
@modal.fastapi_endpoint(method="GET")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "SAM2 Building Segmentation"}

if __name__ == "__main__":
    # Deploy the app
    app.deploy("building-segmentation-sam2")
