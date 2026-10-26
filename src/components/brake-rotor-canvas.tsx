"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import { useState } from "react";
import { CircleHelp, Rotate3D } from "lucide-react";

function RotorModel() {
  const ventPositions = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2;
    return [Math.cos(angle) * 0.83, Math.sin(angle) * 0.83, 0.152] as [
      number,
      number,
      number,
    ];
  });
  const boltPositions = Array.from({ length: 5 }, (_, i) => {
    const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
    return [Math.cos(angle) * 0.39, Math.sin(angle) * 0.39, 0.285] as [
      number,
      number,
      number,
    ];
  });

  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.1, 1.1, 0.22, 64, 1]} />
        <meshStandardMaterial
          color="#7b8790"
          metalness={0.92}
          roughness={0.29}
        />
      </mesh>
      <mesh position={[0, 0, 0.13]}>
        <torusGeometry args={[1.01, 0.035, 8, 72]} />
        <meshStandardMaterial
          color="#c1c7c9"
          metalness={0.92}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 0, 0.137]}>
        <torusGeometry args={[0.58, 0.022, 8, 64]} />
        <meshStandardMaterial
          color="#47535b"
          metalness={0.88}
          roughness={0.34}
        />
      </mesh>
      {ventPositions.map((position, index) => (
        <mesh key={`vent-${index}`} position={position}>
          <cylinderGeometry args={[0.046, 0.046, 0.012, 16]} />
          <meshStandardMaterial
            color="#232b30"
            metalness={0.6}
            roughness={0.6}
          />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.49, 0.49, 0.18, 48]} />
        <meshStandardMaterial
          color="#b8bec0"
          metalness={0.9}
          roughness={0.27}
        />
      </mesh>
      <mesh position={[0, 0, 0.3]}>
        <torusGeometry args={[0.3, 0.03, 8, 48]} />
        <meshStandardMaterial
          color="#5d6971"
          metalness={0.85}
          roughness={0.28}
        />
      </mesh>
      {boltPositions.map((position, index) => (
        <group key={`bolt-${index}`} position={position}>
          <mesh>
            <cylinderGeometry args={[0.064, 0.064, 0.045, 6]} />
            <meshStandardMaterial
              color="#e3e4e1"
              metalness={0.95}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0, 0, 0.024]}>
            <circleGeometry args={[0.028, 12]} />
            <meshBasicMaterial color="#34414a" />
          </mesh>
        </group>
      ))}
      <mesh position={[1.04, 0.04, 0.05]} castShadow>
        <boxGeometry args={[0.36, 0.72, 0.34]} />
        <meshStandardMaterial
          color="#e46d38"
          metalness={0.58}
          roughness={0.32}
        />
      </mesh>
      <mesh position={[1.04, 0.04, 0.233]}>
        <boxGeometry args={[0.18, 0.38, 0.018]} />
        <meshStandardMaterial
          color="#27323a"
          metalness={0.72}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}

export default function BrakeRotorCanvas() {
  const prefersReducedMotion = useReducedMotion();
  const [autoRotate, setAutoRotate] = useState(false);

  return (
    <div className="rotor-canvas-wrap">
      <Canvas
        aria-label="Three dimensional generic brake rotor. Drag to rotate."
        camera={{ position: [0, 0.15, 4.2], fov: 37 }}
        dpr={[1, 1.25]}
        fallback={<p>Interactive 3D preview is unavailable in this browser.</p>}
        frameloop={autoRotate && !prefersReducedMotion ? "always" : "demand"}
        gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      >
        <color attach="background" args={["#101a25"]} />
        <ambientLight intensity={1.8} />
        <directionalLight position={[2.6, 3.2, 4]} intensity={3.2} />
        <directionalLight
          position={[-3, -1, 2]}
          intensity={1.7}
          color="#f47b35"
        />
        <RotorModel />
        <OrbitControls
          autoRotate={autoRotate && !prefersReducedMotion}
          autoRotateSpeed={0.75}
          enableDamping
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI * 0.72}
          minPolarAngle={Math.PI * 0.28}
          rotateSpeed={0.72}
        />
      </Canvas>
      <div className="rotor-canvas-actions">
        <button
          aria-pressed={autoRotate}
          className="rotor-control"
          disabled={!!prefersReducedMotion}
          onClick={() => setAutoRotate((value) => !value)}
          title={
            prefersReducedMotion
              ? "Automatic rotation is disabled by your reduced-motion preference"
              : undefined
          }
          type="button"
        >
          <Rotate3D aria-hidden="true" size={15} />{" "}
          {autoRotate ? "Pause rotation" : "Auto-rotate"}
        </button>
        <span
          aria-label="3D controls"
          title="Drag with a pointer or touch to change the viewing angle"
        >
          <CircleHelp aria-hidden="true" size={15} /> drag to orbit
        </span>
      </div>
    </div>
  );
}
