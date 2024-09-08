

import React, { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import "../css/Html3d.css"
import textureImage from '../img/python.png'; // Replace with your image path



const TexturedBox = () => {
    const boxRef = useRef();
    const texture = useLoader(THREE.TextureLoader, textureImage);
    // Center and scale the texture
    texture.center.set(0.5, 0.5);
    texture.repeat.set(1, 1); // Keep the texture scaling 1:1
    texture.offset.set(0, 0); // Ensure the texture is centered
    useFrame(() => {
        if (boxRef.current) {
            // boxRef.current.rotation.x += 0.01;
            boxRef.current.rotation.y += 0.01;
        }
    });

    return (
        <mesh ref={boxRef} position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.5, 2.5, 2.5]} />
            <meshStandardMaterial map={texture} />
        </mesh>
    );
};

const App = () => {
    return (
        <div className="canvas-container">
            <Canvas shadows camera={{ position: [5, 2, 5], fov: 50 }}>
                <ambientLight intensity={2} />
                <directionalLight
                    position={[5, 5, 5]}
                    intensity={1}
                    castShadow
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                    shadow-camera-far={15}
                    shadow-camera-left={-10}
                    shadow-camera-right={10}
                    shadow-camera-top={10}
                    shadow-camera-bottom={-10}
                />
                <TexturedBox />
                <mesh
                    receiveShadow
                    position={[0, -1.5, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                >
                    <planeGeometry args={[10, 10]} />
                    <shadowMaterial opacity={0} />
                </mesh>
                <OrbitControls enableZoom={false} />
            </Canvas>
        </div>
    );
};

export default App;
