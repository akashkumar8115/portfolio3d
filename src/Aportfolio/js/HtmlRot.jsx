import React, { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import IconImage from '../img/html.png'; // Path to your icon image



const RotatingBall = () => {
    const ballRef = useRef();
    const texture = useLoader(THREE.TextureLoader, IconImage); // Load the icon texture

    // Rotate the ball on each frame
    useFrame(() => {
        if (ballRef.current) {
            ballRef.current.rotation.y += 0.01;
        }
    });

    return (
        <group ref={ballRef}>
            {/* Sphere */}
            <mesh>
                <sphereGeometry args={[1.5, 6, 6]} />
                <meshStandardMaterial
                    color="white"
                    roughness={0.3} // Lower roughness for a shinier surface
                    metalness={0.5} // Adjust metalness for reflectivity
                />
            </mesh>

            {/* Icon */}
            <mesh position={[1.2, 0, 0]}> {/* Adjust position based on your needs */}
                <planeGeometry args={[2, 2]} /> {/* Adjust size of the icon */}
                <meshBasicMaterial map={texture} transparent={true} />
            </mesh>
        </group>
    );
};

const RotatableBall = () => {
    return (
        <Canvas>
            {/* Lighting */}
            <ambientLight intensity={0.8} /> {/* Increase ambient light intensity */}
            <directionalLight position={[5, 5, 5]} intensity={1.5} /> {/* Increase main light intensity */}
            <directionalLight position={[-5, -5, -5]} intensity={1} /> {/* Additional directional light */}
            <directionalLight position={[-5, 5, 5]} intensity={1} /> {/* Additional directional light */}
            <directionalLight position={[5, -5, -5]} intensity={1} /> {/* Additional directional light */}
            <pointLight position={[5, 5, 5]} intensity={1} /> {/* Add point light for additional brightness */}
            <RotatingBall />
            <OrbitControls enableZoom={false} /> {/* Disable zoom */}
        </Canvas>
    );
};

export default RotatableBall;
