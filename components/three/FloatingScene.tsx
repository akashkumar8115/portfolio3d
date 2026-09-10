"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Rings() {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.18;
      group.current.rotation.x += delta * 0.05;
    }
  });
  return (
    <group ref={group}>
      <mesh>
        <torusGeometry args={[2.4, 0.04, 16, 80]} />
        <meshStandardMaterial color="#38bdf8" metalness={0.4} roughness={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, 0.4, 0]}>
        <torusGeometry args={[1.7, 0.03, 16, 80]} />
        <meshStandardMaterial color="#0ea5e9" metalness={0.5} roughness={0.15} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial color="#0284c7" wireframe />
      </mesh>
    </group>
  );
}

export default function FloatingScene() {
  return (
    <div className="pointer-events-none absolute right-[-40px] top-24 hidden h-72 w-72 opacity-70 lg:block">
      <Canvas camera={{ position: [0, 0, 6] }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 3, 4]} intensity={1.2} />
        <Suspense fallback={null}>
          <Rings />
        </Suspense>
      </Canvas>
    </div>
  );
}
