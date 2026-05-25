"use client"

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, OrbitControls, Text, Center, Text3D, useGLTF } from '@react-three/drei'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
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


function Watch({ text, tab_name, color, colorObject, model_path, colors, onSendColor }: any) {
    const { materials, nodes }: any = useGLTF(model_path)

    useEffect(() => {
        const selectedColorObject = colors?.find((c: any) => c.code === color);
        // console.log('nodes', nodes['Cylinder'].position);
        console.log('tab_name', tab_name);
        console.log('colors', colors);
        console.log('color', colorObject);
        console.log('selectedColorObject', selectedColorObject);
        console.log('materials', materials);

        const newObjectColor = { ...colorObject }
        Object.keys(nodes)?.map((key, index) => {
            const child = nodes[key];

            if (!selectedColorObject) return console.log('cant find color object')

            // if (colorObject[child?.material?.name]) {
            //     console.log(child.material.name, colorObject[child?.material?.name])
            //     const color = colors?.find((c: any) => c.material_name === child?.material?.name && c.code === colorObject[child?.material?.name])


            //     child.material = materials[child?.material?.name].clone();
            //     child.material.color.set(colorObject[child?.material?.name]);

            //     if (color?.roughness)
            //         child.material.roughness = +color.roughness;
            //     const name = child?.material?.name;
            //     newObjectColor[name] = colorObject[name];
            // }

            // console.log(child)

            // if (colorObject?.material_name && child?.material?.name) {

            if (selectedColorObject?.all) {
                console.log('selectedColorObject', selectedColorObject)
                child.material = materials[selectedColorObject.material_name].clone();
                child.material.color.set(selectedColorObject.code);
                if (selectedColorObject?.roughness)
                    child.material.roughness = +selectedColorObject.roughness;
            } else {
                if (selectedColorObject.objects.includes(child.name)) {
                    child.material = materials[selectedColorObject.material_name].clone();
                    child.material.color.set(selectedColorObject.code);
                    if (selectedColorObject?.roughness)
                        child.material.roughness = +colorObject.roughness;
                }
            }

        })
        // Object.keys(nodes)?.map((key, index) => {
        //     const child = nodes[key];
        //     if (child.isMesh && colorObject[child.name]) {
        //         child.material = child.material.clone()
        //         newObjectColor[child.name] = colorObject[child.name];
        //         child.material.color.set(colorObject[child.name])
        //     }
        // })
        onSendColor(newObjectColor)
    }, [colorObject])

    return (
        <>
            <group position={[0, 0, 0.5]}>
                <Center key={text}>
                    <Text3D          // x, y, z relative to scene
                        size={0.05}
                        font="/fonts/Roboto_Regular.json"  // optional custom font
                        // bevelEnabled
                        bevelThickness={0.002}
                        bevelSize={0.005}
                        height={0.002}
                        position={[0, 0, 0]}
                        rotation={[-Math.PI / 2, 0, 0]}      // 90 deg around X axis
                    // anchorX="center"                    // center text horizontally at position.x
                    // anchorY="middle"  
                    >
                        {text}
                        {(model_path === '/models/salib-clock.glb') && (
                            <primitive object={materials['salib']?.clone()} />
                        )}
                    </Text3D>
                </Center>
            </group>


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
        </>

    )
}

// interface CameraProps {
//     camPos: [number, number, number];    // Where the camera should go
//     targetPos: [number, number, number]; // Where the camera should look
//     zoomLevel: number;                   // For Orthographic zoom or FOV adjustment
// }
interface CameraProps {
    camPos: [number, number, number];    // Where the camera is
    targetPos: [number, number, number]; // What the camera looks at
    zoomLevel: number;
}

// function ManualCameraController({ camPos, targetPos, zoomLevel }: CameraProps) {
//     const vCam = new THREE.Vector3();
//     const vTar = new THREE.Vector3();

//     useFrame((state) => {
//         state.camera.position.lerp(vCam.set(...camPos), 0.1);

//         const currentTarget =
//             state.camera.userData.target || new THREE.Vector3(0, 0, 0);
//         currentTarget.lerp(vTar.set(...targetPos), 0.1);
//         state.camera.userData.target = currentTarget;

//         // Avoid the singularity by using a fallback up vector
//         const forward = new THREE.Vector3()
//             .subVectors(currentTarget, state.camera.position)
//             .normalize();
//         const defaultUp = new THREE.Vector3(0, 1, 0);
//         if (Math.abs(forward.dot(defaultUp)) > 0.999) {
//             console.log("up")
//             state.camera.up.set(0, 1, -1);  // or (1,0,0) – whichever gives the desired orientation
//         } else {
//             console.log("down")
//             state.camera.up.set(0, 1, 0);
//         }
//         state.camera.lookAt(currentTarget);

//         state.camera.zoom = THREE.MathUtils.lerp(state.camera.zoom, zoomLevel, 0.1);
//         state.camera.updateProjectionMatrix();
//     });

//     return null;
// }

