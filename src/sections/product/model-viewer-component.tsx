"use client"

import { useEffect, useRef } from 'react'

interface ModelViewerProps {
    src: string
    alt?: string
    cameraControls?: boolean
    autoRotate?: boolean
    ar?: boolean
    arModes?: string
    exposure?: number
    shadowIntensity?: number
    environmentImage?: string
    onLoad?: () => void
    onError?: (error: Error) => void
}

/**
 * Native wrapper for model-viewer web component
 * Properly initializes and manages the WebGL context
 */
export const ModelViewerComponent = ({
    src,
    alt = '3D Model',
    cameraControls = true,
    autoRotate = true,
    ar = true,
    arModes = 'webxr scene-viewer quick-look',
    exposure = 1,
    shadowIntensity = 1,
    onLoad,
    onError,
}: ModelViewerProps) => {
    const modelViewerRef = useRef<any>(null)

    useEffect(() => {
        // Ensure model-viewer is loaded
        const script = document.querySelector('script[src*="model-viewer"]')
        if (!script) {
            const modelViewerScript = document.createElement('script')
            modelViewerScript.type = 'module'
            modelViewerScript.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js'
            modelViewerScript.async = true
            document.head.appendChild(modelViewerScript)

            modelViewerScript.onload = () => {
                console.log('model-viewer library loaded from CDN')
            }
            modelViewerScript.onerror = () => {
                console.error('Failed to load model-viewer from CDN')
                if (onError) {
                    onError(new Error('Failed to load model-viewer library'))
                }
            }
        }

        const modelViewer = modelViewerRef.current
        if (modelViewer) {
            // Handle load event
            const handleLoad = () => {
                console.log('Model loaded successfully:', src)
                if (onLoad) onLoad()
            }

            // Handle error event
            const handleError = (e: any) => {
                console.error('Model loading error:', e)
                if (onError) onError(new Error(`Failed to load model: ${src}`))
            }

            modelViewer.addEventListener('load', handleLoad)
            modelViewer.addEventListener('error', handleError)

            return () => {
                modelViewer.removeEventListener('load', handleLoad)
                modelViewer.removeEventListener('error', handleError)
            }
        }
    }, [src, onLoad, onError])

    return (
        <model-viewer
            ref={modelViewerRef}
            src={src}
            alt={alt}
            camera-controls={cameraControls ? 'true' : 'false'}
            auto-rotate={autoRotate ? 'true' : 'false'}
            ar={ar ? 'true' : 'false'}
            ar-modes={arModes}
            exposure={exposure.toString()}
            shadow-intensity={shadowIntensity.toString()}
            style={{
                width: '100%',
                height: '100%',
                minHeight: '600px',
                backgroundColor: '#fff',
            }}
        />
    )
}

export default ModelViewerComponent
