"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

type SkillBox3DProps = {
  textureUrl: string;
  ambientIntensity?: number;
  directionalIntensity?: number;
};

function TexturedBox({ textureUrl }: { textureUrl: string }) {
  const boxRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, textureUrl);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.center.set(0.5, 0.5);

  useFrame((_, delta) => {
    if (boxRef.current) {
      boxRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <mesh ref={boxRef} castShadow>
      <boxGeometry args={[2.2, 2.2, 2.2]} />
      <meshStandardMaterial map={texture} roughness={0.35} metalness={0.2} />
    </mesh>
  );
}

export default function SkillBox3D({
  textureUrl,
  ambientIntensity = 1.8,
  directionalIntensity = 1.2,
}: SkillBox3DProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="mx-auto h-24 w-24">
      {visible ? (
        <Canvas shadows camera={{ position: [4.5, 2, 4.5], fov: 50 }}>
          <ambientLight intensity={ambientIntensity} />
          <directionalLight position={[4, 5, 5]} intensity={directionalIntensity} />
          <Suspense fallback={null}>
            <TexturedBox textureUrl={textureUrl} />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      ) : (
        <div className="h-full w-full rounded-2xl bg-slate-800/80" />
      )}
    </div>
  );
}
