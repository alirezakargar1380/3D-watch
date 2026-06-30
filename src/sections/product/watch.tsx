"use client"

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, OrbitControls, Text, Center, Text3D, useGLTF, CameraControls } from '@react-three/drei'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, IconButton, Stack, Tab, Tabs, Collapse, Typography, MenuItem, formHelperTextClasses } from '@mui/material'
import { ColorPicker, ColorPreview } from 'src/components/color-utils'
import { ReturnType } from 'src/hooks/use-boolean'
import Iconify from 'src/components/iconify'
import * as THREE from 'three';
import { IProductTabs } from 'src/types/product';
import CustomColorPicker from './color-picker'
import CustomPopover, { usePopover } from 'src/components/custom-popover'
import { m } from 'framer-motion';
import { MotionContainer, varFade } from 'src/components/animate';
import Image from 'src/components/image'
import { RHFSelect, RHFTextField } from 'src/components/hook-form'
import { endpoints } from 'src/utils/axios'
import { IPosition } from 'src/types/position'
import { fonts, FontSizes, IFont } from 'src/utils/fonts'

interface CameraProps {
    camPos: [number, number, number];    // Where the camera is
    targetPos: [number, number, number]; // What the camera looks at
    zoomLevel: number;
}

interface Props {
    dialog: ReturnType;
    model_path: string;
    tabs: IProductTabs[];
    values?: any
    textFields?: any
    colorObject?: any
}

interface ViewerProps {
    isLocked?: boolean;
    isAr?: boolean;
    tabs: IProductTabs[];
    tab_name: string
    font_size?: number
    position?: any
    positions?: any
    color?: string
    model_path?: string
    currentColorObject: any
    targetXYZ?: [number, number, number]
    height?: number
    onGetColor?: () => void
}
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

