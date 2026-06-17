"use client"

import { Box, Button, Stack } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import Iconify from 'src/components/iconify'
import ModelViewerComponent from './model-viewer-component'

interface ARViewerProps {
    modelPath: string
    onClose?: () => void
    title?: string
    tabs?: any[]
    currentColorObject?: any
    color?: string
    scrollableTab?: string
}

export function ARViewer({ modelPath, onClose, title, tabs = [], currentColorObject = {}, color = '', scrollableTab = '' }: ARViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [arSupported, setArSupported] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Check for WebXR support
        const checkAR = async () => {
            try {
                const xrSupport = !!navigator.xr
                setArSupported(xrSupport)
                
                if (!xrSupport) {
                    console.warn('⚠️ WebXR not supported - AR will not be available')
                } else {
                    console.log('✅ WebXR supported - AR is available')
                }
            } catch (err) {
                console.error('Error checking AR support:', err)
            }
        }

        checkAR()
    }, [])

    const getModelViewer = () => {
        return containerRef.current?.querySelector('model-viewer')
    }

    const handleOpenAR = async () => {
        const modelViewer = getModelViewer() as any
        try {
            if (modelViewer && modelViewer.activateAR) {
                console.log('🎯 Activating AR...')
                await modelViewer.activateAR()
            } else {
                console.warn('❌ AR not available')
                if (!arSupported) {
                    alert('AR not supported on this device. This device does not have WebXR support.')
                } else {
                    alert('Model-viewer element not found')
                }
            }
        } catch (error) {
            console.error('❌ AR activation failed:', error)
            setError('AR activation failed. Try again or check device compatibility.')
        }
    }

    const handleDownloadModel = () => {
        const modelViewer = getModelViewer() as any
        try {
            if (modelViewer && modelViewer.downloadModel) {
                console.log('📥 Downloading model...')
                modelViewer.downloadModel()
            } else {
                console.warn('Download not available')
            }
        } catch (error) {
            console.error('Download failed:', error)
        }
    }

    if (error) {
        return (
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '12px',
                }}
            >
                <Box sx={{ textAlign: 'center', padding: '32px' }}>
                    <p>❌ Error: {error}</p>
                    <p>Check console for more details</p>
                </Box>
            </Box>
        )
    }

    return (
        <Box 
            ref={containerRef}
            sx={{ 
                position: 'relative', 
                width: '100%', 
                height: '100%',
                minHeight: '600px',
            }}
        >
            {/* Loading indicator */}
            {isLoading && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 5,
                        textAlign: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        padding: '20px 40px',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                >
                    <p style={{ margin: '0 0 8px', fontWeight: 500 }}>⏳ Loading 3D Model...</p>
                    <p style={{ fontSize: '12px', color: '#999', margin: '0' }}>{modelPath}</p>
                </Box>
            )}
            {/* Model Viewer Container */}
            <ModelViewerComponent
                src={modelPath}
                alt="3D Watch Model"
                cameraControls={true}
                autoRotate={false}
                ar={true}
                arModes="webxr scene-viewer quick-look"
                exposure={1}
                shadowIntensity={1}
                environmentImage="/city.exr"
                onLoad={() => {
                    console.log('✅ Model loaded successfully')
                    setIsLoading(false)
                }}
                onError={(err) => {
                    console.error('❌ Model loading error:', err)
                    setError('Failed to load 3D model. Check the model path and file format.')
                }}
            />

            {/* AR Controls Overlay */}
            {arSupported && (
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        position: 'absolute',
                        bottom: 20,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        padding: '8px 12px',
                        borderRadius: '24px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        alignItems: 'center',
                    }}
                >
                    {/* Color indicator */}
                    {color && (
                        <Box
                            sx={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                backgroundColor: color,
                                border: '2px solid #999',
                                cursor: 'default',
                            }}
                            title={`Selected color: ${color}`}
                        />
                    )}
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<Iconify icon="eva:eye-outline" />}
                        onClick={handleOpenAR}
                        sx={{
                            textTransform: 'none',
                            borderRadius: '20px',
                            backgroundColor: '#000',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#333',
                            },
                        }}
                    >
                        View in AR
                    </Button>
                    <Button
                        size="small"
                        variant="text"
                        startIcon={<Iconify icon="eva:download-outline" />}
                        onClick={handleDownloadModel}
                        sx={{
                            textTransform: 'none',
                        }}
                    >
                        Download
                    </Button>
                </Stack>
            )}

            {/* Close Button */}
            {onClose && (
                <Button
                    variant="contained"
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        zIndex: 11,
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        color: '#000',
                        '&:hover': {
                            backgroundColor: '#f0f0f0',
                        },
                    }}
                    onClick={onClose}
                >
                    Close
                </Button>
            )}

            {!arSupported && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 20,
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: '#fff',
                            padding: '32px',
                            borderRadius: '12px',
                            textAlign: 'center',
                        }}
                    >
                        <p>AR is not supported on your device</p>
                        <p>Please use a device with WebXR support</p>
                    </Box>
                </Box>
            )}
        </Box>
    )
}

export default ARViewer
