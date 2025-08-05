from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import uvicorn
import os
import uuid
from pathlib import Path
import aiofiles
from PIL import Image
import io
import base64

# Import our SAM2 service
from services.sam2_service import SAM2Service

app = FastAPI(title="Building Segmentation API", version="1.0.0")

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize SAM2 service
sam2_service = SAM2Service()

# Create uploads directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@app.get("/")
async def root():
    return {"message": "Building Segmentation API is running!"}


@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    """
    Upload a building image
    """
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400, detail="File must be an image")

        # Generate unique filename
        file_id = str(uuid.uuid4())
        file_extension = Path(file.filename).suffix
        filename = f"{file_id}{file_extension}"
        file_path = UPLOAD_DIR / filename

        # Save file
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)

        return {
            "success": True,
            "file_id": file_id,
            "filename": filename,
            "message": "Image uploaded successfully"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@app.post("/generate-masks")
async def generate_masks(file_id: str):
    """
    Generate SAM2 masks for the uploaded image
    """
    try:
        # Find the uploaded file
        file_path = None
        for file in UPLOAD_DIR.iterdir():
            if file_id in file.name:
                file_path = file
                break

        if not file_path or not file_path.exists():
            raise HTTPException(status_code=404, detail="Image not found")

        # Generate masks using SAM2
        masks = await sam2_service.generate_masks(str(file_path))

        return {
            "success": True,
            "masks": masks,
            "message": "Masks generated successfully"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Mask generation failed: {str(e)}")


@app.post("/apply-color")
async def apply_color(file_id: str, mask_indices: list[int], color: str):
    """
    Apply color to selected masks
    """
    try:
        # Find the uploaded file
        file_path = None
        for file in UPLOAD_DIR.iterdir():
            if file_id in file.name:
                file_path = file
                break

        if not file_path or not file_path.exists():
            raise HTTPException(status_code=404, detail="Image not found")

        # Apply color to masks
        colored_image = await sam2_service.apply_color_to_masks(
            str(file_path), mask_indices, color
        )

        # Save colored image
        output_filename = f"{file_id}_colored.png"
        output_path = UPLOAD_DIR / output_filename
        colored_image.save(output_path)

        return {
            "success": True,
            "output_filename": output_filename,
            "message": "Color applied successfully"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Color application failed: {str(e)}")


@app.get("/download/{filename}")
async def download_file(filename: str):
    """
    Download the final colored image
    """
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(file_path, filename=filename)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
