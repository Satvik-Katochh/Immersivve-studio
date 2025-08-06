# 🏠 Building Segmentation & Coloring App

A web application that uses **SAM2 (Segment Anything Model 2)** to automatically segment buildings and allow interactive coloring of different building sections.

## 🎯 **What This App Does**

### **User Experience:**

1. **Upload** a building image
2. **Click** on different parts (walls, windows, roof)
3. **Choose colors** from palette
4. **Apply colors** to selected areas
5. **Download** the final colored building

### **Technical Magic:**

- **AI-Powered**: Uses SAM2 to automatically find building sections
- **Interactive**: Click anywhere to select precise areas
- **Real-time**: Instant color application
- **Cloud GPU**: Powered by Modal.com for fast processing

## 🚀 **Live Demo**

**Backend API Endpoints:**

- **Health Check**: https://satvik-katochh--building-segmentation-sam2-health-check.modal.run
- **Generate Masks**: https://satvik-katochh--building-segmentation-sam2-generate-mask-cd2bf7.modal.run
- **Apply Colors**: https://satvik-katochh--building-segmentation-sam2-apply-color-endpoint.modal.run

## 🛠️ **Tech Stack**

### **Backend:**

- **FastAPI** - Modern Python web framework
- **SAM2** - Facebook's Segment Anything Model 2
- **Modal.com** - GPU cloud platform
- **PyTorch** - Deep learning framework

### **Frontend:**

- **React** - Modern UI framework
- **TypeScript** - Type-safe JavaScript
- **shadcn/ui** - Beautiful component library
- **Canvas API** - Image manipulation
- **Tailwind CSS** - Utility-first styling
- **next-themes** - Dark/light theme switching

### **Deployment:**

- **Modal.com** - Backend with GPU access
- **Vercel** - Frontend hosting (planned)

## 📁 **Project Structure**

```
building-segmentation-app/
├── backend/                    # Python FastAPI server
│   ├── main.py                # API endpoints
│   ├── services/
│   │   └── sam2_service.py    # SAM2 integration
│   ├── modal_app.py           # Modal.com deployment
│   ├── requirements.txt       # Python dependencies
│   └── uploads/               # Store uploaded images
├── frontend/                  # React app ✅ COMPLETED
├── docs/                      # Documentation
│   └── DEVELOPMENT_PLAN.md    # Detailed development guide
└── README.md                  # This file
```

## 🔧 **Quick Start**

### **1. Backend Setup**

```bash
# Create conda environment
conda create -n building-segmentation python=3.11 -y
conda activate building-segmentation

# Install dependencies
cd backend
pip install -r requirements.txt

# Test backend
python test_backend.py
```

### **2. Modal.com Deployment**

```bash
# Install Modal CLI
pip install modal

# Authenticate
modal token new

# Deploy to GPU
modal deploy modal_app.py
```

### **3. Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```

**Features Implemented:**

- ✅ Drag & drop image upload
- ✅ Dark/light theme switching
- ✅ Color palette with presets
- ✅ Real-time processing states
- ✅ API integration with backend
- ✅ Responsive design

## 🧪 **Testing**

### **Backend Tests:**

```bash
cd backend
python test_backend.py
```

**Expected Output:**

```
🧪 Backend Testing Suite
========================================
🧪 Testing SAM2 Service...
✅ SAM2 service initialized
🔄 Generating masks...
✅ Generated 4 masks
🎨 Testing color application...
✅ Color application successful
🎉 All tests passed!
```

## 📊 **API Endpoints**

### **POST /upload**

Upload a building image

```json
{
  "success": true,
  "file_id": "uuid",
  "filename": "image.jpg",
  "message": "Image uploaded successfully"
}
```

### **POST /generate-masks**

Generate SAM2 masks for uploaded image

```json
{
  "success": true,
  "masks": [
    {
      "id": 0,
      "segmentation": "base64_mask_data",
      "area": 40000,
      "bbox": [0, 0, 200, 200],
      "predicted_iou": 0.85,
      "stability_score": 0.9
    }
  ],
  "message": "Masks generated successfully"
}
```

### **POST /apply-color**

Apply color to selected masks

```json
{
  "success": true,
  "output_filename": "colored_image.png",
  "message": "Color applied successfully"
}
```

### **GET /download/{filename}**

Download the final colored image

## 🎨 **Features**

### **✅ Completed:**

- ✅ **Image Upload** - Drag & drop support
- ✅ **SAM2 Integration** - Real AI segmentation
- ✅ **Mask Generation** - Automatic building section detection
- ✅ **Color Application** - Interactive coloring
- ✅ **Cloud Deployment** - GPU-powered processing
- ✅ **API Documentation** - Complete endpoint coverage
- ✅ **React Frontend** - Modern UI with shadcn/ui
- ✅ **Theme Switching** - Dark/light/system themes
- ✅ **Color Palette** - Preset and custom colors
- ✅ **Real-time Processing** - Progress indicators
- ✅ **Responsive Design** - Mobile/desktop support

