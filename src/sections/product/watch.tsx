"use client"

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, OrbitControls, Text, Center, Text3D, useGLTF, CameraControls } from '@react-three/drei'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, IconButton, Stack, Tab, Tabs } from '@mui/material'
import { ColorPicker, ColorPreview } from 'src/components/color-utils'
import { ReturnType } from 'src/hooks/use-boolean'
import Iconify from 'src/components/iconify'
import * as THREE from 'three';
import { IProductTabs } from 'src/types/product';
import CustomColorPicker from './color-picker'
import CustomPopover, { usePopover } from 'src/components/custom-popover'
import ARViewer from './ar-viewer';


export function CameraBackground() {
    const { scene } = useThree();
    const videoRef: React.RefObject<HTMLVideoElement> | any = useRef(null);

    useEffect(() => {
        let stream = null;

        async function setupCamera() {
            try {
                // Request rear camera (use 'user' for front)
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                });

                // Create a hidden video element
                const video: any = document.createElement('video');
                video.srcObject = stream;
                video.setAttribute('playsinline', ''); // Required for iOS
                await video.play();

                // Create a VideoTexture and set as scene background
                const texture = new THREE.VideoTexture(video);
                // Flip if needed (front camera may need flipY = false)
                // texture.flipY = false;
                scene.background = texture;

                // Store video ref for cleanup
                videoRef.current = video;
            } catch (err) {
                console.error('Camera access denied:', err);
                // Fallback to a solid color if camera fails
                scene.background = new THREE.Color(0xF8F8F8);
            }
        }

        setupCamera();

        // Cleanup: stop camera tracks and remove texture
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach((track: any) => track.stop());
                videoRef.current.srcObject = null;
            }
            // Reset background to avoid memory leaks
            scene.background = null;
        };
    }, [scene]);

    return null; // This component only does setup
}

