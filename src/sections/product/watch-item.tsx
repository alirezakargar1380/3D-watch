"use client"

import { Canvas, useThree } from '@react-three/fiber'
import { Environment, OrbitControls, useGLTF } from '@react-three/drei'
import { useCallback, useEffect, useState, useRef } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Tab, Tabs } from '@mui/material'
import { ColorPicker, ColorPreview } from 'src/components/color-utils'
import { MuiColorInput } from 'mui-color-input'
import { ReturnType } from 'src/hooks/use-boolean'
import Iconify from 'src/components/iconify'
import { Vector3 } from 'three';
import * as THREE from 'three';

const TABS = [
    {
        value: 'one',
        label: 'Background',
        key: 'Circle005',
        zoom: 4,
        position: [0, 10, 0]
    },
    {
        value: 'two',
        label: 'Bezel',
        key: 'Circle005_1',
        zoom: 5,
        position: [0, 10, 0]
    },
    {
        value: 'three',
        label: 'Indices',
        key: 'Circle005_2',
        zoom: 20,
        position: [10, 3, 6]

    },
    {
        value: 'four',
        label: 'Hand hub',
        key: 'Circle005_3',
        zoom: 20,
        position: [0, 10, 10]
    },
    {
        value: 'five',
        label: 'Hands',
        key: 'Circle005_4',
        zoom: 18,
        position: [4, 14, 16]
    },
];

function SceneBackground({ color }: { color: string }) {
    const { scene } = useThree()

    useEffect(() => {
        scene.background = new THREE.Color(color)
    }, [color, scene])

    return null
}

// function CameraController({ zoom, position }: { zoom: number, position: any }) {
//     const { camera } = useThree();

//     useEffect(() => {
//         camera.zoom = zoom;
//         camera.position.set(position[0], position[1], position[2])
//         camera.updateProjectionMatrix()
//     }, [zoom, position, camera])

//     return null
// }


function Watch({ colorObject, model_path, onSendColor, }: any) {
    const { materials, nodes }: any = useGLTF(model_path)
    const [ob, setOb] = useState<any>({});
    //   const { materials, nodes }: any = useGLTF('/models/watch.glb')

    useEffect(() => {
        const keys = Object.keys(nodes);
        const object: any = {};
        for (let i = 0; i < keys.length; i++) {
            const mesh: any = nodes[keys[i]];
            if (mesh.isMesh)
                object[mesh.name] = "";
        }

        console.log("object", object);
        onSendColor(object)
    }, [nodes])

    useEffect(() => {

        Object.keys(nodes)?.map((key, index) => {
            const child = nodes[key];
            if (child.isMesh) {
                // child.material = child.material.clone()
                // child.material.color.set('#ff0000')
            }
        })
    }, [nodes])

    // console.log(nodes)
    // return (
    //     <>
    //         {nodes?.Scene?.children?.map((mesh: any) => {

    //             // if (nodes[key].type === 'Mesh') {
    //             // const mesh = nodes[key];
    //             // console.log(nodes[key].type)
    //             console.log(mesh)
    //             return (
    //                 <mesh
    //                     geometry={mesh.geometry}
    //                     material={mesh.material}
    //                 />
    //             )
    //             // i want to add all material on it
    //             return (
    //                 <primitive object={mesh} />
    //             )
    //             // }
    //         })}
    //     </>
    // )

    return (
        <group>
            {/* {nodes?.Scene?.children?.map((mesh: any, index: number) => { */}
            {Object.keys(nodes)?.map((key, index) => {
                const mesh = nodes[key];
                if (mesh.type === 'Mesh') {
                    // const mesh = nodes[key];
                    // console.log(nodes[key].type)
                    // console.log(mesh.name)
                    // mesh.material.color = ob[mesh.name] || mesh.material.color;
                    // if (mesh.name === 'background_of_watch') {
                    //     console.log(mesh.material)
                    //     mesh.material.color.set('#ffff00de')
                    // }
                    return (
                        <primitive object={mesh} key={index}>
                            {/* {mesh?.material?.type === 'MeshStandardMaterial' ? (
                                <meshStandardMaterial color={mesh.material.color} metalness={mesh.material.metalness} roughness={mesh.material.roughness} />
                            ) : (
                                <meshPhysicalMaterial map={mesh.material.map} color={mesh.material.color} metalness={mesh.material.metalness} roughness={mesh.material.roughness} />
                            )} */}
                        </primitive>
                    )
                    // i want to add all material on it
                    return (mesh.type === 'Mesh') && (
                        <mesh geometry={mesh.geometry} material={mesh.material} key={index}>
                            {/* {mesh?.material?.type === 'MeshStandardMaterial' ? (
                                <meshStandardMaterial color={mesh.material.color} metalness={mesh.material.metalness} roughness={mesh.material.roughness} />
                            ) : (
                                <meshPhysicalMaterial map={mesh.material.map} color={mesh.material.color} metalness={mesh.material.metalness} roughness={mesh.material.roughness} />
                            )} */}
                            {/*  */}
                            {/* <meshPhysicalMaterial map={mesh.material.map} color={mesh.material.color} metalness={mesh.material.metalness} roughness={mesh.material.roughness} /> */}
                        </mesh>
                    )
                }
            })}
            {/* {Object.keys(nodes)?.map((key) => {

                // if (nodes[key].type === 'Mesh') {
                    const mesh = nodes[key];
                    console.log(nodes[key].type)
                    console.log()
                    // i want to add all material on it
                    return (
                        <mesh geometry={mesh.geometry} material={mesh.material} >
                            <meshStandardMaterial color={mesh.material.color} />
                        </mesh>
                    )
                // }
            })} */}
            {/* {nodes?.children?.map((mesh: any) => {
                console.log(mesh);
                // return (
                //     <mesh geometry={mesh.geometry}>
                //         <meshStandardMaterial color={mesh.material.color} />
                //     </mesh>
                // )
            })} */}
        </group>
    )
}

interface Props {
    zoom?: number;
    selected?: boolean
    model_path: string;
    onGetColorKeys: (colorObj: any) => void;
}

export default function WatchDemoViewer({ onGetColorKeys, zoom = 5, selected, model_path }: Props) {
    const [ob, setOb] = useState<any>({});
    // const [zoom, setZoom] = useState(4);
    const [isLocked, setIsLocked] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        onGetColorKeys(ob)
    }, [ob])

    return (
        <Box ref={containerRef} component={'div'} borderRadius={2} overflow={'hidden'} height={200} sx={{
            ...(selected && {
                outline: '3px solid #000'
            })
        }}>
            <Canvas
                key={model_path}
                eventSource={containerRef.current || undefined}
                camera={{
                    position: [0, 10, 0],
                    zoom
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

                <color attach="background" args={['#ececec']} />
                <Environment preset="forest" blur={10} />

                <ambientLight intensity={0.05} />

                <Watch
                    colorObject={ob}
                    model_path={model_path}
                    onSendColor={(obj: any) => setOb(obj)}
                />

                <OrbitControls enableDamping={isLocked} enablePan={isLocked} enableRotate={isLocked} enableZoom={isLocked} />
            </Canvas>
        </Box>
    )
}
