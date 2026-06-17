# Google Model Viewer AR Integration Guide

## Overview

The AR (Augmented Reality) view allows users to see your 3D watch model in their real environment through their device camera.

## How It Works

1. **Toggle AR Mode**: Click the cube icon (🎮) in the top-left corner of the customization dialog
2. **View in AR**: Tap the "View in AR" button to launch the AR experience
3. **Interact**: Move your device around to see the watch in your space

## Key Features

- ✅ **WebXR Support**: Uses device's native AR capabilities
- ✅ **Camera Controls**: Users can rotate and scale the object
- ✅ **Auto Rotation**: 3D model auto-rotates for visual appeal
- ✅ **Environment Lighting**: Uses HDR environment image for realistic lighting
- ✅ **Download Option**: Users can download the model file

## Browser & Device Support

### WebXR AR Support:
- **iOS 12+**: Safari with AR Quick Look (auto-detects)
- **Android 8+**: Chrome/Edge with WebXR enabled
- **Desktop**: Limited AR support, mainly for development

### Browser Configuration:
1. **Chrome/Edge (Android)**:
   - Ensure WebXR is enabled
   - Navigate to `chrome://flags` or `edge://flags`
   - Search for "WebXR"
   - Enable all WebXR-related flags

2. **Safari (iOS)**:
   - iOS 12+ automatically supports USDZ format
   - Model Viewer uses native Quick Look

## AR Modes Priority

The component supports multiple AR modes (used in order of availability):
```
1. webxr        - Web XR API (Android, PC with AR)
2. scene-viewer - Google Play Services (Android)
3. quick-look   - Apple Quick Look (iOS)
```

## Model Format Requirements

### For AR to work properly:
- **GLB/GLTF**: Works on all platforms
- **USDZ**: iOS native format (recommended for iOS)
- **Model size**: Keep < 50MB for optimal performance

### If using USDZ for iOS:
Add the `ios-src` attribute in the AR Viewer component:
```tsx
<Box
  component="model-viewer"
  iosSrc="path/to/your-model.usdz"  // iOS will use this
  src="path/to/your-model.glb"      // Fallback for Android
  ar
  arModes="webxr scene-viewer quick-look"
/>
```

## Customization Options

### AR Viewer Props:
```tsx
<ARViewer
  modelPath="/models/your-model.glb"
  onClose={() => handleClose()}
  title="Watch AR Preview"
/>
```

### HTML Attributes (in ar-viewer.tsx):
```tsx
src={modelPath}                      // Model file path
alt="3D Model"                       // Accessibility
cameraControls                       // Allow user camera adjustment
autoRotate                           // Spin the model
ar                                   // Enable AR mode
arModes="webxr scene-viewer quick-look"  // AR priority order
environmentImage="/city.exr"         // HDR lighting
exposure={0.8}                       // Brightness adjustment
shadowIntensity={1}                  // Shadow strength
```

## Troubleshooting

### AR Button Not Appearing:
- Device doesn't support WebXR
- Browser doesn't have WebXR enabled
- Check console for errors: `navigator.xr` is undefined

### Model Doesn't Load:
- Check model path is correct
- Verify file format (GLB/GLTF)
- Check browser network tab for 404 errors
- Model file too large or corrupted

### AR View Looks Dark/Bright:
- Adjust `exposure` prop (0.0 - 2.0)
- Change `environmentImage` to different .exr file
- Adjust `shadowIntensity` (0.0 - 1.0)

### iOS AR Not Working:
- Ensure iOS 12+
- Add `ios-src` attribute with USDZ file
- Check Safari is up to date
- Try the USDZ file directly in Safari

## Files Modified

### New Files:
- `src/sections/product/ar-viewer.tsx` - AR view component
- `src/sections/product/model-viewer.d.ts` - TypeScript declarations

### Updated Files:
- `src/sections/product/watch.tsx` - Integrated AR toggle

## Next Steps

1. **Test on Device**: Use your phone/tablet to test AR
2. **Optimize Model**: Reduce polygon count if AR performance is slow
3. **Add USDZ Version**: Create USDZ alternative for iOS optimization
4. **Customize Colors**: Extend AR view to show color customization

## Example: Adding USDZ Support

```tsx
<Box
  component="model-viewer"
  ref={modelViewerRef}
  src={modelPath}
  iosSrc={modelPath.replace('.glb', '.usdz')}
  ar
  arModes="webxr scene-viewer quick-look"
  cameraControls
  autoRotate
/>
```

## Performance Tips

1. **Model Optimization**:
   - Keep polygons < 100k for smooth AR
   - Use texture atlasing
   - Compress textures

2. **File Size**:
   - Aim for < 20MB models
   - Use WebP textures when possible

3. **Network**:
   - Host models on CDN
   - Use compression (gzip)
   - Preload models on initial dialog open

## API Methods (Advanced)

The ModelViewerElement has useful methods:

```tsx
const modelViewer = modelViewerRef.current as any

// Activate AR
await modelViewer.activateAR()

// Download model
modelViewer.downloadModel()

// Take screenshot
const dataUrl = await modelViewer.toDataURL()

// Access camera
modelViewer.getCameraTarget()  // [x, y, z]
modelViewer.getCameraOrbit()   // [theta, phi, radius]
```

## Resources

- [Google Model Viewer Docs](https://modelviewer.dev/)
- [WebXR API](https://immersiveweb.github.io/)
- [Three.js Documentation](https://threejs.org/docs/)
- [GLB Format Spec](https://www.khronos.org/gltf/)
