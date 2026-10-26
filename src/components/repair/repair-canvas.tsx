"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  type MutableRefObject,
} from "react";
import * as THREE from "three";
import type { SceneInput } from "./repair-experience";
import { Brake, MechanicalAssemblies } from "./mechanical-assemblies";
import { createOpeningBonnet } from "./opening-bonnet";

type Props = {
  mode: "vehicle" | "mechanical";
  input: MutableRefObject<SceneInput>;
  reduced: boolean;
  visible: boolean;
};

// Polling the small input ref is cheap; WebGL only draws while an interaction settles.
function MotionLoop({ input, visible, reduced, mode }: Props) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    if (!visible) return;
    let frame = 0;
    let until = performance.now() + 3000;
    const previous = { scroll: -1, hover: -1, x: -1, y: -1 };
    const tick = (time: number) => {
      const next = input.current;
      if (
        next.scroll !== previous.scroll ||
        next.hover !== previous.hover ||
        next.x !== previous.x ||
        next.y !== previous.y
      ) {
        Object.assign(previous, next);
        until = time + (reduced ? 150 : 3000);
      }
      if (time < until || (!reduced && mode === "mechanical" && next.hover > 0))
        invalidate();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [input, visible, reduced, mode, invalidate]);
  return null;
}

function Vehicle({ input, reduced }: Pick<Props, "input" | "reduced">) {
  const { scene } = useGLTF("/models/ferrari.glb", "/models/draco/");
  const group = useRef<THREE.Group>(null);
  const brake = useRef<THREE.Group>(null);
  const amount = useRef(0);
  const { gl, invalidate } = useThree();
  const preparedModel = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((object) => {
      object.userData.origin = object.position.clone();
      if (!(object instanceof THREE.Mesh)) return;
      object.castShadow =
        object.name === "body" || object.name.startsWith("tire");
      object.receiveShadow = object.name === "body";
      if (object.material instanceof THREE.Material)
        object.material = object.material.clone();
      if (object.name === "body")
        object.material = new THREE.MeshPhysicalMaterial({
          color: "#78858e",
          metalness: 0.95,
          roughness: 0.27,
          clearcoat: 1,
          clearcoatRoughness: 0.15,
        });
      if (object.name.startsWith("rim_") || object.name === "trim")
        object.material = new THREE.MeshStandardMaterial({
          color: "#a0abb3",
          metalness: 1,
          roughness: 0.28,
        });
      if (object.name === "glass")
        object.material = new THREE.MeshPhysicalMaterial({
          color: "#25313c",
          metalness: 0.2,
          roughness: 0.1,
          transparent: true,
          opacity: 0.8,
          depthWrite: false,
          side: THREE.FrontSide,
        });
      if (object.name === "brakes")
        object.material = new THREE.MeshStandardMaterial({
          color: "#d25a33",
          metalness: 0.65,
          roughness: 0.32,
        });
      if (
        object.name.startsWith("interior") ||
        object.name === "leather" ||
        object.name === "carpet"
      )
        object.material = new THREE.MeshStandardMaterial({
          color: "#17202a",
          roughness: 0.75,
          metalness: 0.05,
        });
    });
    return { scene: clone, bonnet: createOpeningBonnet(clone) };
  }, [scene]);
  const model = preparedModel.scene;
  const wheels = useMemo(
    () =>
      ["wheel_fr", "wheel_fl", "wheel_rr", "wheel_rl"].map((name) =>
        model.getObjectByName(name)!,
      ),
    [model],
  );

  useEffect(() => {
    wheels[0].children.forEach((child) => {
      if (child.name.startsWith("brake")) child.visible = false;
    });
  }, [wheels]);

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.setAttribute("data-model", "detailed-gltf");
    let triangles = 0;
    model.traverse((object) => {
      if (object instanceof THREE.Mesh)
        triangles +=
          (object.geometry.index?.count ??
            object.geometry.attributes.position.count) / 3;
    });
    canvas.setAttribute("data-triangles", String(triangles));
    canvas.setAttribute(
      "data-engine-parts",
      String(preparedModel.bonnet.engine.partCount),
    );
    return () => {
      preparedModel.bonnet.dispose();
      model.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
    };
  }, [gl, model, preparedModel]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.25);
    const state = input.current;
    const target = reduced
      ? 0
      : Math.max(state.hover * 0.92, Math.sin(state.scroll * Math.PI) * 0.85);
    if (Math.abs(amount.current - target) > 0.0005) invalidate();
    amount.current = THREE.MathUtils.damp(amount.current, target, 3.5, dt);
    const a = amount.current;
    const bonnetAngle = preparedModel.bonnet.update(a);
    gl.domElement.setAttribute("data-bonnet-angle", bonnetAngle.toFixed(2));
    gl.domElement.setAttribute(
      "data-engine-lift",
      preparedModel.bonnet.engine.lift.toFixed(3),
    );
    if (brake.current) brake.current.position.set(0.84, 0.36 + a * 0.1, -1.155);
    wheels.forEach((wheel, index) => {
      const origin = wheel.userData.origin as THREE.Vector3;
      const sign = origin.x > 0 ? 1 : -1;
      const distance = index < 2 ? 0.95 : 0.46;
      wheel.position.x = origin.x + a * sign * distance;
      wheel.position.y = origin.y + a * 0.1;
      wheel.children.forEach((child) => {
        const base = child.userData.origin as THREE.Vector3;
        child.position.x =
          base.x +
          (child.name.startsWith("brake")
            ? -sign * a * distance * 0.76
            : child.name.startsWith("nuts")
              ? sign * a * 0.13
              : 0);
      });
    });
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        reduced ? 0 : -state.scroll * 0.28 + state.x * 0.12,
        4,
        dt,
      );
      group.current.rotation.x = THREE.MathUtils.damp(
        group.current.rotation.x,
        reduced ? 0 : state.y * 0.025,
        4,
        dt,
      );
      group.current.position.y = 0.04 + a * 0.13;
    }
    gl.domElement.setAttribute("data-separation", a.toFixed(3));
    gl.domElement.setAttribute("data-ready", "true");
    gl.domElement.setAttribute("data-scroll", state.scroll.toFixed(3));
  });
  return (
    <group ref={group} position={[0, 0.04, 0]}>
      <primitive object={model} dispose={null} />
      <group
        ref={brake}
        position={[0.84, 0.36, -1.155]}
        rotation={[0, Math.PI / 2, 0]}
        scale={0.22}
      >
        <Brake amount={amount} rotation={[0, 0, 0]} />
      </group>
    </group>
  );
}

