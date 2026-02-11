"use client"

import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'

function Watch({ bodyColor, bezelColor, strapColor }: any) {
    const { materials, nodes }: any = useGLTF('/models/ff.glb')
    //   const { materials, nodes }: any = useGLTF('/models/watch.glb')

    console.log(nodes)

    return (
        <group>
            {/* <mesh geometry={nodes.Cube.geometry}>
        <meshStandardMaterial color={bodyColor} />
      </mesh> */}
            {nodes.background_of_watch.children.map((mesh: any) => {
                console.log(mesh.material.color)
                return (
                    <mesh geometry={mesh.geometry}>
                    <meshStandardMaterial color={mesh.material.color} />
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
    return (
        <Canvas camera={{
            position: [0, 10, 0],
            zoom: 5
        }}>
            <ambientLight />
            <directionalLight position={[0, 10, 0]}  />

            <Watch
                bodyColor="silver"
                bezelColor="black"
                strapColor="brown"
            />

            <OrbitControls />
        </Canvas>
    )
}
