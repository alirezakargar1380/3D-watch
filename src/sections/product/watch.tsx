"use client"

import { Canvas, useThree } from '@react-three/fiber'
import { Environment, OrbitControls, useGLTF } from '@react-three/drei'
import { useCallback, useEffect, useState } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, IconButton, Stack, Tab, Tabs } from '@mui/material'
import { ColorPicker, ColorPreview } from 'src/components/color-utils'
import { ReturnType } from 'src/hooks/use-boolean'
import Iconify from 'src/components/iconify'
import * as THREE from 'three';
import { IProductTabs } from 'src/types/product';

function CameraController({ zoom, position }: { zoom: number, position: any }) {
    const { camera } = useThree();

    useEffect(() => {
        camera.zoom = zoom;
        camera.position.set(position[0], position[1], position[2])
        camera.updateProjectionMatrix()
    }, [zoom, position, camera])

    return null
}


function Watch({ colorObject, model_path, onSendColor }: any) {
    const { materials, nodes }: any = useGLTF(model_path)

    useEffect(() => {
        const newObjectColor = { ...colorObject }
        Object.keys(nodes)?.map((key, index) => {
            const child = nodes[key];
            if (child.isMesh && colorObject[child.name]) {
                child.material = child.material.clone()
                newObjectColor[child.name] = colorObject[child.name];
                child.material.color.set(colorObject[child.name])
            }
        })
        onSendColor(newObjectColor)
    }, [colorObject])

    return (
        <group>
            {Object.keys(nodes)?.map((key, index) => {
                const mesh = nodes[key];
                if (mesh.type === 'Mesh') {
                    return (
                        <primitive object={mesh} key={index}></primitive>
                    )
                }
            })}
        </group>
    )
}

interface Props {
    dialog: ReturnType;
    model_path: string;
    tabs: IProductTabs[];
    colors: string[];
    afterSubmit: (object: any) => void;
}

export default function Viewer({ dialog, model_path, tabs, colors, afterSubmit }: Props) {
    const [currentColorObject, setOb] = useState<any>({});
    const [newColorObject, setnewOb] = useState<any>({});
    const [zoom, setZoom] = useState(4);
    const [isLocked, setIsLocked] = useState(false);
    const [scrollableTab, setScrollableTab] = useState(tabs?.[0]?.key);

    const handleChange = (key: string, newValue: any) => {
        setOb((prevState: any) => ({
            ...prevState,
            [key]: newValue,
        }));
    }

    const handleChangeScrollableTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
        setScrollableTab(newValue);
    }, []);

    const handleSelectColors = (color: any, key: string) => {
        console.log("keyyy", key)
        handleChange(key, color);
    }

    const currentTab = tabs.find((tb) => tb.key === scrollableTab);

    console.log('currentTab', currentColorObject[scrollableTab] || '')

    return (

        <Dialog open={dialog.value} onClose={dialog.onFalse} fullScreen

            PaperProps={{
                sx: {
                    backgroundColor: '#f4f4f2'
                }
            }}
        >
            {/* <DialogTitle sx={{ backgroundColor: 'transparent!important' }}>
                <IconButton color='error' onClick={dialog.onFalse}>
                    Close
                </IconButton>
            </DialogTitle> */}
            <DialogContent sx={{ px: 0 }}>
                <Box component={'div'} position={'absolute'} zIndex={10} top={20} right={20}>
                    <Button color='secondary' variant='outlined' onClick={() => {
                        dialog.onFalse()
                        afterSubmit(currentColorObject)
                    }}>
                        done
                    </Button>
                </Box>
                <Box component={'div'} position={'absolute'} zIndex={10} top={20} left={20}>
                    <IconButton onClick={() => setIsLocked(!isLocked)}>
                        <Iconify color={'black'} icon={!isLocked ? "ic:twotone-lock" : "eva:unlock-outline"} width={36} />
                    </IconButton>
                </Box>
                <Box height={1} component={'div'}>
                    <Box component={'div'} sx={{ height: 1 }}>
                        <Box component={'div'} sx={{ height: 1 }}>
                            <Canvas

                                camera={{
                                    // position: [0, 10, 0],
                                    position: [0, 10, 10],
                                    // zoom: 0,

                                }}
                                gl={{
                                    toneMapping: THREE.ACESFilmicToneMapping,
                                    outputColorSpace: THREE.SRGBColorSpace,
                                    toneMappingExposure: 1.2,
                                    antialias: true,
                                    alpha: true,
                                    preserveDrawingBuffer: true
                                }}
                                flat
                                legacy={false}
                            >

                                {/* <color attach="background" args={['#f4f4f2']} /> */}

                                <CameraController zoom={currentTab?.zoom || 1} position={[currentTab?.x || 0, currentTab?.y || 10, currentTab?.z || 0]} />

                                <color attach="background" args={['#eeeeee']} />
                                <Environment files='/city.exr' blur={60} />

                                <ambientLight intensity={0.05} />

                                <Watch
                                    colorObject={currentColorObject}
                                    model_path={model_path}
                                    onSendColor={(obj: any) => setnewOb(obj)}
                                />

                                <OrbitControls enableDamping={isLocked} enablePan={isLocked} enableRotate={isLocked} enableZoom={isLocked} />
                            </Canvas>
                        </Box>

                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{
                backgroundColor: '#fff',
                display: 'block',
                borderTopRightRadius: 24,
                borderTopLeftRadius: 24,
                boxShadow: '1px 0px 20px 11px #00000008'
            }}>
                <Box width={1} component={'div'} mb={2}>
                    <Box component={'span'} display={'block'} height={'4px'} width={'60px'} mx={'auto'} borderRadius={'16px'} bgcolor={'#bfbfbf'} />
                </Box>

                <Box component={'div'}>
                    <Tabs
                        value={scrollableTab}
                        sx={{
                            '& .MuiTabs-flexContainer': {
                                justifyContent: 'center'
                            }
                        }}
                        onChange={handleChangeScrollableTab}
                    >
                        {tabs.map((tab: IProductTabs) => (
                            <Tab key={tab.key} label={tab.tab_name} value={tab.key} />
                        ))}
                    </Tabs>
                </Box>

                <Stack direction={{ xs: 'column', md: 'row' }} sx={{ mx: 0, mt: 2 }} justifyContent={'center'} spacing={1}>
                    <Box component={'div'} textAlign={'center'}>
                        <ColorPicker
                            colors={tabs.find((tab) => tab.key === scrollableTab)?.colors.map((color) => color.code) || ['#fff']}
                            selected={currentColorObject[scrollableTab] || ''}
                            onSelectColor={(color: any) => handleSelectColors(color, currentTab?.key || '')}
                        />
                    </Box>


                    {/* {Object.keys(ob).map((key: string) => {
                        return (
                            <Stack direction={'column'}>
                                <Box component={'div'}>
                                    {key}
                                </Box>
                                <MuiColorInput format="hex" value={'#f4f4f2'} onChange={(color) => handleChange(TABS.find((tb) => tb.value === scrollableTab)?.key || '', color)} />
                            </Stack>
                        )
                    })} */}
                </Stack>

                {/* <Button variant='contained' color='primary'>Send This To Cart</Button> */}
            </DialogActions>
        </Dialog>



    )
}
