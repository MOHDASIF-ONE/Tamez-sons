"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import type { Mesh } from "three";

function Orb() {
  const mesh = useRef<Mesh>(null);
  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.14;
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
    }
  });
  return (
    <Float speed={0.7} rotationIntensity={0.12} floatIntensity={0.2}>
      <mesh ref={mesh} scale={1.38}>
        <icosahedronGeometry args={[1, 5]} />
        <MeshDistortMaterial
          color="#eb806c"
          roughness={0.3}
          metalness={0.06}
          distort={0.23}
          speed={0.55}
        />
      </mesh>
      <Environment preset="studio" />
    </Float>
  );
}

export function AmbientOrb() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.matchMedia("(max-width: 767px)");
    const update = () => setEnabled(!motion.matches && !small.matches);
    update();
    motion.addEventListener("change", update);
    small.addEventListener("change", update);
    return () => {
      motion.removeEventListener("change", update);
      small.removeEventListener("change", update);
    };
  }, []);
  if (!enabled) return <div aria-hidden="true" className="orb-fallback" />;
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <Canvas
        dpr={[1, 1.4]}
        camera={{ position: [0, 0, 4.2], fov: 38 }}
        gl={{ alpha: true, antialias: false }}
      >
        <ambientLight intensity={1.8} />
        <directionalLight position={[2, 3, 3]} intensity={3} />
        <Suspense fallback={null}>
          <Orb />
        </Suspense>
      </Canvas>
    </div>
  );
}
