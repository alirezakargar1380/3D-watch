"use client"

import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { useCallback, useEffect, useState } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Tab, Tabs } from '@mui/material'
import { ColorPicker, ColorPreview } from 'src/components/color-utils'
import { MuiColorInput } from 'mui-color-input'
import { ReturnType } from 'src/hooks/use-boolean'
import Iconify from 'src/components/iconify'
import { Vector3 } from 'three';

const TABS = [
    {
        value: 'one',
        icon: <Iconify icon="solar:phone-bold" width={24} />,
        label: 'Background',
        key: 'Circle005',
        zoom: 4,
        position: [0, 10, 0]
    },
    {
        value: 'two',
        icon: <Iconify icon="solar:heart-bold" width={24} />,
        label: 'Bezel',
        key: 'Circle005_1',
        zoom: 5,
        position: [0, 10, 0]
    },
    {
        value: 'three',
        icon: <Iconify icon="eva:headphones-fill" width={24} />,
        label: 'Indices',
        key: 'Circle005_2',
        zoom: 20,
        position: [10, 3, 6]

    },
    {
        value: 'four',
        icon: <Iconify icon="eva:headphones-fill" width={24} />,
        label: 'Hand hub',
        key: 'Circle005_3',
        zoom: 20,
        position: [0, 10, 10]
    },
    {
        value: 'five',
        icon: <Iconify icon="eva:headphones-fill" width={24} />,
        label: 'Hands',
        key: 'Circle005_4',
        zoom: 18,
        position: [4, 14, 16]
    },
];

function CameraController({ zoom, position }: { zoom: number, position: any }) {
    const { camera } = useThree();

    useEffect(() => {
        camera.zoom = zoom;
        camera.position.set(position[0], position[1], position[2])
        camera.updateProjectionMatrix()
    }, [zoom, position, camera])

    return null
}


function Watch({ bodyColor, bezelColor, strapColor, colorObject, onSendColor, }: any) {
    const { materials, nodes }: any = useGLTF('/models/ff.glb')
    const [ob, setOb] = useState<any>({});
    //   const { materials, nodes }: any = useGLTF('/models/watch.glb')

    useEffect(() => {
        const object: any = {};
        for (let i = 0; i < nodes.background_of_watch.children.length; i++) {
            const mesh: any = nodes.background_of_watch.children[i];
            object[mesh.name] = mesh.material.color;
        }
        setOb(object)
        onSendColor(object)
    }, [nodes])

    useEffect(() => { console.log(colorObject) }, [colorObject])



    return (
        <group>
            {/* <mesh geometry={nodes.Cube.geometry}>
        <meshStandardMaterial color={bodyColor} />
      </mesh> */}
            {nodes.background_of_watch.children.map((mesh: any) => {
                // console.log(mesh.material.color)
                return (
                    <mesh geometry={mesh.geometry}>
                        <meshStandardMaterial color={colorObject[mesh.name]} />
                    </mesh>
                )
            })}

            {/* <mesh geometry={nodes.Circle001.geometry}>
        <meshStandardMaterial color={bezelColor} />
      </mesh> */}

            {/*
      <mesh geometry={nodes.Strap.geometry}>
        <meshStandardMaterial color={strapColor} />
      </mesh> */}
        </group>
    )
}

interface Props {
    dialog: ReturnType
}

export default function Viewer({ dialog }: Props) {
    const [ob, setOb] = useState<any>({});
    const [zoom, setZoom] = useState(4)

    const handleChange = (key: string, newValue: any) => {
        setOb((prevState: any) => ({
            ...prevState,
            [key]: newValue,
        }));
    }

    const [scrollableTab, setScrollableTab] = useState('one');

    const handleChangeScrollableTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
        setScrollableTab(newValue);

        const tabZoom = TABS.find((tb) => tb.value === newValue)?.zoom;
        console.log('tabZoom', tabZoom)
        if (tabZoom) {
            setZoom(tabZoom)
        }
    }, []);

    const handleSelectColors = (color: any, key: string) => {
        handleChange(key, color);
    }

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
                    <Button color='secondary' variant='outlined' onClick={dialog.onFalse}>done</Button>
                </Box>
                <Box height={1} component={'div'}>
                    <Box component={'div'} sx={{ height: 1 }}>
                        <Box component={'div'} sx={{ height: 1 }}>
                            <Canvas

                                camera={{
                                    // position: [0, 10, 0],
                                    position: [0, 10, 10],
                                    // zoom: TABS.find((tb) => tb.value === scrollableTab)?.zoom || 4,

                                }}>

                                <color attach="background" args={['#f4f4f2']} />

                                <CameraController zoom={TABS.find((tb) => tb.value === scrollableTab)?.zoom || 8} position={TABS.find((tb) => tb.value === scrollableTab)?.position} />

                                <ambientLight />
                                <directionalLight position={[0, 10, 0]} />

                                <Watch
                                    bodyColor="silver"
                                    bezelColor="black"
                                    strapColor="brown"
                                    colorObject={ob}
                                    onSendColor={(obj: any) => setOb(obj)}
                                />

                                <OrbitControls enableDamping={false} enablePan={false} enableRotate={false} enableZoom={false} />
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
                    <Tabs value={scrollableTab} onChange={handleChangeScrollableTab}>
                        {TABS.map((tab) => (
                            <Tab key={tab.value} label={tab.label} value={tab.value} />
                        ))}
                    </Tabs>
                </Box>

                <Stack direction={{ xs: 'column', md: 'row' }} sx={{ mx: 0, mt: 2 }} justifyContent={'center'} spacing={1}>
                    <Box component={'div'} textAlign={'center'}>
                        <ColorPicker
                            colors={['#979797', '#ffff00', '#fd0000', '#000', '#ff9900', '#0051ff']}
                            selected={''}
                            onSelectColor={(color: any) => handleSelectColors(color, TABS.find((tb) => tb.value === scrollableTab)?.key || '')}
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
