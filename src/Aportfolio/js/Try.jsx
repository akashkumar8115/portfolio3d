import React, { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import IMGP from '../img/earth0.jpg';
import "../css/BubbleIcon.css";  // Assuming you have some CSS for the canvas or sphere

const RotatingBall = () => {
    const ballRef = useRef();
    const texture = useLoader(THREE.TextureLoader, IMGP);

    // Adjust texture properties if needed
    texture.repeat.set(1, 1);

    // Rotate the sphere on each frame
    useFrame(() => {
        if (ballRef.current) {
            ballRef.current.rotation.x += 0.01;
            ballRef.current.rotation.y += 0.01;
        }
    });

    return (
        <mesh ref={ballRef}>
            <sphereGeometry args={[3, 64, 64]} />
            <meshStandardMaterial map={texture} transparent={true} />
        </mesh>
    );
};

const RotatableBall = () => {
    return (
        <Canvas
            style={{ background: 'none' }} // Set the canvas background to none (transparent)
        >
            <ambientLight intensity={1} />
            <pointLight position={[10, 10, 10]} />
            <RotatingBall />
            <OrbitControls enableZoom={false} />
        </Canvas>
    );
};

export default RotatableBall;