function Watch({ font_size, positions, color, colorObject, model_path, tab_details, onSendColor }: any) {
    const { materials, nodes }: any = useGLTF(model_path);

    useEffect(() => {
        const selectedColorObject = tab_details?.colors.find((c: any) => c.code === color);

        const newObjectColor = { ...colorObject }

        Object.keys(nodes)?.map((key, index) => {
            const child = nodes[key];

            if (selectedColorObject?.all === true) {
                console.log('selectedColorObject (all)', selectedColorObject)
                child.material = materials[selectedColorObject.material_name].clone();
                child.material.color.set(newObjectColor[tab_details.tab_name] || selectedColorObject.code);
                if (selectedColorObject?.roughness)
                    child.material.roughness = +selectedColorObject.roughness;

                return
            } else {
                if (selectedColorObject?.objects.includes(child.name)) {
                    console.log('im else', selectedColorObject, +colorObject.roughness)
                    child.material = materials[selectedColorObject.material_name].clone();
                    child.material.color.set(newObjectColor[tab_details.tab_name]);
                    if (selectedColorObject?.roughness)
                        child.material.roughness = +selectedColorObject?.roughness;

                    return
                }
            }

            // SHOUD CHANGE
            if (!selectedColorObject && tab_details) {
                console.log('tab det', tab_details.key)
                // make a copy of material
                const mat = materials[tab_details.key].clone();
                mat.color.set(color);

                // pasted it in all object that contain its material
                if (child.material?.name === tab_details.key) {
                    child.material = mat
                }
                // console.log('cant find color object', tab_details, colorObject, color, materials[tab_details.key].name)
                return
            }

        })

        onSendColor(newObjectColor)
    }, [colorObject])

    return (
        <>
            {/* TEXT */}
            {positions?.map((pos: any, i: number) => (
                <group
                    key={i}
                    position={[+pos.x, 0, +pos.y]}
                >
                    {(pos.text && font_size) && (
                        <Center key={`${pos.text}-${pos.font_size}-${pos.font_size}-${pos.x}-${pos.y}`}>
                            <Text3D
                                size={pos.font_size}
                                font={`/fonts/${pos.font_file}`}  // optional custom font
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

            <group>
                {Object.keys(nodes)?.map((key, index) => {
                    const mesh = nodes[key];
                    if (mesh.type === 'Mesh') {
                        return (
                            <primitive object={mesh} key={index} />
                        )
                    }
                })}
            </group>
        </>
    )
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
        const distance = zoomLevel * 12;

        camera.position.copy(target.clone().add(dir.multiplyScalar(distance)));
        controlsRef.current?.target.copy(target);
        controlsRef.current?.update();
    }, []);

    return <OrbitControls ref={controlsRef} makeDefault enableZoom />;
}

export function Viewer({
    isLocked,
    isAr,
    tabs,
    tab_name,
    font_size,
    positions,
    color,
    model_path,
    currentColorObject,
    targetXYZ = [0, 10, 0],
    height = 1,
    onGetColor
}: ViewerProps) {

    const currentTab = tabs.find((tb) => tb.tab_name === tab_name);

    return (
        <Box height={height} component={'div'} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Canvas
                shadows
                camera={{
                    type: 'PerspectiveCamera',
                    position: [Number(currentTab?.x) || 0, Number(currentTab?.y) || 10, Number(currentTab?.z) || 0],
                    fov: 50,
                    near: 0.1,
                    far: 1000
                }}
            >
                {/* NEW: Camera feed as background */}
                {(isAr) && (
                    <CameraBackground />
                )}
                <Watch
                    tab_name={tab_name}
                    font_size={font_size}
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
                        zoomLevel={1}
                    />
                )}

                <color attach="background" args={['#dfdfdf']} />
                <Environment files='/sunset.exr' environmentIntensity={3} environmentRotation={[0,0,2]} />
                {/* <ambientLight intensity={100} /> */}
            </Canvas>
        </Box>
    )

}

export default function CustomazationDialog({ dialog, model_path, tabs, values, textFields, colorObject }: Props) {
    const [currentColorObject, setOb] = useState<any>({});
    const [color, setColor] = useState('');
    const [newColorObject, setnewOb] = useState<any>({});
    const [text, setText] = useState('');
    const [isLocked, setIsLocked] = useState(false);
    const [textTyping, setTextType] = useState(false);
    const [isARMode, setIsARMode] = useState(false);
    const [scrollableTab, setScrollableTab] = useState(tabs?.[0]?.tab_name);
    const targetXYZ: [number, number, number] = [0, 0, 0];
    const customizedPopover = usePopover();

    const [position, setPosition] = useState<IPosition>();
    const [index, setIndex] = useState<number>();


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
        console.log('handle select colreo: ', color)
        setColor(color)
        handleChange(tab_name, color);
    }

    const currentTab = tabs.find((tb) => tb.tab_name === scrollableTab);

    // add the default colors
    useEffect(() => {
        console.log('defult color')
        for (let i = 0; i < tabs.length; i++) {
            const tab = tabs[i];
            if (tab.tab_name === scrollableTab) {
                handleSelectColors(tab.default_color, tab.tab_name)
            }
        }
        // }, [])
    }, [scrollableTab])

    useEffect(() => {
        setOb((prevState: any) => ({
            ...prevState,
            ...colorObject,
        }))
    }, [colorObject])

    const Header = () => (
        <>
            <Box component={'div'} position={'absolute'} zIndex={10} top={20} right={20}>
                <Button
                    color='secondary'
                    variant='outlined'
                    onClick={() => {
                        dialog.onFalse();
                        // afterSubmit(currentColorObject)
                    }}
                >
                    done
                </Button>
            </Box>
            <Stack component={'div'} position={'absolute'} zIndex={10} top={20} left={20} display={'flex'} gap={1}>
                <IconButton onClick={() => setIsLocked(!isLocked)}>
                    <Iconify color={'black'} icon={!isLocked ? "ic:twotone-lock" : "eva:unlock-outline"} width={36} />
                </IconButton>
                <IconButton
                    onClick={() => setIsARMode(!isARMode)}
                    title={isARMode ? "Exit AR Mode" : "Enter AR Mode"}
                    sx={{
                        backgroundColor: isARMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.1)',
                        color: '#000000',
                        '&:hover': {
                            backgroundColor: 'rgba(122, 122, 122, 0.8)',
                        }
                    }}
                >
                    <Iconify color={'black'} icon={!isARMode ? "game-icons:cube" : "eva:eye-outline"} width={36} />
                </IconButton>
                <IconButton
                    onClick={() => setTextType(!textTyping)}
                    sx={{
                        ...(textTyping && {
                            backgroundColor: '#cacaca'
                        })
                    }}
                >
                    <Iconify color={'black'} icon={'cuida:text-outline'} width={36} />
                </IconButton>
            </Stack>
        </>
    )

    return (
        <Box component={MotionContainer}>
            <Dialog
                open={dialog.value}
                onClose={dialog.onFalse}
                fullScreen
            // fullWidth
            // maxWidth={'xl'}
            // PaperProps={{
            //     sx: {
            //         backgroundColor: '#f4f4f2'
            //     }
            // }}
            >
                <DialogContent sx={{ px: 0, height: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box component={'div'} sx={{ height: 1, position: 'relative' }}>
                        <Header />
                        <Viewer
                            isLocked={isLocked}
                            isAr={isARMode}
                            tabs={tabs}
                            tab_name={scrollableTab}
                            color={color}
                            currentColorObject={currentColorObject}
                            model_path={model_path}
                            // text={text}
                            targetXYZ={targetXYZ}
                            positions={values?.positions}
                            font_size={values?.font_size}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{
                    // height: '168px',
                    backgroundColor: '#fff',
                    display: 'block',
                    borderTopRightRadius: 24,
                    borderTopLeftRadius: 24,
                    boxShadow: '1px 0px 20px 11px #00000008',
                }}>
                    <Box width={1} component={'div'} mb={2}>
                        <Box component={'span'} display={'block'} height={'4px'} width={'60px'} mx={'auto'} borderRadius={'16px'} bgcolor={'#bfbfbf'} />
                    </Box>

                    {(textTyping) ? (
                        <Box component={'div'} sx={{ mr: 'auto!important', ml: 'auto!important', width: { xs: 1, md: 0.3 } }}>
                            <Stack direction={'row'} justifyContent={'left'} spacing={1} mb={3}>
                                {textFields.map((pos: any, index: number) => (
                                    <Box
                                        component={'div'}
                                        onClick={() => {
                                            setPosition(pos)
                                            setIndex(index)
                                        }}
                                        key={index * 324}
                                        sx={{
                                            width: 64, textAlign: 'center', borderRadius: 1.25, p: 1,
                                            border: '2px solid #e6e6e6',
                                            ...(pos.id === position?.id && {
                                                border: '2px solid #858585',
                                            }),
                                            cursor: 'pointer',
                                        }}>
                                        <Image src={endpoints.positions.get_icon(pos.img)} sx={{ width: 0.7 }} />
                                        <Typography textAlign={'center'} variant='caption'>{pos.name}</Typography>
                                    </Box>
                                ))}

                            </Stack>
                            <m.div key={`${index}`} variants={textTyping ? varFade().in : varFade().out}>
                                {(index !== undefined) && (
                                    <Box component={'div'}>
                                        <Stack direction="row" spacing={1}>
                                            <RHFTextField label='Text' name={`positions.${index}.text`} size='small' />

                                            <RHFSelect
                                                name={`positions.${index}.font_file`}
                                                label="font"
                                                size="small"
                                                sx={{
                                                    maxWidth: 150,
                                                    [`& .${formHelperTextClasses.root}`]: {
                                                        mx: 0,
                                                        mt: 1,
                                                        textAlign: 'right',
                                                    },
                                                }}
                                            >
                                                {fonts.map((font: IFont, index: number) => (
                                                    <MenuItem key={index} value={font.file}>
                                                        {font.name}
                                                    </MenuItem>
                                                ))}
                                            </RHFSelect>

                                            <RHFSelect
                                                name={`positions.${index}.font_size`}
                                                size="small"
                                                label="font size"
                                                sx={{
                                                    maxWidth: 150,
                                                    [`& .${formHelperTextClasses.root}`]: {
                                                        mx: 0,
                                                        mt: 1,
                                                        textAlign: 'right',
                                                    },
                                                }}
                                            >
                                                {FontSizes.map((size: number, index: number) => (
                                                    <MenuItem key={index} value={size}>
                                                        {size}
                                                    </MenuItem>
                                                ))}
                                            </RHFSelect>
                                        </Stack>
                                    </Box>
                                )}
                            </m.div>
                        </Box>
                    ) : (
                        <m.div key={`${textTyping}`} variants={textTyping ? varFade().out : varFade().in}>
                            <Box component={'div'} height={'100px'}>
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
                                    </Tabs>
                                </Box>

                                {/* <Stack direction={{ xs: 'column', md: 'row' }} sx={{ mx: 0, mt: 2 }} justifyContent={'center'} spacing={1}> */}
                                <Box component={'div'} textAlign={'center'} mt={2} gap={1} display={'flex'} alignItems={'center'} justifyContent={'center'}>
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
                                                console.log('hex', hex)
                                                handleSelectColors(`#${hex}`, currentTab?.tab_name || '')
                                            }}
                                        />
                                    </CustomPopover>
                                </Box>
                            </Box>
                        </m.div>
                    )}

                </DialogActions>
            </Dialog>
        </Box>
    )
}
