// src/RotatableBall.js

import React, { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import linkedinIcon from "../img/linkedin.png";
import "../css/BubbleLiD.css";
const RotatingBall = () => {
    const ballRef = useRef();
    const texture = useLoader(THREE.TextureLoader, linkedinIcon);

    // Scale and position the base texture
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);

    // Rotate the ball on each frame
    useFrame(() => {
        if (ballRef.current) {
            ballRef.current.rotation.x += 0.01;
            ballRef.current.rotation.y += 0.01;
            ballRef.current.rotation.z += 0.01;
        }
    });

    return (
        <group>
            <mesh ref={ballRef} position={[0, 0, 0]}> {/* Adjust position as needed */}
                <planeGeometry args={[2, 2]} />
                <meshBasicMaterial map={texture} transparent={true} />
            </mesh>
        </group>
    );
};

const RotatableBall = () => {
    return (
        <Canvas>
            <ambientLight intensity={0.5} /> {/* Ambient light to fill shadows */}
            <directionalLight position={[5, 5, 5]} intensity={1.5} />
            <directionalLight position={[-5, -5, -5]} intensity={1} />
            <directionalLight position={[-5, 5, 5]} intensity={1} />
            <directionalLight position={[5, -5, -5]} intensity={1} />
            <pointLight position={[5, 5, 5]} />
            <RotatingBall />
            <OrbitControls enableZoom={false} />
        </Canvas>
    );
};

export default RotatableBall;
