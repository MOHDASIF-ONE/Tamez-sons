import * as THREE from "three";
import panel from "@/data/bonnet-panel.json";
import { createEngineBay } from "./engine-bay";

type Point = [number, number, number];
const hinge = new THREE.Vector3(0, 0.844, -0.878);
const maximumAngle = THREE.MathUtils.degToRad(68);

/** Split the original, disconnected bonnet surface; retain its exact paint and normals. */
function splitPanel(source: THREE.BufferGeometry, faces: Set<number>) {
  const indices = source.getIndex()!;
  const retained: number[] = [];
  const moved: number[] = [];
  for (let face = 0; face < indices.count / 3; face++) {
    const target = faces.has(face) ? moved : retained;
    for (let corner = 0; corner < 3; corner++)
      target.push(indices.getX(face * 3 + corner));
  }
  const body = new THREE.BufferGeometry();
  for (const name of Object.keys(source.attributes))
    body.setAttribute(name, source.getAttribute(name));
  body.setIndex(retained);
  body.boundingBox = source.boundingBox?.clone() ?? null;
  body.boundingSphere = source.boundingSphere?.clone() ?? null;

  const lid = new THREE.BufferGeometry();
  const vertexMap = new Map<number, number>();
  const originals: number[] = [];
  const lidIndices = moved.map((index) => {
    if (!vertexMap.has(index)) {
      vertexMap.set(index, originals.length);
      originals.push(index);
    }
    return vertexMap.get(index)!;
  });
  for (const name of Object.keys(source.attributes)) {
    const attribute = source.getAttribute(name);
    const values = new Float32Array(originals.length * attribute.itemSize);
    originals.forEach((index, vertex) => {
      for (let component = 0; component < attribute.itemSize; component++)
        values[vertex * attribute.itemSize + component] =
          attribute.getComponent(index, component);
    });
    lid.setAttribute(
      name,
      new THREE.BufferAttribute(values, attribute.itemSize),
    );
  }
  lid.setIndex(lidIndices);
  lid.computeBoundingBox();
  lid.computeBoundingSphere();
  return { body, lid };
}

