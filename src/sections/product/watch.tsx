"use client"

import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { useEffect, useState } from 'react'
import { Box, Stack } from '@mui/material'
import { ColorPicker, ColorPreview } from 'src/components/color-utils'
import { MuiColorInput } from 'mui-color-input'

function Watch({ bodyColor, bezelColor, strapColor, colorObject, onSendColor, }: any) {
    const { materials, nodes }: any = useGLTF('/models/ff.glb')
    const [ob, setOb] = useState<any>({});
    //   const { materials, nodes }: any = useGLTF('/models/watch.glb')

    useEffect(() => {
        const object: any = {};
        for (let i = 0; i < nodes.background_of_watch.children.length; i++) {
            const mesh: any = nodes.background_of_watch.children[i];
            console.log(mesh)
            object[mesh.name] = mesh.material.color;
        }
        console.log(object)
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

export default function Viewer() {
    const [ob, setOb] = useState<any>({});

    const handleChange = (key: string, newValue: any) => {
        // ob[key] = newValue
        // setOb(ob)

        setOb((prevState: any) => ({
            ...prevState,
            [key]: newValue,
        }));
    }

    console.log(ob)

    return (
        <Box component={'div'} sx={{ height: 1 }}>
            <Box component={'div'} sx={{ height: 1 }}>
                <Canvas camera={{
                    position: [0, 10, 0],
                    zoom: 5
                }}>
                    <ambientLight />
                    <directionalLight position={[0, 10, 0]} />

                    <Watch
                        bodyColor="silver"
                        bezelColor="black"
                        strapColor="brown"
                        colorObject={ob}
                        onSendColor={(obj: any) => setOb(obj)}
                    />

                    <OrbitControls />
                </Canvas>
            </Box>
            <Stack direction={{ xs: 'column', md: 'row' }} sx={{ mx: 0 }} justifyContent={'center'} spacing={1}>
                {Object.keys(ob).map((key: string) => {
                    return (
                        <Stack direction={'column'}>
                            <Box component={'div'}>
                                {key}
                            </Box>
                            <MuiColorInput format="hex" value={'#f4f4f2'} onChange={(color) => handleChange(key, color)} />
                        </Stack>
                    )
                })}

            </Stack>


        </Box>

    )
}
