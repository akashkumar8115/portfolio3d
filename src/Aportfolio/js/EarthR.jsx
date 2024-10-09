// src/RotatableBall.js
import "../css/BubbleIcon.css"
import IMGP from '../img/earth0.jpg'
// src/RotatableBall.js

import React, { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const RotatingBall = () => {
    const ballRef = useRef();
    const texture = useLoader(THREE.TextureLoader, IMGP);
    // Scale and position the texture
    // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);  // Change these values to scale the texture
    // texture.offset.set(0.5, 0.5);  // Change these values to position the texture

    // Rotate the ball on each frame
    useFrame(() => {
        if (ballRef.current) {
            // ballRef.current.rotation.x += 0.005;
            ballRef.current.rotation.y += 0.001;
            // ballRef.current.rotation.z += 0.005;
        }
    });

    return (
        <mesh ref={ballRef}>
            <sphereGeometry args={[3, 64, 64]} />
            <meshStandardMaterial map={texture}  transparent={true}/>
        </mesh>
    );
};

const RotatableBall = () => {
    return (
        <Canvas >
            <ambientLight intensity={1.5} position={[0, 0, 15]}/>
            <directionalLight position={[0, 10, 15]} intensity={1} />
            <pointLight position={[0, 10, 0]} intensity={1} />
            <RotatingBall />
            <OrbitControls enableZoom={false} />
        </Canvas>
    );
};

export default RotatableBall;