function Scene(props: Props) {
  const { camera, size, gl } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  useEffect(() => {
    gl.domElement.setAttribute("data-renderer", "webgl");
    if (props.mode === "mechanical")
      gl.domElement.setAttribute("data-ready", "true");
  }, [gl, props.mode]);
  useFrame((_, delta) => {
    const mobile = size.width < 550;
    if (props.mode === "vehicle") {
      const p = props.reduced ? 0 : props.input.current.scroll;
      const opening = props.reduced
        ? 0
        : Math.max(
            props.input.current.hover * 0.92,
            Math.sin(p * Math.PI) * 0.85,
          );
      target.set(
        (mobile ? 5.1 : 4.5) + p * 0.65,
        (mobile ? 2.6 : 2.25) + opening * 0.85,
        mobile ? -6.6 : -5.5,
      );
      if (props.reduced) camera.position.copy(target);
      else
        camera.position.lerp(target, 1 - Math.exp(-4 * Math.min(delta, 0.25)));
      camera.lookAt(0, 0.62, 0);
    } else {
      camera.position.set(mobile ? 4.3 : 3.5, 2.1, mobile ? 6.4 : 5.6);
      camera.lookAt(0, 0.15, 0);
      gl.domElement.setAttribute(
        "data-scroll",
        props.input.current.scroll.toFixed(3),
      );
    }
  });
  const dark = props.mode === "mechanical";
  return (
    <>
      <MotionLoop {...props} />
      <ambientLight intensity={dark ? 0.35 : 0.3} />
      <directionalLight
        position={[3, 7, -5]}
        intensity={dark ? 2.2 : 1.7}
        color="#fff2dd"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0005}
      />
      <directionalLight
        position={[-4, 3, 4]}
        intensity={dark ? 2.6 : 0.8}
        color="#c5e4ef"
      />
      <Suspense fallback={null}>
        <Environment resolution={256} environmentIntensity={dark ? 1.25 : 1.4}>
          <Lightformer
            position={[0, 5, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[10, 3, 1]}
            intensity={3}
          />
          <Lightformer
            position={[-4, 2, 0]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[2, 5, 1]}
            intensity={3}
          />
          <Lightformer
            position={[3, 3, -4]}
            rotation={[0, -Math.PI / 4, 0]}
            scale={[1, 6, 1]}
            intensity={4}
          />
        </Environment>
        {dark ? (
          <MechanicalAssemblies input={props.input} reduced={props.reduced} />
        ) : (
          <Vehicle input={props.input} reduced={props.reduced} />
        )}
      </Suspense>
      {!dark && (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.015, 0]}
          receiveShadow
        >
          <planeGeometry args={[200, 200]} />
          <shadowMaterial opacity={0.2} transparent />
        </mesh>
      )}
    </>
  );
}

export default function RepairCanvas(props: Props) {
  return (
    <Canvas
      shadows={{ type: THREE.PCFShadowMap }}
      dpr={[1, 1.65]}
      frameloop={props.visible ? "demand" : "never"}
      camera={{
        position:
          props.mode === "vehicle" ? [4.5, 2.25, -5.5] : [3.5, 2.1, 5.6],
        fov: props.mode === "vehicle" ? 35 : 37,
        near: 0.1,
        far: 250,
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
