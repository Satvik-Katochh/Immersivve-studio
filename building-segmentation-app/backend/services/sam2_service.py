import torch
import numpy as np
from PIL import Image
import cv2
import os
from typing import List, Dict, Any
import base64
import io

# SAM2 imports
try:
    from sam2.build_sam import build_sam2
    # SAM2 v2 has different structure - we'll use the build function
except ImportError:
    print("SAM2 not installed. Please install it first.")
    # Fallback for development
    pass


class SAM2Service:
    def __init__(self):
        """Initialize SAM2 service with model loading"""
        self.model = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"

        # Initialize model (will be loaded when first used)
        self._load_model()

    def _load_model(self):
        """Load SAM2 model"""
        try:
            # For development, we'll use a placeholder
            # In production, you'll need to download the actual SAM2 model
            print("Loading SAM2 model...")

            # Try to load SAM2 model using the new API
            try:
                # For now, we'll use placeholder since SAM2 v2 requires config files
                print(
                    "SAM2 v2 requires config files. Using placeholder for development...")
                self.model = None
            except Exception as model_error:
                print(f"Could not load SAM2 model: {model_error}")
                print("Using placeholder for development...")
                self.model = None

        except Exception as e:
            print(f"Error loading SAM2 model: {e}")
            print("Using placeholder for development...")
            self.model = None

    async def generate_masks(self, image_path: str) -> List[Dict[str, Any]]:
        """
        Generate masks for the given image using SAM2

        Args:
            image_path: Path to the input image

        Returns:
            List of mask dictionaries with coordinates and metadata
        """
        try:
            # Load image
            image = cv2.imread(image_path)
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

            if self.model is None:
                # Development mode - generate placeholder masks
                return self._generate_placeholder_masks(image_rgb)

            # For now, return placeholder masks since SAM2 v2 API is different
            return self._generate_placeholder_masks(image_rgb)

        except Exception as e:
            print(f"Error generating masks: {e}")
            # Return placeholder masks for development
            return self._generate_placeholder_masks(image_rgb)

    def _generate_placeholder_masks(self, image_rgb: np.ndarray) -> List[Dict[str, Any]]:
        """
        Generate placeholder masks for development/testing
        """
        height, width = image_rgb.shape[:2]
        masks = []

        # Create some simple rectangular masks
        mask_regions = [
            (0, 0, width//2, height//2),  # Top-left
            (width//2, 0, width, height//2),  # Top-right
            (0, height//2, width//2, height),  # Bottom-left
            (width//2, height//2, width, height),  # Bottom-right
        ]

        for i, (x1, y1, x2, y2) in enumerate(mask_regions):
            # Create mask
            mask = np.zeros((height, width), dtype=np.uint8)
            mask[y1:y2, x1:x2] = 255

            # Convert to base64
            mask_image = Image.fromarray(mask)
            mask_buffer = io.BytesIO()
            mask_image.save(mask_buffer, format='PNG')
            mask_base64 = base64.b64encode(mask_buffer.getvalue()).decode()

            masks.append({
                'id': i,
                'segmentation': mask_base64,
                'area': (x2 - x1) * (y2 - y1),
                'bbox': [x1, y1, x2 - x1, y2 - y1],
                'predicted_iou': 0.8 + (i * 0.05),
                'point_coords': [[(x1 + x2) // 2, (y1 + y2) // 2]],
                'stability_score': 0.9
            })

        return masks

    async def apply_color_to_masks(self, image_path: str, mask_indices: List[int], color: str) -> Image.Image:
        """
        Apply color to selected masks

        Args:
            image_path: Path to the original image
            mask_indices: List of mask IDs to color
            color: Hex color string (e.g., "#FF0000")

        Returns:
            PIL Image with colors applied
        """
        try:
            # Load original image
            original_image = Image.open(image_path)
            image_array = np.array(original_image)

            # Convert hex color to RGB
            color_rgb = tuple(int(color[i:i+2], 16)
                              for i in (1, 3, 5))  # Remove # and convert

            # Create colored image
            colored_image = image_array.copy()

            # For development, we'll create simple colored regions
            height, width = image_array.shape[:2]

            # Create colored regions based on mask indices
            for mask_id in mask_indices:
                if mask_id == 0:  # Top-left
                    colored_image[0:height//2, 0:width//2] = color_rgb
                elif mask_id == 1:  # Top-right
                    colored_image[0:height//2, width//2:width] = color_rgb
                elif mask_id == 2:  # Bottom-left
                    colored_image[height//2:height, 0:width//2] = color_rgb
                elif mask_id == 3:  # Bottom-right
                    colored_image[height//2:height, width//2:width] = color_rgb

            return Image.fromarray(colored_image)

        except Exception as e:
            print(f"Error applying color: {e}")
            # Return original image if error
            return Image.open(image_path)

    def get_mask_at_point(self, image_path: str, x: int, y: int) -> Dict[str, Any]:
        """
        Get mask at specific point (for interactive selection)
        """
        # This would use SAM2's point-based prediction
        # For now, return a simple mask around the point
        return {
            'id': -1,  # Temporary ID
            'center': [x, y],
            'radius': 50
        }
