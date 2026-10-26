"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import type { SceneInput } from "./repair-experience";

type Point = [number, number, number];
const TAU = Math.PI * 2;
const steel = "#b5bfc1";
const darkSteel = "#535e60";
function Metal({
  color = steel,
  roughness = 0.25,
  metalness = 0.95,
}: {
  color?: string;
  roughness?: number;
  metalness?: number;
}) {
  return (
    <meshStandardMaterial
      color={color}
      metalness={metalness}
      roughness={roughness}
    />
  );
}
function Cylinder({
  radius,
  height,
  position = [0, 0, 0],
  rotation = [Math.PI / 2, 0, 0],
  color = steel,
  roughness = 0.26,
  segments = 64,
}: {
  radius: number;
  height: number;
  position?: Point;
  rotation?: Point;
  color?: string;
  roughness?: number;
  segments?: number;
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <cylinderGeometry args={[radius, radius, height, segments]} />
      <Metal color={color} roughness={roughness} />
    </mesh>
  );
}
function Bolt({
  position,
  radius = 0.045,
}: {
  position: Point;
  radius?: number;
}) {
  return (
    <group position={position}>
      <Cylinder radius={radius * 1.35} height={0.012} color="#737d7e" />
      <Cylinder
        radius={radius}
        height={0.04}
        position={[0, 0, 0.015]}
        segments={6}
      />
    </group>
  );
}

export function Brake({
  amount,
  rotation = [0.12, -0.35, 0.1],
}: {
  amount: MutableRefObject<number>;
  rotation?: Point;
}) {
  const rotor = useRef<THREE.Group>(null);
  const caliper = useRef<THREE.Group>(null);
  const pads = useRef<THREE.Group>(null);
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 0.84, 0, TAU, false);
    const centre = new THREE.Path();
    centre.absarc(0, 0, 0.37, 0, TAU, true);
    shape.holes.push(centre);
    for (let ring = 0; ring < 3; ring++)
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * TAU + ring * 0.08;
        const r = 0.48 + ring * 0.12;
        const hole = new THREE.Path();
        for (let vertex = 0; vertex <= 8; vertex++) {
          const angle = (-vertex / 8) * TAU;
          const x = Math.cos(a) * r + Math.cos(angle) * 0.016;
          const y = Math.sin(a) * r + Math.sin(angle) * 0.016;
          if (vertex === 0) hole.moveTo(x, y);
          else hole.lineTo(x, y);
        }
        shape.holes.push(hole);
      }
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.025,
      bevelEnabled: true,
      bevelSegments: 1,
      steps: 1,
      bevelSize: 0.003,
      bevelThickness: 0.003,
      curveSegments: 72,
    });
  }, []);
  const caliperShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.16, -0.43);
    shape.bezierCurveTo(-0.35, -0.35, -0.39, 0.32, -0.14, 0.46);
    shape.lineTo(0.16, 0.46);
    shape.quadraticCurveTo(0.26, 0.4, 0.26, 0.28);
    shape.lineTo(0.26, -0.25);
    shape.quadraticCurveTo(0.25, -0.4, 0.1, -0.43);
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.22,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.035,
      bevelThickness: 0.035,
      curveSegments: 20,
    });
  }, []);
  useEffect(
    () => () => {
      geometry.dispose();
      caliperShape.dispose();
    },
    [geometry, caliperShape],
  );
  useFrame(() => {
    const a = amount.current;
    if (rotor.current) rotor.current.position.z = a * 0.62;
    if (caliper.current) {
      caliper.current.position.x = a * 0.42;
      caliper.current.position.z = a * 0.35;
    }
    if (pads.current) pads.current.position.z = a * 1.15;
  });
  return (
    <group rotation={rotation} scale={1.33}>
      <Cylinder
        radius={0.23}
        height={0.42}
        position={[0, 0, -0.28]}
        color={darkSteel}
      />
      <Cylinder
        radius={0.35}
        height={0.1}
        position={[0, 0, -0.11]}
        color={darkSteel}
      />
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * TAU;
        return (
          <Bolt
            key={i}
            position={[Math.cos(a) * 0.22, Math.sin(a) * 0.22, -0.04]}
            radius={0.035}
          />
        );
      })}
      <group ref={rotor}>
        {[-0.07, 0.045].map((z) => (
          <mesh key={z} geometry={geometry} position={[0, 0, z]} castShadow>
            <Metal color="#b6c0c2" roughness={0.32} />
          </mesh>
        ))}
        {Array.from({ length: 48 }, (_, i) => {
          const a = (i / 48) * TAU;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 0.61, Math.sin(a) * 0.61, 0]}
              rotation={[0, 0, a]}
            >
              <boxGeometry args={[0.43, 0.014, 0.09]} />
              <Metal color="#758082" roughness={0.4} />
            </mesh>
          );
        })}
        <Cylinder radius={0.37} height={0.15} color="#7f8b8c" />
        <Cylinder
          radius={0.2}
          height={0.19}
          position={[0, 0, 0.02]}
          color="#9ba8a9"
        />
        <Cylinder
          radius={0.1}
          height={0.2}
          position={[0, 0, 0.025]}
          color="#465255"
        />
        {Array.from({ length: 5 }, (_, i) => {
          const a = (i / 5) * TAU;
          return (
            <Bolt
              key={i}
              position={[Math.cos(a) * 0.275, Math.sin(a) * 0.275, 0.105]}
              radius={0.028}
            />
          );
        })}
        {[0.39, 0.8, 0.825].map((radius) => (
          <mesh key={radius} position={[0, 0, 0.074]}>
            <torusGeometry args={[radius, 0.0015, 4, 128]} />
            <Metal color="#d7dedd" roughness={0.35} />
          </mesh>
        ))}
      </group>
      <group ref={caliper}>
        <mesh geometry={caliperShape} position={[0.63, -0.02, 0.01]} castShadow>
          <Metal color="#c85934" roughness={0.3} metalness={0.7} />
        </mesh>
        {[-0.26, 0.27].map((y) => (
          <Bolt key={y} position={[0.76, y, 0.31]} radius={0.035} />
        ))}
        <RoundedBox
          args={[0.12, 0.39, 0.03]}
          radius={0.025}
          smoothness={2}
          position={[0.75, 0.03, 0.28]}
        >
          <Metal color="#b54c2d" roughness={0.34} />
        </RoundedBox>
        <Cylinder
          radius={0.025}
          height={0.16}
          position={[0.51, 0.39, 0.19]}
          rotation={[0, 0, -0.25]}
          color={darkSteel}
        />
      </group>
      <group ref={pads}>
        <RoundedBox
          args={[0.18, 0.53, 0.052]}
          radius={0.045}
          smoothness={3}
          position={[0.55, 0, 0.19]}
        >
          <Metal color="#3b4241" roughness={0.85} metalness={0.2} />
        </RoundedBox>
        <RoundedBox
          args={[0.2, 0.56, 0.025]}
          radius={0.04}
          smoothness={2}
          position={[0.55, 0, 0.225]}
        >
          <Metal color="#737b76" roughness={0.45} />
        </RoundedBox>
      </group>
    </group>
  );
}