export function createOpeningBonnet(model: THREE.Object3D) {
  const body = model.getObjectByName("body") as THREE.Mesh<
    THREE.BufferGeometry,
    THREE.Material
  >;
  if (!body?.geometry.index || body.geometry.index.count !== panel.indexCount)
    throw new Error("Bonnet panel data does not match the vehicle geometry.");

  model.updateMatrixWorld(true);
  const owned: THREE.BufferGeometry[] = [];
  const { body: fixedBody, lid } = splitPanel(
    body.geometry,
    new Set(panel.faces),
  );
  owned.push(fixedBody, lid);
  body.geometry = fixedBody;
  const pivot = new THREE.Group();
  pivot.name = "repair_bonnet_hinge";
  pivot.position.copy(hinge);
  model.add(pivot);
  const relativeMatrix = new THREE.Matrix4()
    .makeTranslation(-hinge.x, -hinge.y, -hinge.z)
    .multiply(body.matrixWorld);
  const bonnet = new THREE.Mesh(lid, body.material);
  bonnet.name = "repair_bonnet_panel";
  bonnet.applyMatrix4(relativeMatrix);
  bonnet.castShadow = true;
  bonnet.receiveShadow = true;
  pivot.add(bonnet);

  const underside = new THREE.Mesh(
    lid,
    new THREE.MeshStandardMaterial({
      color: "#263039",
      metalness: 0.3,
      roughness: 0.67,
      side: THREE.BackSide,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    }),
  );
  underside.applyMatrix4(relativeMatrix);
  underside.name = "repair_bonnet_inner_skin";
  pivot.add(underside);

  // Move the original small front crest with the painted panel, leaving side badges in place.
  const crest = model.getObjectByName("yellow_trim") as THREE.Mesh | undefined;
  if (crest?.geometry.index) {
    const positions = crest.geometry.getAttribute("position");
    const indices = crest.geometry.getIndex()!;
    const vertex = new THREE.Vector3();
    const badgeFaces = new Set<number>();
    for (let face = 0; face < indices.count / 3; face++) {
      let inside = true;
      for (let corner = 0; corner < 3; corner++) {
        vertex
          .fromBufferAttribute(positions, indices.getX(face * 3 + corner))
          .applyMatrix4(crest.matrixWorld);
        if (Math.abs(vertex.x) > 0.1 || vertex.y < 0.5 || vertex.z > -1.65)
          inside = false;
      }
      if (inside) badgeFaces.add(face);
    }
    if (badgeFaces.size) {
      const split = splitPanel(crest.geometry, badgeFaces);
      owned.push(split.body, split.lid);
      crest.geometry = split.body;
      const movingCrest = new THREE.Mesh(split.lid, crest.material);
      movingCrest.applyMatrix4(
        new THREE.Matrix4()
          .makeTranslation(-hinge.x, -hinge.y, -hinge.z)
          .multiply(crest.matrixWorld),
      );
      pivot.add(movingCrest);
    }
  }

  const matte = new THREE.MeshStandardMaterial({
    color: "#202a31",
    roughness: 0.82,
    metalness: 0.12,
  });
  const trim = new THREE.MeshStandardMaterial({
    color: "#3a4650",
    roughness: 0.54,
    metalness: 0.35,
  });
  const steel = new THREE.MeshStandardMaterial({
    color: "#b0bdc6",
    roughness: 0.24,
    metalness: 0.9,
  });
  const compartment = new THREE.Group();
  compartment.name = "repair_front_compartment";
  model.add(compartment);
  function block(
    parent: THREE.Object3D,
    size: Point,
    position: Point,
    material: THREE.Material,
  ) {
    const geometry = new THREE.BoxGeometry(...size);
    owned.push(geometry);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  const outline: [number, number][] = [
    [-0.43, -2.02],
    [0.43, -2.02],
    [0.61, -1.78],
    [0.62, -1.24],
    [0.54, -1.01],
    [-0.54, -1.01],
    [-0.62, -1.24],
    [-0.61, -1.78],
  ];
  const vertices: number[] = [];
  const rimIndices: number[] = [];
  outline.forEach(([x, z]) => {
    const y = 0.54 + (z + 2) * 0.2;
    vertices.push(
      x,
      y,
      z,
      x * 0.91,
      y - 0.012,
      -1.5 + (z + 1.5) * 0.91,
      x * 0.88,
      0.4,
      -1.5 + (z + 1.5) * 0.88,
    );
  });
  for (let i = 0; i < outline.length; i++) {
    const a = i * 3,
      b = ((i + 1) % outline.length) * 3;
    rimIndices.push(
      a,
      b,
      a + 1,
      b,
      b + 1,
      a + 1,
      a + 1,
      b + 1,
      a + 2,
      b + 1,
      b + 2,
      a + 2,
    );
  }
  const rimGeometry = new THREE.BufferGeometry();
  rimGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );
  rimGeometry.setIndex(rimIndices);
  rimGeometry.computeVertexNormals();
  owned.push(rimGeometry);
  const rim = new THREE.Mesh(
    rimGeometry,
    new THREE.MeshStandardMaterial({
      color: "#27323a",
      roughness: 0.85,
      metalness: 0.1,
      side: THREE.DoubleSide,
    }),
  );
  rim.receiveShadow = true;
  compartment.add(rim);
  const floorShape = new THREE.Shape(
    outline.map(
      ([x, z]) => new THREE.Vector2(x * 0.88, 1.5 - (z + 1.5) * 0.88),
    ),
  );
  const floorGeometry = new THREE.ShapeGeometry(floorShape);
  owned.push(floorGeometry);
  const floor = new THREE.Mesh(floorGeometry, matte);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.399;
  floor.receiveShadow = true;
  compartment.add(floor);
  for (let i = 0; i < 6; i++)
    block(
      compartment,
      [0.82, 0.008, 0.012],
      [0, 0.407, -1.76 + i * 0.105],
      trim,
    );
  block(compartment, [1.08, 0.055, 0.065], [0, 0.68, -1.045], trim);
  block(compartment, [0.14, 0.025, 0.06], [0, 0.551, -1.99], steel);
  const reservoirMaterial = new THREE.MeshStandardMaterial({
    color: "#bcc4bf",
    roughness: 0.55,
    metalness: 0.02,
  });
  block(
    compartment,
    [0.15, 0.11, 0.18],
    [-0.43, 0.646, -1.18],
    reservoirMaterial,
  );
  const capGeometry = new THREE.CylinderGeometry(0.043, 0.045, 0.025, 24);
  owned.push(capGeometry);
  const cap = new THREE.Mesh(
    capGeometry,
    new THREE.MeshStandardMaterial({ color: "#b69a5a", roughness: 0.55 }),
  );
  cap.position.set(-0.43, 0.714, -1.18);
  compartment.add(cap);
  const engine = createEngineBay(compartment);
  // Inner pressed ribs are attached to the lid's hinge, so they turn with it.
  for (const x of [-0.47, 0.47]) {
    const rib = block(pivot, [0.018, 0.018, 0.79], [x, -0.13, -0.62], trim);
    rib.rotation.x = -0.19;
  }
  for (const z of [-0.3, -0.89])
    block(pivot, [1, 0.014, 0.025], [0, -0.02 + z * 0.2, z], trim);

  const struts = [-0.51, 0.51].map((x) => {
    const sleeveGeometry = new THREE.CylinderGeometry(0.015, 0.018, 1, 12);
    const shaftGeometry = new THREE.CylinderGeometry(0.008, 0.008, 1, 12);
    owned.push(sleeveGeometry, shaftGeometry);
    const sleeve = new THREE.Mesh(sleeveGeometry, trim);
    const shaft = new THREE.Mesh(shaftGeometry, steel);
    compartment.add(sleeve, shaft);
    return {
      anchor: new THREE.Vector3(x, 0.615, -1.08),
      attachment: new THREE.Vector3(x, -0.12, -0.55),
      sleeve,
      shaft,
    };
  });
  const end = new THREE.Vector3(),
    direction = new THREE.Vector3(),
    centre = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  const hingeAxis = new THREE.Vector3(1, 0, 0);
  const quaternion = new THREE.Quaternion();
  function update(amount: number) {
    const angle = THREE.MathUtils.smoothstep(amount, 0, 0.9) * maximumAngle;
    pivot.rotation.x = angle;
    engine.update(amount);
    quaternion.setFromAxisAngle(hingeAxis, angle);
    struts.forEach(({ anchor, attachment, sleeve, shaft }) => {
      end.copy(attachment).applyQuaternion(quaternion).add(hinge);
      direction.subVectors(end, anchor);
      const length = direction.length();
      direction.normalize();
      sleeve.quaternion.setFromUnitVectors(up, direction);
      shaft.quaternion.copy(sleeve.quaternion);
      sleeve.scale.y = length * 0.61;
      shaft.scale.y = length * 0.47;
      sleeve.position.copy(centre.lerpVectors(anchor, end, 0.305));
      shaft.position.copy(centre.lerpVectors(anchor, end, 0.765));
    });
    return THREE.MathUtils.radToDeg(angle);
  }
  update(0);
  return {
    update,
    engine,
    dispose: () => {
      engine.dispose();
      owned.forEach((geometry) => geometry.dispose());
    },
  };
}