function Watch({ tab_name, text, font, font_size, position, positions, color, colorObject, model_path, tab_details, onSendColor }: any) {
    const { materials, nodes }: any = useGLTF(model_path);

    useEffect(() => {

        const selectedColorObject = tab_details?.colors.find((c: any) => c.code === color);

        const newObjectColor = { ...colorObject }
        Object.keys(nodes)?.map((key, index) => {
            const child = nodes[key];

            // if (!selectedColorObject) return console.log('cant find color object')

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

                return
            } else {
                if (selectedColorObject?.objects.includes(child.name)) {
                    child.material = materials[selectedColorObject.material_name].clone();
                    child.material.color.set(selectedColorObject.code);
                    if (selectedColorObject?.roughness)
                        child.material.roughness = +colorObject.roughness;

                    return
                }
            }

            // SHOUD CHANGE
            if (!selectedColorObject && tab_details) {
                child.material = materials[tab_details.key].clone();
                child.material.color.set(color);
                console.log('cant find color object', tab_details, colorObject, color)
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
            {/* change this position */}
            {positions?.map((pos: any) => (
                <group
                    position={position !== undefined ? [+pos.x, 0, +pos.y] : [0, 0, 0]}
                // position={position !== undefined ? [0, position.x, position.y] : [0, 0, 0]}
                >
                    {(pos.text && font_size) && (
                        <Center key={`${pos.text}-${font}-${font_size}-${position?.x}-${position?.y}`}>
                            <Text3D          // x, y, z relative to scene
                                size={font_size}
                                font={`/fonts/${font}`}  // optional custom font
                                // bevelEnabled
                                // bevelThickness={11}
                                curveSegments={100}
                                bevelSize={10}
                                height={0.01}
                                position={[0, 0, 0]}
                                rotation={[-Math.PI / 2, 0, 0]}      // 90 deg around X axis
                            // anchorX="center"                  // center text horizontally at position.x
                            // anchorY="middle"
                            >
                                {pos.text}
                                {(model_path === '/models/salib-clock.glb') && (
                                    <primitive object={materials['salib']?.clone()} />
                                )}
                            </Text3D>
                        </Center>
                    )}
                </group>
            ))}
            <group
                position={position !== undefined ? [position.x, 0, position.y] : [0, 0, 0]}
            // position={position !== undefined ? [0, position.x, position.y] : [0, 0, 0]}
            >
                {(text && font_size) && (
                    <Center key={`${text}-${font}-${font_size}-${position?.x}-${position?.y}`}>
                        <Text3D          // x, y, z relative to scene
                            size={font_size}
                            font={`/fonts/${font}`}  // optional custom font
                            // bevelEnabled
                            // bevelThickness={11}
                            curveSegments={100}
                            bevelSize={10}
                            height={0.01}
                            position={[0, 0, 0]}
                            rotation={[-Math.PI / 2, 0, 0]}      // 90 deg around X axis
                        // anchorX="center"                  // center text horizontally at position.x
                        // anchorY="middle"
                        >
                            {text}
                            {(model_path === '/models/salib-clock.glb') && (
                                <primitive object={materials['salib']?.clone()} />
                            )}
                        </Text3D>
                    </Center>
                )}
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

interface CameraProps {
    camPos: [number, number, number];    // Where the camera is
    targetPos: [number, number, number]; // What the camera looks at
    zoomLevel: number;
}

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

interface ViewerProps {
    isLocked?: boolean;
    tabs: IProductTabs[];
    tab_name?: string
    text?: string
    font?: string
    font_size?: number
    position?: any
    positions?: any
    color?: string
    model_path?: string
    currentColorObject: any
    targetXYZ?: [number, number, number]
    onGetColor?: () => void
}

// function FreeLookControls({
//     camPos,
// }: {
//     camPos: [number, number, number];
// }) {
//     const controlsRef = useRef<any>(null);
//     const { camera } = useThree();

//     useEffect(() => {
//         camera.position.set(...camPos);
//         controlsRef.current?.update();
//     }, [camera, camPos]);

//     return <OrbitControls ref={controlsRef} makeDefault />;
// }

function FreeLookControls({
    camPos,
    targetPos = [0, 0, 0],
    zoomLevel = 1,
}: {
    camPos: [number, number, number];
    targetPos?: [number, number, number];
    zoomLevel?: number;
}) {
    const controlsRef = useRef<any>(null);
    const { camera } = useThree();

    useEffect(() => {
        const target = new THREE.Vector3(...targetPos);
        const cam = new THREE.Vector3(...camPos);

        const dir = cam.clone().sub(target).normalize();

        // smaller zoomLevel = closer, larger = farther
        const distance = 10 / zoomLevel;

        camera.position.copy(target.clone().add(dir.multiplyScalar(distance)));
        controlsRef.current?.target.copy(target);
        controlsRef.current?.update();
    }, []);

    return <OrbitControls ref={controlsRef} makeDefault enableZoom />;
}

export function Viewer({
    isLocked,
    tabs,
    tab_name,
    text = '',
    font,
    font_size,
    position,
    positions,
    color,
    model_path,
    currentColorObject,
    targetXYZ = [0, 10, 0],
    onGetColor
}: ViewerProps) {

    const currentTab = tabs.find((tb) => tb.tab_name === tab_name);

    return (
        <Box height={1} component={'div'}>
            <Canvas
                shadows
                camera={{
                    type: 'PerspectiveCamera',
                    position: [Number(currentTab?.x) || 0, Number(currentTab?.y) || 10, Number(currentTab?.z) || 15],
                    fov: 50,
                    near: 0.1,
                    far: 1000
                }}
            >
                {/* NEW: Camera feed as background */}
                <CameraBackground />

                <Watch
                    tab_name={tab_name}
                    text={text}
                    font={font}
                    font_size={font_size}
                    position={position}
                    positions={positions}
                    color={color}
                    tab_details={tabs.find((t) => t.tab_name === tab_name)}
                    colorObject={currentColorObject}
                    model_path={model_path}
                    // ON GET FUNC Should use in here
                    onSendColor={(obj: any) => { }}
                />
                {(!isLocked) && (
                    <ManualCameraController
                        zoomLevel={currentTab?.zoom || 1}
                        camPos={[Number(currentTab?.x) || 0, Number(currentTab?.y) || 10, Number(currentTab?.z) || 0]}
                        targetPos={targetXYZ}
                    />
                )}
                {(isLocked) && (
                    <FreeLookControls
                        camPos={[
                            0, 10, 0
                        ]}
                        zoomLevel={3.5}
                    />
                )}

                {/* <color attach="background" args={['#f8f8f8']} /> */}
                <Environment files='/city.exr' blur={60} />
                <ambientLight intensity={0.05} />
            </Canvas>
        </Box>
    )

}

export default function CustomazationDialog({ dialog, model_path, tabs }: Props) {
    const [currentColorObject, setOb] = useState<any>({});
    const [color, setColor] = useState('');
    const [newColorObject, setnewOb] = useState<any>({});
    const [text, setText] = useState('');
    const [isLocked, setIsLocked] = useState(false);
    const [scrollableTab, setScrollableTab] = useState(tabs?.[0]?.tab_name);
    const [isARMode, setIsARMode] = useState(false);
    const targetXYZ: [number, number, number] = [0, 0, 0];
    const customizedPopover = usePopover();

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
        handleChange(tab_name, color);
    }

    const currentTab = tabs.find((tb) => tb.tab_name === scrollableTab);

    // add the default colors
    useEffect(() => {
        for (let i = 0; i < tabs.length; i++) {
            const tab = tabs[i];
            if (tab.tab_name === scrollableTab) {
                handleSelectColors(tab.default_color, tab.tab_name)
            }
        }
    }, [scrollableTab])

    const Header = () => (
        <>
            <Box component={'div'} position={'absolute'} zIndex={10} top={20} right={20}>
                <Button
                    color='secondary'
                    variant='outlined'
                    onClick={() => {
                        dialog.onFalse()
                        // afterSubmit(currentColorObject)
                    }}
                >
                    done
                </Button>
            </Box>
            <Box component={'div'} position={'absolute'} zIndex={10} top={20} left={20} display={'flex'} gap={1}>
                <IconButton
                    onClick={() => setIsARMode(!isARMode)}
                    title={isARMode ? "Exit AR Mode" : "Enter AR Mode"}
                    sx={{
                        backgroundColor: isARMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.3)',
                        color: '#fff',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        }
                    }}
                >
                    <Iconify color={'white'} icon={isARMode ? "game-icons:cube" : "eva:eye-outline"} width={36} />
                </IconButton>
                <IconButton onClick={() => setIsLocked(!isLocked)}>
                    <Iconify color={'black'} icon={!isLocked ? "ic:twotone-lock" : "eva:unlock-outline"} width={36} />
                </IconButton>
            </Box>
        </>
    )

    return (
        <Dialog
            open={dialog.value}
            onClose={dialog.onFalse}
            fullScreen
        // PaperProps={{
        //     sx: {
        //         backgroundColor: '#f4f4f2'
        //     }
        // }}
        >
            <DialogContent sx={{ px: 0, height: 1, display: 'flex', flexDirection: 'column' }}>
                <Box component={'div'} sx={{ height: 1, position: 'relative' }}>
                    <Header />

                    {isARMode ? (
                        <ARViewer
                            modelPath={model_path}
                            onClose={() => setIsARMode(false)}
                            tabs={tabs}
                            currentColorObject={currentColorObject}
                            color={color}
                            scrollableTab={scrollableTab}
                        />
                    ) : (
                        <Viewer
                            isLocked={isLocked}
                            tabs={tabs}
                            tab_name={scrollableTab}
                            color={color}
                            currentColorObject={currentColorObject}
                            model_path={model_path}
                            text={text}
                            targetXYZ={targetXYZ}
                        />
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{
                backgroundColor: '#fff',
                display: 'block',
                borderTopRightRadius: 24,
                borderTopLeftRadius: 24,
                boxShadow: '1px 0px 20px 11px #00000008',
                visibility: isARMode ? 'hidden' : 'visible',
                height: isARMode ? 0 : 'auto',
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

                {/* <Stack direction={{ xs: 'column', md: 'row' }} sx={{ mx: 0, mt: 2 }} justifyContent={'center'} spacing={1}> */}
                <Box component={'div'} textAlign={'center'} mt={2} gap={1} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    {(model_path === '/models/salib-clock.glb') && (
                        <input onChange={(e) => setText(e.target.value)} />
                    )}
                    <ColorPicker
                        colors={tabs.find((tab) => tab.tab_name === scrollableTab)?.colors.map((color) => color.code) || ['#fff']}
                        selected={currentColorObject[scrollableTab] || ''}
                        onSelectColor={(color: any) => handleSelectColors(color, currentTab?.tab_name || '')}
                    />
                    <Box sx={{ width: '2px', height: '20px', bgcolor: '#d3d3d3' }} component={'div'} />
                    <Box
                        sx={{
                            ml: 1,
                            background:
                                "linear-gradient(45deg, #ff0000 0%, #ea00ff 50%,#ff7cff  100%)",
                            width: 20, height: 20,
                            borderRadius: 2,
                            border: '0.5px solid #bbbbbb'
                        }}
                        component={'div'}
                        onClick={customizedPopover.onOpen}
                    />
                    <CustomPopover
                        open={customizedPopover.open}
                        onClose={customizedPopover.onClose}
                        arrow={'bottom-left'}
                    >
                        <CustomColorPicker
                            onChange={(hex) => {
                                if (!hex) return
                                handleSelectColors(`#${hex}`, currentTab?.tab_name || '')
                            }}
                        />
                    </CustomPopover>
                </Box>
            </DialogActions>
        </Dialog>
    )
}