function Piston({
  amount,
  drive,
}: {
  amount: MutableRefObject<number>;
  drive: MutableRefObject<number>;
}) {
  const crown = useRef<THREE.Group>(null);
  const rod = useRef<THREE.Group>(null);
  const shaft = useRef<THREE.Group>(null);
  const pistonGeometry = useMemo(() => {
    const profile = [
      [0.38, -0.35],
      [0.4, -0.32],
      [0.4, 0.14],
      [0.375, 0.15],
      [0.375, 0.18],
      [0.4, 0.19],
      [0.4, 0.23],
      [0.375, 0.24],
      [0.375, 0.27],
      [0.4, 0.28],
      [0.4, 0.32],
      [0.375, 0.33],
      [0.375, 0.35],
      [0.4, 0.36],
      [0.4, 0.42],
      [0.38, 0.44],
      [0, 0.44],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(profile, 96);
  }, []);
  const rodGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.13, 0.6);
    shape.quadraticCurveTo(-0.3, 0.73, -0.16, 0.87);
    shape.quadraticCurveTo(0, 1.02, 0.16, 0.87);
    shape.quadraticCurveTo(0.3, 0.73, 0.13, 0.6);
    shape.lineTo(0.11, -0.3);
    shape.quadraticCurveTo(0.42, -0.48, 0.22, -0.71);
    shape.quadraticCurveTo(0, -0.92, -0.22, -0.71);
    shape.quadraticCurveTo(-0.42, -0.48, -0.11, -0.3);
    shape.closePath();
    const big = new THREE.Path();
    big.absarc(0, -0.54, 0.19, 0, TAU, true);
    shape.holes.push(big);
    const small = new THREE.Path();
    small.absarc(0, 0.76, 0.105, 0, TAU, true);
    shape.holes.push(small);
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.12,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.025,
      bevelThickness: 0.025,
      curveSegments: 48,
    });
  }, []);
  useEffect(
    () => () => {
      pistonGeometry.dispose();
      rodGeometry.dispose();
    },
    [pistonGeometry, rodGeometry],
  );
  useFrame(() => {
    const a = amount.current;
    if (crown.current)
      crown.current.position.y = 0.8 + a * 0.7 + Math.sin(drive.current) * 0.1;
    if (rod.current) {
      rod.current.position.y = a * 0.1;
      rod.current.position.z = a * 0.25;
      rod.current.rotation.z = Math.sin(drive.current) * 0.08;
    }
    if (shaft.current) {
      shaft.current.position.y = -0.68 - a * 0.35;
      shaft.current.rotation.x = drive.current;
    }
  });
  return (
    <group rotation={[0.05, -0.2, -0.08]} scale={1.05}>
      <group ref={crown} position={[0, 0.8, 0]}>
        <mesh geometry={pistonGeometry} castShadow>
          <Metal color="#b4c0c3" roughness={0.24} />
        </mesh>
        {[0.165, 0.255, 0.34].map((y) => (
          <mesh key={y} rotation={[Math.PI / 2, 0, 0]} position={[0, y, 0]}>
            <torusGeometry args={[0.386, 0.012, 8, 96]} />
            <Metal color="#3e494a" roughness={0.4} />
          </mesh>
        ))}
        <Cylinder
          radius={0.105}
          height={0.83}
          position={[0, -0.12, 0]}
          rotation={[0, 0, Math.PI / 2]}
          color="#667378"
        />
        <Cylinder
          radius={0.17}
          height={0.005}
          position={[0, 0.447, 0]}
          rotation={[0, 0, 0]}
          color="#8a989c"
        />
      </group>
      <group ref={rod}>
        <mesh geometry={rodGeometry} position={[0, 0, -0.065]} castShadow>
          <Metal color="#9ba7aa" roughness={0.28} />
        </mesh>
        <RoundedBox
          args={[0.08, 0.8, 0.04]}
          radius={0.02}
          smoothness={2}
          position={[0, 0.12, 0.095]}
        >
          <Metal color="#526265" roughness={0.33} />
        </RoundedBox>
        {[-0.24, 0.24].map((x) => (
          <Bolt key={x} position={[x, -0.58, 0.12]} radius={0.04} />
        ))}
      </group>
      <group ref={shaft} position={[0, -0.68, 0]}>
        <Cylinder
          radius={0.18}
          height={1.52}
          rotation={[0, 0, Math.PI / 2]}
          color="#7b898d"
        />
        {[-0.49, 0.49].map((x) => (
          <group key={x} position={[x, 0, 0]}>
            <Cylinder
              radius={0.27}
              height={0.16}
              rotation={[0, 0, Math.PI / 2]}
            />
            <RoundedBox
              args={[0.15, 0.65, 0.47]}
              radius={0.13}
              smoothness={3}
              position={[0, -0.19, 0]}
            >
              <Metal color="#748287" roughness={0.35} />
            </RoundedBox>
          </group>
        ))}
        <Cylinder
          radius={0.24}
          height={0.12}
          position={[-0.82, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
        />
        <group position={[0.84, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * TAU;
            return (
              <Bolt
                key={i}
                position={[Math.cos(a) * 0.17, Math.sin(a) * 0.17, 0.01]}
                radius={0.025}
              />
            );
          })}
        </group>
      </group>
    </group>
  );
}

