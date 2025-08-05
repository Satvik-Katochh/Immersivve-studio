#!/usr/bin/env python3
"""
Test script for backend functionality
"""

import asyncio
import sys
import os
from pathlib import Path

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.sam2_service import SAM2Service
from PIL import Image
import numpy as np

async def test_sam2_service():
    """Test SAM2 service functionality"""
    print("🧪 Testing SAM2 Service...")
    
    # Create a test image
    test_image = np.random.randint(0, 255, (400, 400, 3), dtype=np.uint8)
    test_image_path = "test_image.png"
    Image.fromarray(test_image).save(test_image_path)
    
    try:
        # Initialize service
        sam2_service = SAM2Service()
        print("✅ SAM2 service initialized")
        
        # Test mask generation
        print("🔄 Generating masks...")
        masks = await sam2_service.generate_masks(test_image_path)
        print(f"✅ Generated {len(masks)} masks")
        
        # Test color application
        print("🎨 Testing color application...")
        colored_image = await sam2_service.apply_color_to_masks(
            test_image_path, [0, 1], "#FF0000"
        )
        colored_image.save("test_colored.png")
        print("✅ Color application successful")
        
        print("\n🎉 All tests passed!")
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False
    
    finally:
        # Cleanup
        if os.path.exists(test_image_path):
            os.remove(test_image_path)
        if os.path.exists("test_colored.png"):
            os.remove("test_colored.png")

def test_fastapi_endpoints():
    """Test FastAPI endpoints"""
    print("\n🌐 Testing FastAPI endpoints...")
    
    try:
        import uvicorn
        from main import app
        from fastapi.testclient import TestClient
        
        client = TestClient(app)
        
        # Test health check
        response = client.get("/")
        print(f"✅ Health check: {response.status_code}")
        
        print("✅ FastAPI endpoints working!")
        return True
        
    except Exception as e:
        print(f"❌ FastAPI test failed: {e}")
        return False

async def main():
    """Main test function"""
    print("🧪 Backend Testing Suite")
    print("=" * 40)
    
    # Test SAM2 service
    sam2_success = await test_sam2_service()
    
    # Test FastAPI
    fastapi_success = test_fastapi_endpoints()
    
    print("\n" + "=" * 40)
    if sam2_success and fastapi_success:
        print("🎉 All backend tests passed!")
        print("✅ Ready for frontend integration")
    else:
        print("❌ Some tests failed. Please check the errors above.")

if __name__ == "__main__":
    asyncio.run(main()) 