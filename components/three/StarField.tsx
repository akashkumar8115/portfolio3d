"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

function DriftingStars() {
  const points = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const count = 1800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 32;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 8;
      const tint = Math.random();
      colors[i * 3] = tint > 0.8 ? 0.7 : 1;
      colors[i * 3 + 1] = tint > 0.8 ? 0.85 : 1;
      colors[i * 3 + 2] = 1;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (points.current) {
      points.current.rotation.y += delta * 0.018;
      points.current.rotation.x += delta * 0.004;
    }
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={0.085}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.95}
        depthWrite={false}
      />
    </points>
  );
}

function ShootingStar() {
  const group = useRef<THREE.Group>(null);
  const progress = useRef(0);
  const wait = useRef(0.8);
  const startY = useRef(6);

  useFrame((_, delta) => {
    if (!group.current) {
      return;
    }
    wait.current -= delta;
    if (wait.current > 0) {
      group.current.visible = false;
      return;
    }
    progress.current += delta * 1.9;
    const t = progress.current;
    group.current.visible = t < 1.2;
    group.current.position.set(-16 + t * 28, startY.current - t * 8, -4);
    if (t > 1.2) {
      progress.current = 0;
      wait.current = 1.8 + Math.random() * 3.5;
      startY.current = 2 + Math.random() * 6;
    }
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-1.1, 0.4, 0]} rotation={[0, 0, -0.38]}>
        <boxGeometry args={[2.4, 0.02, 0.02]} />
        <meshBasicMaterial color="#dbeafe" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

export default function StarField() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1]">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Suspense fallback={null}>
          <Stars radius={140} depth={60} count={7000} factor={5} saturation={0.2} fade speed={1.1} />
          <DriftingStars />
          <ShootingStar />
        </Suspense>
      </Canvas>
    </div>
  );
}