function Strut({ amount }: { amount: MutableRefObject<number> }) {
  const spring = useRef<THREE.Group>(null);
  const cap = useRef<THREE.Group>(null);
  const coil = useMemo(() => {
    const points = Array.from({ length: 241 }, (_, i) => {
      const t = i / 240;
      return new THREE.Vector3(
        Math.cos(t * TAU * 7.5) * 0.32,
        t * 1.53 - 0.5,
        Math.sin(t * TAU * 7.5) * 0.32,
      );
    });
    return new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points),
      240,
      0.042,
      10,
      false,
    );
  }, []);
  useEffect(() => () => coil.dispose(), [coil]);
  useFrame(() => {
    if (spring.current) {
      spring.current.position.x = amount.current * -0.42;
      spring.current.position.y = amount.current * 0.18;
    }
    if (cap.current) cap.current.position.y = amount.current * 0.62;
  });
  return (
    <group rotation={[0.05, 0, -0.22]} scale={1.1}>
      <Cylinder
        radius={0.14}
        height={1.1}
        position={[0, -0.6, 0]}
        rotation={[0, 0, 0]}
        color="#576566"
        roughness={0.3}
      />
      <Cylinder
        radius={0.075}
        height={1.5}
        position={[0, 0.35, 0]}
        rotation={[0, 0, 0]}
        color="#d4e0df"
        roughness={0.13}
      />
      <Cylinder
        radius={0.4}
        height={0.065}
        position={[0, -0.55, 0]}
        rotation={[0, 0, 0]}
        color="#6c7878"
      />
      <group ref={spring}>
        <mesh geometry={coil} castShadow>
          <Metal color="#c35d3b" roughness={0.32} metalness={0.7} />
        </mesh>
      </group>
      <group ref={cap}>
        <Cylinder
          radius={0.4}
          height={0.08}
          position={[0, 1.04, 0]}
          rotation={[0, 0, 0]}
          color="#626f70"
        />
        <Cylinder
          radius={0.22}
          height={0.14}
          position={[0, 1.14, 0]}
          rotation={[0, 0, 0]}
          color="#373f40"
        />
        {Array.from({ length: 3 }, (_, i) => {
          const a = (i / 3) * TAU;
          return (
            <group
              key={i}
              position={[Math.cos(a) * 0.31, 1.12, Math.sin(a) * 0.31]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <Bolt position={[0, 0, 0]} radius={0.04} />
            </group>
          );
        })}
        <Cylinder
          radius={0.06}
          height={0.22}
          position={[0, 1.21, 0]}
          rotation={[0, 0, 0]}
        />
      </group>
      <RoundedBox
        args={[0.16, 0.42, 0.36]}
        radius={0.025}
        smoothness={2}
        position={[0.16, -1.03, 0]}
      >
        <Metal color="#849091" roughness={0.35} />
      </RoundedBox>
      <Cylinder radius={0.08} height={0.4} position={[0.22, -0.98, 0]} />
      <Cylinder radius={0.08} height={0.4} position={[0.22, -1.16, 0]} />
    </group>
  );
}

