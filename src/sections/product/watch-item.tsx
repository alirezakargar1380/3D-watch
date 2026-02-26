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


function Watch({ colorObject, model_path, onSendColor, }: any) {
    const { materials, nodes }: any = useGLTF(model_path)
    const [ob, setOb] = useState<any>({});
    //   const { materials, nodes }: any = useGLTF('/models/watch.glb')

    useEffect(() => {
        console.log('gen')
        // generate color objects
        const keys = Object.keys(nodes);
        const object: any = {};
        for (let i = 0; i < keys.length; i++) {
            const mesh: any = nodes[keys[i]];
            if (mesh.isMesh)
                object[mesh.name] = "";
        }

        onSendColor(object)
    }, [nodes])

    useEffect(() => {
        console.log('color')
        Object.keys(nodes)?.map((key, index) => {
            const child = nodes[key];
            if (child.isMesh && colorObject[child.name]) {
                child.material = child.material.clone()
                child.material.color.set(colorObject[child.name])
            }
        })
    }, [colorObject])

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
    color?: any;
    selected?: boolean
    model_path: string;
    onGetColorKeys?: (colorObj: any) => void;
}

export default function WatchDemoViewer({ onGetColorKeys, color, zoom = 5, selected, model_path }: Props) {
    const [ob, setOb] = useState<any>(color || {});
    // const [zoom, setZoom] = useState(4);
    const [isLocked, setIsLocked] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        onGetColorKeys?.(ob)
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
                {/* <Environment preset="forest" blur={10} /> */}

                <ambientLight
                    // intensity={0.05}
                    intensity={10}
                />

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
