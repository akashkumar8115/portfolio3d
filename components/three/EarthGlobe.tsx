"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

const atmosphereVertex = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragment = `
  varying vec3 vNormal;
  uniform vec3 uColor;
  uniform float uPower;
  void main() {
    float intensity = pow(max(0.0, uPower - dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.4);
    gl_FragColor = vec4(uColor, 1.0) * intensity * 0.55;
  }
`;

function Atmosphere({ scale, power, color, side }: { scale: number; power: number; color: THREE.Color; side: THREE.Side }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        blending: THREE.AdditiveBlending,
        side,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uColor: { value: color },
          uPower: { value: power },
        },
      }),
    [color, power, side],
  );

  return (
    <mesh scale={scale} material={material}>
      <sphereGeometry args={[2.15, 64, 64]} />
    </mesh>
  );
}

function EarthSystem() {
  const earthRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const [dayMap, specMap, normalMap, cloudMap] = useLoader(THREE.TextureLoader, [
    "/images/planet/earth-day.jpg",
    "/images/planet/earth-specular.jpg",
    "/images/planet/earth-normal.jpg",
    "/images/planet/earth-clouds.png",
  ]);

  dayMap.colorSpace = THREE.SRGBColorSpace;
  cloudMap.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.07;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group>
      <group ref={earthRef} rotation={[0.22, 0.55, 0]}>
        <mesh>
          <sphereGeometry args={[2.15, 96, 96]} />
          <meshPhongMaterial
            map={dayMap}
            specularMap={specMap}
            normalMap={normalMap}
            specular={new THREE.Color("#d8ecff")}
            shininess={14}
            normalScale={new THREE.Vector2(0.7, 0.7)}
          />
        </mesh>
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[2.175, 64, 64]} />
          <meshPhongMaterial
            map={cloudMap}
            transparent
            opacity={0.32}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
      <Atmosphere scale={1.012} power={0.78} color={new THREE.Color("#d7eefe")} side={THREE.FrontSide} />
      <Atmosphere scale={1.075} power={0.72} color={new THREE.Color("#9fd4ff")} side={THREE.BackSide} />
    </group>
  );
}

export default function EarthGlobe() {
  return (
    <Canvas
      camera={{ position: [0, 0.12, 6.2], fov: 42 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <ambientLight intensity={0.08} />
      <directionalLight position={[-9, 1.6, 3.2]} intensity={3.4} color="#fff2c2" />
      <directionalLight position={[-6, 0.4, 1.2]} intensity={1.1} color="#ffe08a" />
      <hemisphereLight args={["#fff7e0", "#05070d", 0.22]} />
      <Suspense fallback={null}>
        <Stars radius={90} depth={50} count={1800} factor={2.4} fade speed={0.45} />
        <EarthSystem />
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} rotateSpeed={0.5} />
    </Canvas>
  );
}