export function MechanicalAssemblies({
  input,
  reduced,
}: {
  input: MutableRefObject<SceneInput>;
  reduced: boolean;
}) {
  const groups = useRef<(THREE.Group | null)[]>([]);
  const brakeAmount = useRef(0);
  const pistonAmount = useRef(0);
  const strutAmount = useRef(0);
  const drive = useRef(0);
  const { gl, invalidate } = useThree();
  useFrame((_, delta) => {
    const amounts = [brakeAmount, pistonAmount, strutAmount];
    const dt = Math.min(delta, 0.25);
    const p = input.current.scroll;
    const active = Math.min(2, Math.floor(p * 3));
    groups.current.forEach((group, i) => {
      if (!group) return;
      const local = THREE.MathUtils.clamp(p * 3 - i, 0, 1);
      const open = reduced
        ? 0.35
        : Math.sin(local * Math.PI) * 0.95 + input.current.hover * 0.12;
      if (Math.abs(amounts[i].current - open) > 0.0005) invalidate();
      amounts[i].current = reduced
        ? open
        : THREE.MathUtils.damp(amounts[i].current, open, 5, dt);
      const goal = i === active ? 1 : 0.001;
      if (Math.abs(group.scale.x - goal) > 0.0005) invalidate();
      const scale = reduced
        ? goal
        : THREE.MathUtils.damp(group.scale.x, goal, 7, dt);
      group.scale.setScalar(scale);
      group.visible = scale > 0.005;
      group.rotation.y = reduced
        ? -0.2
        : THREE.MathUtils.damp(
            group.rotation.y,
            -0.2 + local * 0.5 + input.current.x * 0.15,
            4,
            dt,
          );
      group.rotation.x = reduced
        ? 0
        : THREE.MathUtils.damp(group.rotation.x, input.current.y * 0.05, 4, dt);
    });
    if (!reduced)
      drive.current =
        p * 30 + (input.current.hover ? drive.current - p * 30 + dt * 1.8 : 0);
    gl.domElement.setAttribute("data-chapter", String(active));
    gl.domElement.setAttribute(
      "data-separation",
      amounts[active].current.toFixed(3),
    );
  });
  return (
    <>
      <group
        ref={(node) => {
          groups.current[0] = node;
        }}
      >
        <Brake amount={brakeAmount} />
      </group>
      <group
        scale={0.001}
        ref={(node) => {
          groups.current[1] = node;
        }}
      >
        <Piston amount={pistonAmount} drive={drive} />
      </group>
      <group
        scale={0.001}
        ref={(node) => {
          groups.current[2] = node;
        }}
      >
        <Strut amount={strutAmount} />
      </group>
    </>
  );
}
