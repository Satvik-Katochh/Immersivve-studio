# Building Segmentation App - Frontend

A modern React + TypeScript frontend for the AI-powered Building Segmentation application.

## 🚀 Features

- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Dark/Light Theme**: Toggle between themes with smooth transitions
- **Drag & Drop Upload**: Intuitive image upload with validation
- **Real-time Processing**: Live progress indicators and status updates
- **Interactive Canvas**: Click to generate AI masks
- **Color Palette**: Beautiful color picker with preset and custom colors
- **Responsive Design**: Works perfectly on desktop and mobile
- **Error Handling**: Graceful error handling with user-friendly messages

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **shadcn/ui** for beautiful, accessible components
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **next-themes** for theme switching

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Components

### Core Components

- **ImageUpload**: Drag & drop file upload with validation
- **ColorPalette**: Color picker with presets and custom colors
- **ProcessingStates**: Loading animations and progress indicators
- **ThemeToggle**: Dark/light theme switcher

### shadcn/ui Components Used

- Button, Card, Input, Progress
- Toast, Dialog, Tooltip, Badge
- Dropdown Menu for theme switching

## 🔧 Configuration

### API Integration

The frontend connects to the backend API endpoints:

- `POST /upload` - Image upload
- `POST /generate-masks` - SAM2 mask generation
- `POST /apply-color` - Color application
- `GET /download/{filename}` - Download results

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=https://satvik-katochh--building-segmentation-sam2-generate-mask-cd2bf7.modal.run
```

## 🎯 User Flow

1. **Upload**: Drag & drop or browse for building images
2. **Process**: Click on building sections to generate AI masks
3. **Color**: Select masks and apply colors from the palette
4. **Download**: Export the final colored segmentation

## 🎨 Design System

### Colors
- **Primary**: Stone theme with customizable colors
- **Dark Mode**: Premium dark theme with proper contrast
- **Light Mode**: Clean light theme for accessibility

### Typography
- **Font**: System fonts with fallbacks
- **Sizes**: Responsive text sizing
- **Weights**: Proper font weight hierarchy

### Spacing
- **Grid**: 8px base unit
- **Padding**: Consistent spacing system
- **Margins**: Proper component spacing

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Other Platforms

The app can be deployed to any static hosting platform:

- Netlify
- GitHub Pages
- AWS S3
- Firebase Hosting

## 🔍 Development

### Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── ImageUpload.tsx
│   ├── ColorPalette.tsx
│   ├── ProcessingStates.tsx
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── services/
│   └── api.ts        # API integration
├── hooks/
│   └── use-toast.ts  # Toast notifications
├── lib/
│   └── utils.ts      # Utility functions
└── App.tsx           # Main application
```

### Adding New Components

```bash
# Add new shadcn/ui component
npx shadcn@latest add [component-name]

# Example
npx shadcn@latest add slider
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## 📱 Responsive Design

The app is fully responsive with breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## ♿ Accessibility

- **ARIA Labels**: Proper accessibility attributes
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Compatible with screen readers
- **Color Contrast**: WCAG compliant contrast ratios

## 🎨 Customization

### Themes

The app supports multiple themes:

- **Dark**: Default premium dark theme
- **Light**: Clean light theme
- **System**: Follows system preference

### Colors

Customize colors in `src/index.css`:

```css
:root {
  --primary: 24 9.8% 10%;
  --primary-foreground: 60 9.1% 97.8%;
  /* ... more colors */
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Theme not switching**: Check if `next-themes` is properly installed
2. **API errors**: Verify the API URL in the service
3. **Build errors**: Ensure all dependencies are installed

### Debug Mode

```bash
# Run with debug logging
DEBUG=* npm run dev
```

## 📄 License

This project is part of the Building Segmentation App. See the main project README for license information.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Built with ❤️ using React, TypeScript, and shadcn/ui**