function ManualCameraController({ camPos, targetPos, zoomLevel }: CameraProps) {
    const vCam = useRef(new THREE.Vector3());
    const vTar = useRef(new THREE.Vector3());
    const defaultUp = new THREE.Vector3(0, 1, 0);
    const fallbackUp = new THREE.Vector3(0, 1, -1);   // consistent “north” when looking straight down

    useFrame((state) => {
        // 1. Smooth camera position
        state.camera.position.lerp(vCam.current.set(...camPos), 0.05);

        // 2. Smooth lookAt target
        const currentTarget = state.camera.userData.target || new THREE.Vector3();
        currentTarget.lerp(vTar.current.set(...targetPos), 0.05);
        state.camera.userData.target = currentTarget;

        // 3. Determine desired up vector (avoid singularity)
        const forward = new THREE.Vector3()
            .subVectors(currentTarget, state.camera.position)
            .normalize();

        // If camera is almost directly above/below the target, switch to fallback up
        const desiredUp = Math.abs(forward.dot(defaultUp)) > 0.999
            ? fallbackUp
            : defaultUp;

        // 4. Smoothly animate the up vector
        state.camera.up.lerp(desiredUp, 0.05).normalize();

        // 5. Apply lookAt using the (animated) up vector
        state.camera.lookAt(currentTarget);

        // 6. Smooth zoom
        state.camera.zoom = THREE.MathUtils.lerp(state.camera.zoom, zoomLevel, 0.1);
        state.camera.updateProjectionMatrix();
    });

    return null;
}

interface Props {
    dialog: ReturnType;
    model_path: string;
    tabs: IProductTabs[];
}

export default function Viewer({ dialog, model_path, tabs }: Props) {
    const [currentColorObject, setOb] = useState<any>({});
    const [color, setColor] = useState('');
    const [newColorObject, setnewOb] = useState<any>({});
    const [zoom, setZoom] = useState(4);
    const [text, setText] = useState('');
    const [isLocked, setIsLocked] = useState(false);
    const [scrollableTab, setScrollableTab] = useState(tabs?.[0]?.tab_name);
    const targetXYZ: [number, number, number] = [0, 0, 0];

    const handleChange = (tab_name: string, newValue: any) => {
        setOb((prevState: any) => ({
            ...prevState,
            [tab_name]: newValue,
        }));
    }

    const handleChangeScrollableTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
        setScrollableTab(newValue);
    }, []);

    const handleSelectColors = (color: any, tab_name: string) => {
        setColor(color)
        // setTabName(tab_name)
        handleChange(tab_name, color);
    }

    const currentTab = tabs.find((tb) => tb.tab_name === scrollableTab);

    // add the default colors
    useEffect(() => {
        for (let i = 0; i < tabs.length; i++) {
            const tab = tabs[i];
            if (tab.tab_name === scrollableTab) {
                console.log('tab def', tab)
                handleSelectColors(tab.default_color, tab.tab_name)
            }
        }
    }, [scrollableTab])

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
                        // afterSubmit(currentColorObject)
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
                            <Canvas shadows>
                                <Watch
                                    tab_name={scrollableTab}
                                    text={text}
                                    color={color}
                                    colors={tabs.find((t) => t.tab_name === scrollableTab)?.colors}
                                    colorObject={currentColorObject}
                                    model_path={model_path}
                                    onSendColor={(obj: any) => setnewOb(obj)}
                                />
                                {(!isLocked) && (
                                    <ManualCameraController
                                        zoomLevel={currentTab?.zoom || 1}
                                        camPos={[Number(currentTab?.x) || 0, Number(currentTab?.y) || 10, Number(currentTab?.z) || 0]}
                                        targetPos={targetXYZ}
                                    />
                                )}
                                {(isLocked) && (
                                    <OrbitControls />
                                )}


                                {/* <color attach="background" args={['#f4f4f2']} /> */}

                                {/* <CameraController zoom={currentTab?.zoom || 1} position={[currentTab?.x || 0, currentTab?.y || 10, currentTab?.z || 0]} /> */}

                                <color attach="background" args={['#eeeeee']} />
                                <Environment files='/city.exr' blur={60} />

                                <ambientLight intensity={0.05} />




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
                            <Tab key={tab.tab_name} label={tab.tab_name} value={tab.tab_name} />
                        ))}
                        {(model_path === '/models/salib-clock.glb') && (
                            <Tab label={'Text'} value={'text'} />
                        )}
                    </Tabs>
                </Box>

                <Stack direction={{ xs: 'column', md: 'row' }} sx={{ mx: 0, mt: 2 }} justifyContent={'center'} spacing={1}>
                    <Box component={'div'} textAlign={'center'}>
                        {(model_path === '/models/salib-clock.glb') && (
                            <input onChange={(e) => setText(e.target.value)} />
                        )}
                        <ColorPicker
                            colors={tabs.find((tab) => tab.tab_name === scrollableTab)?.colors.map((color) => color.code) || ['#fff']}
                            selected={currentColorObject[scrollableTab] || ''}
                            onSelectColor={(color: any) => handleSelectColors(color, currentTab?.tab_name || '')}
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