### **🔄 Next Steps:**

- 🔄 **React Frontend** - Beautiful UI
- 🔄 **Interactive Canvas** - Click to select
- 🔄 **Color Palette** - Multiple color options
- 🔄 **Real-time Preview** - Live color application

### **📋 Planned:**

- 📋 **User Authentication** - Account management
- 📋 **Image Gallery** - Save and share
- 📋 **Advanced Filters** - Building type detection
- 📋 **Mobile Support** - Responsive design

## 🤖 **How SAM2 Works**

### **What is SAM2?**

**SAM2** = **Segment Anything Model 2** by Meta/Facebook

- **Purpose**: Automatically finds objects in images
- **For Buildings**: Identifies walls, windows, doors, roofs
- **Accuracy**: State-of-the-art segmentation

### **How It Works:**

1. **Input**: Building image
2. **Processing**: SAM2 analyzes image structure
3. **Output**: Precise masks for different building sections
4. **Interaction**: Click to select specific areas

### **Why GPU?**

- **SAM2 Size**: 2GB+ model
- **CPU Speed**: Too slow (minutes)
- **GPU Speed**: Fast (seconds)
- **Solution**: Modal.com GPU cloud

## 🚀 **Deployment Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Modal.com     │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   (GPU + SAM2)  │
│   - UI          │    │   - API         │    │   - Processing  │
│   - Canvas      │    │   - Upload      │    │   - Storage     │
│   - Colors      │    │   - Download    │    │   - Scaling     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📈 **Performance**

### **Development Mode:**

- **Speed**: Instant (placeholder masks)
- **Accuracy**: Basic (4 rectangular areas)
- **Cost**: Free (local processing)

### **Production Mode:**

- **Speed**: 2-5 seconds (GPU processing)
- **Accuracy**: High (precise SAM2 masks)
- **Cost**: Pay-per-use (Modal.com credits)

## 🔒 **Security**

- **File Validation**: Only image files accepted
- **Size Limits**: Configurable upload limits
- **Temporary Storage**: Files auto-deleted
- **API Rate Limiting**: Prevents abuse

## 📝 **Development Timeline**

### **Day 1 (Completed):**

- ✅ Backend API structure
- ✅ SAM2 service integration
- ✅ Modal.com deployment
- ✅ Basic testing

### **Day 2 (Next):**

- 🔄 React frontend setup
- 🔄 UI components
- 🔄 Image upload interface

### **Day 3 (Planned):**

- 📋 Interactive canvas
- 📋 Color palette
- 📋 Real-time preview

### **Day 4 (Planned):**

- 📋 Integration testing
- 📋 Deployment
- 📋 Documentation

## 🤝 **Contributing**

### **Setup Development Environment:**

1. Clone repository
2. Install dependencies
3. Set up Modal.com account
4. Run tests

### **Code Style:**

- **Python**: PEP 8
- **JavaScript**: ESLint
- **TypeScript**: Strict mode
- **Documentation**: Comprehensive

## 📚 **Learning Resources**

### **SAM2:**

- [Official Paper](https://arxiv.org/abs/2401.05948)
- [GitHub Repository](https://github.com/facebookresearch/sam2)
- [Demo](https://segment-anything.com/demo)

### **Modal.com:**

- [Documentation](https://modal.com/docs)
- [Examples](https://modal.com/examples)
- [Pricing](https://modal.com/pricing)

### **FastAPI:**

- [Official Docs](https://fastapi.tiangolo.com/)
- [Tutorial](https://fastapi.tiangolo.com/tutorial/)

## 📞 **Support**

### **Issues:**

- **Backend**: Check `backend/test_backend.py`
- **Deployment**: Check Modal.com logs
- **API**: Test endpoints directly

### **Contact:**

- **GitHub Issues**: Report bugs
- **Documentation**: Check `/docs` folder
- **Development Plan**: See `DEVELOPMENT_PLAN.md`

## 📄 **License**

This project is for educational purposes. SAM2 is licensed by Meta.

---

**Built with ❤️ using SAM2, FastAPI, and Modal.com**

## 🚨 **Today's Issues & Tomorrow's Plan**

### **Issues Identified Today:**

1. **SAM2 Coordinate Rendering**: Coordinates from SAM2 model not matching frontend canvas display
2. **Image Display**: Uploaded images not showing properly on canvas
3. **Coordinate System Mismatch**: Backend and frontend using different coordinate systems

### **Tomorrow's Focus:**

1. **Fix SAM2 coordinate transformation** in `sam2_service.py`
2. **Fix canvas image scaling** in frontend components
3. **Add coordinate debugging** to track the issue
4. **Test with real images** to verify fixes

### **Files to Update:**

- `backend/services/sam2_service.py` - Add coordinate transformation
- `frontend/src/components/ImageUpload.tsx` - Fix canvas display
- `backend/modal_app.py` - Add debug logging

**See `docs/DEVELOPMENT_PLAN.md` for detailed technical solutions! 📚**
