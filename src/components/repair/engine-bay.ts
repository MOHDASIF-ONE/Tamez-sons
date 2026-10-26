import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

type Point = [number, number, number];

/** An original, illustrative engine cutaway, sized to fit beneath the closed bonnet. */
export function createEngineBay(parent: THREE.Object3D) {
  const engine = new THREE.Group();
  engine.name = "repair_engine_cutaway";
  engine.position.set(0, 0, -1.415);
  parent.add(engine);
  const geometries = new Map<string, THREE.BufferGeometry>();
  const aluminium = new THREE.MeshStandardMaterial({
    color: "#a8b1b5",
    metalness: 0.78,
    roughness: 0.37,
  });
  const machined = new THREE.MeshStandardMaterial({
    color: "#d9dfe0",
    metalness: 0.86,
    roughness: 0.22,
  });
  const iron = new THREE.MeshStandardMaterial({
    color: "#3e484d",
    metalness: 0.65,
    roughness: 0.5,
  });
  const rubber = new THREE.MeshStandardMaterial({
    color: "#151d22",
    metalness: 0.05,
    roughness: 0.72,
  });
  const enamel = new THREE.MeshPhysicalMaterial({
    color: "#8c4333",
    metalness: 0.52,
    roughness: 0.36,
    clearcoat: 0.35,
  });
  const brass = new THREE.MeshStandardMaterial({
    color: "#ad8e57",
    metalness: 0.8,
    roughness: 0.32,
  });
  const socket = new THREE.MeshStandardMaterial({
    color: "#11191d",
    roughness: 0.6,
  });
  const red = new THREE.MeshStandardMaterial({
    color: "#9c4738",
    roughness: 0.5,
  });

  function geometry(key: string, make: () => THREE.BufferGeometry) {
    if (!geometries.has(key)) geometries.set(key, make());
    return geometries.get(key)!;
  }
  function mesh(
    name: string,
    shape: THREE.BufferGeometry,
    material: THREE.Material,
    position: Point,
    target: THREE.Object3D = engine,
  ) {
    const part = new THREE.Mesh(shape, material);
    part.name = name;
    part.position.set(...position);
    part.castShadow = true;
    part.receiveShadow = true;
    target.add(part);
    return part;
  }
  function box(
    name: string,
    size: Point,
    position: Point,
    material: THREE.Material,
    target: THREE.Object3D = engine,
    radius = 0.009,
  ) {
    return mesh(
      name,
      geometry(
        `box:${size}:${radius}`,
        () => new RoundedBoxGeometry(...size, 2, radius),
      ),
      material,
      position,
      target,
    );
  }
  function cylinder(
    name: string,
    radius: number,
    height: number,
    position: Point,
    material: THREE.Material,
    target: THREE.Object3D = engine,
    sides = 32,
  ) {
    return mesh(
      name,
      geometry(
        `cylinder:${radius}:${height}:${sides}`,
        () => new THREE.CylinderGeometry(radius, radius, height, sides),
      ),
      material,
      position,
      target,
    );
  }
  function ring(
    name: string,
    radius: number,
    tube: number,
    position: Point,
    material: THREE.Material,
    target: THREE.Object3D = engine,
  ) {
    const part = mesh(
      name,
      geometry(
        `ring:${radius}:${tube}`,
        () => new THREE.TorusGeometry(radius, tube, 8, 32),
      ),
      material,
      position,
      target,
    );
    part.rotation.x = Math.PI / 2;
    return part;
  }
  function pipe(
    name: string,
    points: Point[],
    radius: number,
    material: THREE.Material,
    target: THREE.Object3D = engine,
  ) {
    const curve = new THREE.CatmullRomCurve3(
      points.map((point) => new THREE.Vector3(...point)),
    );
    return mesh(
      name,
      geometry(
        `${name}:${points}`,
        () => new THREE.TubeGeometry(curve, 28, radius, 10, false),
      ),
      material,
      [0, 0, 0],
      target,
    );
  }
  function bolt(
    position: Point,
    target: THREE.Object3D = engine,
    radius = 0.009,
  ) {
    cylinder("engine_hex_bolt", radius, 0.008, position, machined, target, 6);
    cylinder(
      "engine_bolt_recess",
      radius * 0.43,
      0.001,
      [position[0], position[1] + 0.0045, position[2]],
      socket,
      target,
      6,
    );
  }

  // A machined deck with six real openings rather than circles painted on a solid block.
  const deckShape = new THREE.Shape();
  const halfWidth = 0.277,
    halfLength = 0.304,
    corner = 0.025;
  deckShape.moveTo(-halfWidth + corner, -halfLength);
  deckShape.lineTo(halfWidth - corner, -halfLength);
  deckShape.quadraticCurveTo(
    halfWidth,
    -halfLength,
    halfWidth,
    -halfLength + corner,
  );
  deckShape.lineTo(halfWidth, halfLength - corner);
  deckShape.quadraticCurveTo(
    halfWidth,
    halfLength,
    halfWidth - corner,
    halfLength,
  );
  deckShape.lineTo(-halfWidth + corner, halfLength);
  deckShape.quadraticCurveTo(
    -halfWidth,
    halfLength,
    -halfWidth,
    halfLength - corner,
  );
  deckShape.lineTo(-halfWidth, -halfLength + corner);
  deckShape.quadraticCurveTo(
    -halfWidth,
    -halfLength,
    -halfWidth + corner,
    -halfLength,
  );
  const cylinders: Point[] = [];
  for (const x of [-0.143, 0.143]) {
    for (const z of [-0.19, 0, 0.19]) {
      const hole = new THREE.Path();
      hole.absarc(x, -z, 0.061, 0, Math.PI * 2, true);
      deckShape.holes.push(hole);
      cylinders.push([x, 0.558, z]);
    }
  }
  const deck = mesh(
    "engine_six_bore_block",
    geometry(
      "cylinder_block",
      () =>
        new THREE.ExtrudeGeometry(deckShape, {
          depth: 0.115,
          bevelEnabled: true,
          bevelSize: 0.002,
          bevelThickness: 0.002,
          bevelSegments: 1,
          curveSegments: 24,
        }),
    ),
    aluminium,
    [0, 0.443, 0],
  );
  deck.rotation.x = -Math.PI / 2;
  box("engine_crankcase", [0.49, 0.065, 0.54], [0, 0.431, 0], iron);
  box("engine_sump", [0.37, 0.036, 0.44], [0, 0.396, 0], aluminium);

  const pistons = cylinders.map(([x, y, z], index) => {
    ring("engine_cylinder_liner", 0.059, 0.0035, [x, y + 0.003, z], machined);
    const liner = mesh(
      "engine_bore_wall",
      geometry(
        "liner",
        () => new THREE.CylinderGeometry(0.059, 0.059, 0.092, 32, 1, true),
      ),
      new THREE.MeshStandardMaterial({
        color: "#626c70",
        metalness: 0.8,
        roughness: 0.3,
        side: THREE.DoubleSide,
      }),
      [x, y - 0.046, z],
    );
    liner.receiveShadow = true;
    const piston = new THREE.Group();
    piston.name = `engine_piston_${index + 1}`;
    piston.position.set(x, 0.52 - (index % 3) * 0.008, z);
    engine.add(piston);
    cylinder("engine_piston_crown", 0.054, 0.023, [0, 0, 0], machined, piston);
    ring("engine_piston_ring", 0.0545, 0.0018, [0, -0.006, 0], iron, piston);
    for (const offset of [-0.021, 0.021])
      cylinder(
        "engine_piston_valve_relief",
        0.012,
        0.001,
        [offset, 0.0118, 0],
        iron,
        piston,
      );
    return { object: piston, seatedY: piston.position.y };
  });
  for (const sign of [-1, 1]) {
    for (let i = 0; i < 5; i++)
      box(
        "engine_cast_block_rib",
        [0.018, 0.09, 0.013],
        [sign * 0.28, 0.494, -0.24 + i * 0.12],
        aluminium,
        engine,
        0.003,
      );
    for (const z of [-0.26, -0.095, 0.095, 0.26])
      bolt([sign * 0.254, 0.563, z]);
  }

  // Both cylinder heads and the intake lift only after the hinged bonnet has cleared them.
  const heads = [-1, 1].map((sign) => {
    const head = new THREE.Group();
    head.name =
      sign < 0 ? "engine_left_cylinder_head" : "engine_right_cylinder_head";
    head.position.set(sign * 0.143, 0.577, 0);
    engine.add(head);
    box(
      "engine_head_gasket",
      [0.245, 0.007, 0.603],
      [0, -0.015, 0],
      iron,
      head,
      0.003,
    );
    box(
      "engine_aluminium_head",
      [0.239, 0.027, 0.594],
      [0, 0, 0],
      aluminium,
      head,
    );
    box(
      "engine_valve_cover",
      [0.216, 0.041, 0.573],
      [0, 0.034, 0],
      enamel,
      head,
      0.018,
    );
    for (const x of [-0.065, -0.032, 0, 0.032, 0.065])
      box(
        "engine_cover_machined_rib",
        [0.005, 0.003, 0.45],
        [x, 0.055, 0],
        machined,
        head,
        0.001,
      );
    for (const z of [-0.19, 0, 0.19]) {
      cylinder(
        "engine_spark_plug_boot",
        0.018,
        0.011,
        [0, 0.061, z],
        rubber,
        head,
      );
      for (const x of [-0.095, 0.095]) bolt([x, 0.045, z], head, 0.007);
      for (const x of [-0.048, 0.048]) {
        cylinder(
          "engine_valve_spring",
          0.017,
          0.027,
          [x, -0.025, z],
          iron,
          head,
        );
        ring(
          "engine_valve_spring_seat",
          0.017,
          0.003,
          [x, -0.041, z],
          machined,
          head,
        );
      }
    }
    return {
      object: head,
      sign,
      seatedX: head.position.x,
      seatedY: head.position.y,
    };
  });
  const intake = new THREE.Group();
  intake.name = "engine_intake_assembly";
  intake.position.set(0, 0.635, 0.015);
  engine.add(intake);
  box(
    "engine_intake_plenum",
    [0.14, 0.064, 0.46],
    [0, 0, 0],
    aluminium,
    intake,
    0.028,
  );
  box(
    "engine_intake_centre_spine",
    [0.028, 0.007, 0.33],
    [0, 0.034, 0],
    iron,
    intake,
    0.004,
  );
  for (const sign of [-1, 1]) {
    for (const z of [-0.17, 0, 0.17]) {
      pipe(
        `engine_intake_runner_${sign}_${z}`,
        [
          [sign * 0.05, -0.005, z],
          [sign * 0.105, -0.012, z],
          [sign * 0.13, -0.054, z],
          [sign * 0.114, -0.073, z],
        ],
        0.022,
        aluminium,
        intake,
      );
    }
  }
  const throttle = cylinder(
    "engine_throttle_body",
    0.047,
    0.068,
    [0, 0.635, -0.274],
    machined,
  );
  throttle.rotation.x = Math.PI / 2;
  pipe(
    "engine_air_intake_hose",
    [
      [0, 0.633, -0.308],
      [0.1, 0.616, -0.35],
      [0.29, 0.576, -0.3],
      [0.38, 0.552, -0.2],
    ],
    0.039,
    rubber,
  );
  for (const z of [-0.3, -0.322]) {
    const clamp = ring(
      "engine_intake_hose_clamp",
      0.041,
      0.003,
      [0, 0.633, z],
      machined,
    );
    clamp.rotation.x = 0;
  }
  box("engine_air_filter_box", [0.17, 0.1, 0.24], [0.382, 0.536, -0.1], rubber);
  for (let i = 0; i < 7; i++)
    box(
      "engine_air_filter_rib",
      [0.13, 0.007, 0.007],
      [0.382, 0.591, -0.185 + i * 0.028],
      iron,
      engine,
      0.002,
    );

  // Front accessory drive: separate pulleys, grooves, centres and a continuous serpentine belt.
  const pulleys = [
    { x: 0, y: 0.461, r: 0.058 },
    { x: -0.205, y: 0.526, r: 0.041 },
    { x: 0.202, y: 0.521, r: 0.049 },
  ];
  for (const { x, y, r } of pulleys) {
    const pulley = cylinder(
      "engine_accessory_pulley",
      r,
      0.024,
      [x, y, -0.328],
      iron,
    );
    pulley.rotation.x = Math.PI / 2;
    const face = cylinder(
      "engine_pulley_hub",
      r * 0.54,
      0.028,
      [x, y, -0.331],
      machined,
    );
    face.rotation.x = Math.PI / 2;
    const centre = cylinder(
      "engine_pulley_hex",
      0.011,
      0.031,
      [x, y, -0.334],
      brass,
      engine,
      6,
    );
    centre.rotation.x = Math.PI / 2;
    for (const offset of [-0.005, 0.005]) {
      const groove = ring(
        "engine_pulley_groove",
        r,
        0.0025,
        [x, y, -0.328 + offset],
        machined,
      );
      groove.rotation.x = 0;
    }
  }
  pipe(
    "engine_serpentine_belt",
    [
      [-0.244, 0.527, -0.342],
      [-0.229, 0.56, -0.342],
      [-0.19, 0.568, -0.342],
      [0.2, 0.568, -0.342],
      [0.25, 0.531, -0.342],
      [0.23, 0.482, -0.342],
      [0.04, 0.408, -0.342],
      [-0.04, 0.41, -0.342],
      [-0.23, 0.494, -0.342],
      [-0.244, 0.527, -0.342],
    ],
    0.007,
    rubber,
  );
  const alternator = cylinder(
    "engine_alternator_body",
    0.058,
    0.1,
    [-0.205, 0.526, -0.25],
    aluminium,
  );
  alternator.rotation.x = Math.PI / 2;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    box(
      "engine_alternator_vent",
      [0.014, 0.009, 0.067],
      [-0.205 + Math.cos(a) * 0.054, 0.526 + Math.sin(a) * 0.054, -0.25],
      iron,
      engine,
      0.002,
    );
  }

  // Radiator, coolant plumbing, wiring and a serviceable battery anchor the engine in a bay.
  box("engine_radiator_core", [0.88, 0.115, 0.055], [0, 0.499, -0.465], iron);
  for (let i = 0; i < 30; i++)
    box(
      "engine_radiator_fin",
      [0.008, 0.097, 0.058],
      [-0.409 + i * 0.028, 0.499, -0.467],
      aluminium,
      engine,
      0.001,
    );
  box(
    "engine_radiator_top_tank",
    [0.89, 0.035, 0.074],
    [0, 0.568, -0.465],
    rubber,
  );
  cylinder(
    "engine_radiator_pressure_cap",
    0.027,
    0.014,
    [-0.32, 0.593, -0.465],
    machined,
  );
  pipe(
    "engine_upper_coolant_hose",
    [
      [-0.37, 0.563, -0.45],
      [-0.405, 0.593, -0.32],
      [-0.37, 0.6, -0.13],
      [-0.28, 0.565, -0.06],
    ],
    0.023,
    rubber,
  );
  pipe(
    "engine_lower_coolant_hose",
    [
      [0.37, 0.478, -0.45],
      [0.43, 0.47, -0.3],
      [0.34, 0.446, -0.13],
      [0.27, 0.45, 0.05],
    ],
    0.02,
    rubber,
  );
  for (const sign of [-1, 1]) {
    pipe(
      `engine_wiring_loom_${sign}`,
      [
        [sign * 0.34, 0.48, -0.15],
        [sign * 0.33, 0.552, 0.04],
        [sign * 0.3, 0.58, 0.24],
        [sign * 0.41, 0.62, 0.29],
      ],
      0.009,
      rubber,
    );
    for (const z of [-0.16, 0.02, 0.2])
      pipe(
        `engine_exhaust_header_${sign}_${z}`,
        [
          [sign * 0.26, 0.53, z],
          [sign * 0.315, 0.49, z],
          [sign * 0.32, 0.448, z + 0.06],
          [sign * 0.3, 0.419, 0.24],
        ],
        0.017,
        brass,
      );
  }
  box("engine_battery", [0.175, 0.103, 0.165], [0.402, 0.602, 0.265], rubber);
  box(
    "engine_battery_lid",
    [0.184, 0.017, 0.174],
    [0.402, 0.659, 0.265],
    iron,
    engine,
    0.004,
  );
  cylinder("engine_battery_positive", 0.014, 0.016, [0.351, 0.677, 0.219], red);
  cylinder(
    "engine_battery_negative",
    0.014,
    0.016,
    [0.453, 0.677, 0.219],
    machined,
  );
  box(
    "engine_battery_hold_down",
    [0.019, 0.006, 0.168],
    [0.402, 0.672, 0.265],
    aluminium,
    engine,
    0.002,
  );
  bolt([0.402, 0.68, 0.331]);
  const dipstick = ring(
    "engine_oil_dipstick",
    0.015,
    0.004,
    [-0.311, 0.582, 0.19],
    brass,
  );
  dipstick.rotation.z = 0.35;
  pipe(
    "engine_dipstick_tube",
    [
      [-0.311, 0.567, 0.19],
      [-0.31, 0.494, 0.2],
      [-0.27, 0.454, 0.18],
    ],
    0.004,
    machined,
  );

  function update(amount: number) {
    // Stage the cutaway after the bonnet opens; reassemble before the bonnet shuts.
    const opening = THREE.MathUtils.smoothstep(amount, 0.44, 0.9);
    for (const head of heads) {
      head.object.position.y = head.seatedY + opening * 0.16;
      head.object.position.x = head.seatedX + head.sign * opening * 0.042;
    }
    intake.position.y = 0.635 + opening * 0.23;
    for (const piston of pistons)
      piston.object.position.y = piston.seatedY + opening * 0.014;
    return heads[0].object.position.y - heads[0].seatedY;
  }
  let partCount = 0;
  engine.traverse((part) => {
    if (part instanceof THREE.Mesh) partCount++;
  });
  update(0);
  return {
    update,
    partCount,
    get lift() {
      return heads[0].object.position.y - heads[0].seatedY;
    },
    dispose: () => geometries.forEach((shape) => shape.dispose()),
  };
}
