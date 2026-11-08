import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export function createVintageSedan({ compact = false } = {}) {
  const root = new THREE.Group();
  root.name = 'Vintage red sedan';
  const physical = (color, roughness, metalness, clearcoat = 0) =>
    new THREE.MeshPhysicalMaterial({ color, roughness, metalness, clearcoat, clearcoatRoughness: 0.16 });
  const red = physical(0x850b15, 0.26, 0.26, 0.9);
  const wheelRed = physical(0x551019, 0.31, 0.42);
  const black = physical(0x111215, 0.29, 0.19, 0.75);
  const roof = physical(0x151416, 0.64, 0.03);
  const chrome = physical(0xd7dae0, 0.21, 0.91);
  const rubber = physical(0x202022, 0.85, 0);
  const cream = physical(0xeee6d4, 0.62, 0);
  const dark = physical(0x121013, 0.68, 0.04);
  const glass = physical(0x373f43, 0.17, 0.23, 1);
  const lamp = physical(0xeee0bd, 0.28, 0.35, 0.8);
  const headLamp = lamp.clone();
  headLamp.emissive.setHex(0xffefcf);
  headLamp.emissiveIntensity = 0;
  const rearLamp = physical(0x9c1314, 0.28, 0.26, 0.8);
  rearLamp.emissive.setHex(0xff3020);
  rearLamp.emissiveIntensity = 0;
  const doubleSidedBlack = black.clone();
  doubleSidedBlack.side = THREE.DoubleSide;
  const axes = { x: new THREE.Vector3(1, 0, 0), z: new THREE.Vector3(0, 0, 1) };

  function group(name, parent = root) {
    const result = new THREE.Group();
    result.name = name;
    parent.add(result);
    return result;
  }

  function mesh(parent, name, geometry, material, x = 0, y = 0, z = 0) {
    const part = new THREE.Mesh(geometry, material);
    part.name = name;
    part.position.set(x, y, z);
    part.castShadow = true;
    part.receiveShadow = true;
    parent.add(part);
    return part;
  }

  function ellipsoid(parent, name, material, center, radii) {
    const part = mesh(parent, name, new THREE.SphereGeometry(1, 28, 16), material, ...center);
    part.scale.set(...radii);
    return part;
  }

  function bar(parent, name, material, size, center) {
    return mesh(parent, name, new THREE.BoxGeometry(...size), material, ...center);
  }

  function disc(parent, name, material, axis, radius, depth, center, radiusBack = radius) {
    const part = mesh(parent, name, new THREE.CylinderGeometry(radius, radiusBack, depth, 40), material, ...center);
    part.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), axes[axis]);
    return part;
  }

  function pipe(parent, name, material, points, radius, closed = false) {
    const curve = new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point)), closed, 'centripetal');
    return mesh(parent, name, new THREE.TubeGeometry(curve, Math.max(12, points.length * 4), radius, 6, closed), material);
  }

  function grid(rows, columns, point) {
    const vertices = [];
    const indices = [];
    for (let row = 0; row <= rows; row++) {
      for (let column = 0; column <= columns; column++) {
        vertices.push(...point(row / rows, column / columns));
        if (row === rows || column === columns) continue;
        const a = row * (columns + 1) + column;
        const b = a + columns + 1;
        indices.push(a, b, a + 1, a + 1, b, b + 1);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  }

  // Longitudinal stations store z, lower y, upper y and half-width.
  function coachwork(parent, name, material, stations, exponent) {
    const contours = [0, 1, 2, 3].map(channel => new THREE.SplineCurve(
      stations.map((station, index) => new THREE.Vector2(index, station[channel]))
    ));
    const signedPower = (value, power) => Math.sign(value) * Math.abs(value) ** power;
    const surface = material.clone();
    surface.side = THREE.DoubleSide;
    return mesh(parent, name, grid(56, 48, (u, v) => {
      const [z, bottom, top, width] = contours.map(contour => contour.getPoint(u).y);
      const theta = v * Math.PI * 2;
      return [width * signedPower(Math.cos(theta), exponent),
        (top + bottom) / 2 + (top - bottom) / 2 * signedPower(Math.sin(theta), exponent), z];
    }), surface);
  }

  function face(parent, name, material, points) {
    const vertices = points.map(point => new THREE.Vector3(...point));
    const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
    geometry.setIndex(vertices.slice(2).flatMap((_, i) => [0, i + 1, i + 2]));
    geometry.computeVertexNormals();
    const twoSided = material.clone();
    twoSided.side = THREE.DoubleSide;
    return mesh(parent, name, geometry, twoSided);
  }

  const body = group('Coachwork');
  coachwork(body, 'Red lower body', red, [
    [-2.51, 0.82, 0.82, 0], [-2.38, 0.54, 1.31, 0.54],
    [-2.03, 0.51, 1.46, 0.73], [-1.25, 0.49, 1.50, 0.77],
    [-0.45, 0.48, 1.49, 0.75], [0.16, 0.55, 1.50, 0.68],
    [0.49, 0.69, 1.46, 0.53], [0.63, 0.84, 1.33, 0.12],
  ], 0.52);
  coachwork(body, 'Tapered bonnet', red, [
    [0.12, 0.63, 1.61, 0.64], [0.38, 0.60, 1.62, 0.62],
    [0.95, 0.60, 1.58, 0.54], [1.72, 0.63, 1.54, 0.44],
    [2.11, 0.67, 1.51, 0.39],
  ], 0.48);
  bar(body, 'Chassis', dark, [1.12, 0.16, 4.55], [0, 0.46, -0.04]);

  const cabin = group('Passenger compartment');
  const cabinShell = coachwork(cabin, 'Cabin shell', red, [
    [-2.22, 1.73, 1.73, 0], [-2.09, 1.33, 2.05, 0.56],
    [-1.78, 1.36, 2.24, 0.70], [-1.0, 1.36, 2.28, 0.71],
    [-0.38, 1.37, 2.26, 0.69], [-0.06, 1.39, 2.19, 0.65],
    [0.14, 1.43, 1.88, 0.64], [0.22, 1.45, 1.61, 0.60],
  ], 0.45);
  bar(cabin, 'Rear cabin sill', red, [0.98, 0.16, 0.41], [0, 1.38, -1.85]);
  coachwork(cabin, 'Black fabric roof', roof, [
    [-2.15, 2.04, 2.04, 0], [-2.04, 2.00, 2.12, 0.52], [-1.90, 1.96, 2.22, 0.67],
    [-1.59, 2.08, 2.31, 0.70], [-0.79, 2.11, 2.34, 0.70],
    [-0.26, 2.10, 2.29, 0.67], [-0.06, 2.14, 2.23, 0.60], [0.00, 2.19, 2.19, 0],
  ], 0.54);
  const windshield = [
    [-0.59, 1.60], [-0.64, 1.76], [-0.57, 2.11], [-0.48, 2.15],
    [0.48, 2.15], [0.57, 2.11], [0.64, 1.76], [0.59, 1.60],
  ].map(([x, y]) => [x, y, 0.265 - (y - 1.6) * 0.388]);
  face(cabin, 'Windshield', glass, windshield);
  pipe(cabin, 'Windshield surround', chrome, windshield, 0.021, true);
  for (const side of [-1, 1]) {
    const frontWindow = [
      [0.705, 1.58, -0.02], [0.688, 1.65, 0.07], [0.679, 2.05, -0.13],
      [0.685, 2.10, -0.26], [0.724, 2.08, -1.14], [0.748, 2.01, -1.23],
      [0.756, 1.60, -1.22], [0.752, 1.56, -1.13],
    ].map(([x, y, z]) => [side * x, y, z]);
    const quarterWindow = [
      [0.748, 1.57, -1.36], [0.754, 2.01, -1.34], [0.747, 2.06, -1.45],
      [0.715, 2.02, -1.80], [0.702, 1.89, -1.92], [0.688, 1.59, -1.92],
    ].map(([x, y, z]) => [side * x, y, z]);
    for (const [name, outline] of [['Door glass', frontWindow], ['Quarter glass', quarterWindow]]) {
      face(cabin, name, glass, outline);
      pipe(cabin, name + ' gasket', dark, outline, 0.021, true);
    }
    pipe(body, 'Beltline trim', black, [[0.60, 1.39, 0.47], [0.74, 1.43, 0.03],
      [0.77, 1.47, -1.15], [0.70, 1.40, -2.07]].map(([x, y, z]) => [x * side, y, z]), 0.027);
    pipe(body, 'Door panel seam', dark, [[0.751, 1.44, -1.26], [0.776, 1.01, -1.27],
      [0.696, 0.62, -1.20], [0.658, 0.61, -0.28], [0.753, 0.79, -0.12],
      [0.754, 1.44, -0.07]].map(([x, y, z]) => [x * side, y, z]), 0.009);
    ellipsoid(body, 'Door handle', chrome, [side * 0.777, 1.35, -1.13], [0.034, 0.021, 0.087]);
    pipe(body, 'Bonnet brightwork', chrome, [[0.37, 1.40, 2.11], [0.46, 1.43, 1.58],
      [0.53, 1.45, 0.83], [0.61, 1.46, 0.27]].map(([x, y, z]) => [x * side, y, z]), 0.012);
    for (let i = 0; i < 18; i++) {
      const z = 0.46 + i * 0.047;
      const x = side * (0.62 - (z - 0.46) * 0.14);
      pipe(body, 'Bonnet louver', wheelRed, [[x, 1.11, z], [x * 1.012, 1.20, z], [x, 1.30, z]], 0.009);
    }
  }

  const grille = group('Radiator grille and front brightwork');
  const arch = Array.from({ length: 19 }, (_, i) => {
    const angle = i / 18 * Math.PI;
    return [Math.cos(angle) * 0.405, 1.29 + Math.sin(angle) * 0.25, 2.156];
  });
  const surround = [[-0.32, 0.61, 2.156], [0.32, 0.61, 2.156], ...arch];
  face(grille, 'Dark radiator core', dark, surround);
  pipe(grille, 'Arched chrome surround', chrome, surround, 0.039, true);
  for (let i = -11; i <= 11; i++) {
    const x = i * 0.031;
    const top = 1.29 + 0.25 * Math.sqrt(1 - (x / 0.405) ** 2);
    pipe(grille, 'Vertical radiator bar', chrome, [[x, 0.628, 2.179], [x, top - 0.021, 2.179]], 0.0065);
  }
  ellipsoid(grille, 'Radiator mascot base', chrome, [0, 1.553, 2.145], [0.067, 0.023, 0.052]);
  pipe(grille, 'Hood ornament', chrome, [[0, 1.57, 2.145], [0.025, 1.63, 2.145],
    [0.065, 1.67, 2.145], [0.01, 1.69, 2.145], [-0.052, 1.67, 2.145],
    [-0.029, 1.64, 2.145], [0.025, 1.63, 2.145]], 0.009);
  pipe(grille, 'Headlight tie bar', chrome, [[-0.83, 0.99, 2.025], [-0.47, 1.01, 2.19],
    [0, 1.02, 2.22], [0.47, 1.01, 2.19], [0.83, 0.99, 2.025]], 0.019);

  function light(name, x, y, z, radius, lens) {
    ellipsoid(grille, name + ' housing', black, [x, y, z - 0.079], [radius, radius, radius * 0.69]);
    disc(grille, name + ' chrome rim', chrome, 'z', radius, 0.068, [x, y, z]);
    ellipsoid(grille, name + ' lens', lens, [x, y, z + 0.036], [radius * 0.91, radius * 0.91, radius * 0.20]);
    for (let stripe = -5; stripe <= 5; stripe++) {
      const offset = stripe * radius / 7;
      const half = Math.sqrt((0.88 * radius) ** 2 - offset ** 2);
      pipe(grille, name + ' lens flute', cream, [[x + offset, y - half, z + 0.048],
        [x + offset, y, z + 0.038 + Math.sqrt((0.91 * radius) ** 2 - offset ** 2) * 0.21],
        [x + offset, y + half, z + 0.048]], 0.0025);
    }
  }
  for (const side of [-1, 1]) {
    pipe(grille, 'Lamp mounting pedestal', black, [[side * 0.78, 0.87, 1.96],
      [side * 0.75, 1.21, 2.04]], 0.045);
    light('Headlamp', side * 0.76, 1.29, 2.10, 0.236, headLamp);
    light('Auxiliary lamp', side * 0.51, 0.75, 2.18, 0.112, lamp);
  }
  const bumper = group('Bumpers');
  for (const z of [-2.53, 2.53]) {
    for (const y of [0.42, 0.50]) {
      const end = z - Math.sign(z) * 0.12;
      pipe(bumper, 'Bumper blade', chrome, [[-1.03, y, end], [-0.77, y, z], [0, y, z + Math.sign(z) * 0.04],
        [0.77, y, z], [1.03, y, end]], 0.031);
    }
    for (const x of [-0.52, 0.52]) {
      ellipsoid(bumper, 'Bumper guard', chrome, [x, 0.46, z + Math.sign(z) * 0.062], [0.034, 0.135, 0.035]);
    }
  }

  const wheels = group('Wheels and side-mounted spare');
  const roadWheels = [];
  const roadWheelRadius = 0.538;
  function wheel(name, side, x, y, z, radius, width) {
    const assembly = group(name, wheels);
    assembly.position.set(x, y, z);
    const profile = [[0.58, -0.45], [0.86, -0.52], [0.96, -0.40], [1, -0.22],
      [1, 0.22], [0.96, 0.40], [0.86, 0.52], [0.58, 0.45], [0.58, -0.45]]
      .map(([r, depth]) => new THREE.Vector2(r * radius, depth * width));
    const tire = mesh(assembly, 'Rounded rubber tire', new THREE.LatheGeometry(profile, 56), rubber);
    tire.rotation.z = -Math.PI / 2;
    const whitewall = new THREE.RingGeometry(radius * 0.67, radius * 0.915, 56);
    const ring = mesh(assembly, 'Ivory whitewall', whitewall, cream, side * width * 0.525);
    ring.rotation.y = side * Math.PI / 2;
    for (const offset of [-0.26, 0, 0.26]) {
      const tread = mesh(assembly, 'Circumferential tread groove',
        new THREE.TorusGeometry(radius * (offset === 0 ? 0.997 : 0.99), 0.004, 5, 56), dark, offset * width);
      tread.rotation.y = Math.PI / 2;
    }
    const rim = mesh(assembly, 'Chrome rim lip', new THREE.TorusGeometry(radius * 0.665, 0.013, 8, 56),
      chrome, side * width * 0.54);
    rim.rotation.y = Math.PI / 2;
    disc(assembly, 'Enamel wheel barrel', wheelRed, 'x', radius * 0.652, width * 0.61, [0, 0, 0]);
    const wires = [];
    for (let i = 0; i < 40; i++) {
      const angle = i / 40 * Math.PI * 2;
      const inner = angle + (i % 2 === 0 ? 0.40 : -0.40);
      wires.push(side * width * 0.54, Math.cos(angle) * radius * 0.645, Math.sin(angle) * radius * 0.645,
        side * width * 0.71, Math.cos(inner) * radius * 0.17, Math.sin(inner) * radius * 0.17);
    }
    const spokes = new THREE.BufferGeometry();
    spokes.setAttribute('position', new THREE.Float32BufferAttribute(wires, 3));
    const wireMesh = new THREE.LineSegments(spokes, new THREE.LineBasicMaterial({ color: 0xb5a3a0 }));
    wireMesh.name = 'Crossed wire spokes';
    assembly.add(wireMesh);
    disc(assembly, 'Polished hub flange', chrome, 'x', radius * 0.237, 0.045, [side * width * 0.66, 0, 0]);
    ellipsoid(assembly, 'Domed hubcap', chrome, [side * width * 0.78, 0, 0], [0.034, radius * 0.20, radius * 0.20]);
    return assembly;
  }

  const fenders = group('Fenders and running boards');
  function fender(side, z, front) {
    const geometry = grid(52, 12, (u, v) => {
      const theta = -0.19 + u * 3.55;
      const shoulder = Math.sin(Math.PI * v);
      const radius = 0.655 + 0.060 * shoulder - 0.035 * v;
      const taper = 0.78 + 0.22 * Math.sin(Math.PI * u);
      return [side * (0.805 + (v - 0.5) * 0.49 * taper),
        0.538 + Math.sin(theta) * radius,
        z + Math.cos(theta) * radius * (front ? 1.38 : 1.14) -
          (front ? Math.max(0, u - 0.69) * 0.34 : 0)];
    });
    mesh(fenders, front ? 'Swept front fender' : 'Rear fender arch', geometry, doubleSidedBlack);
  }
  for (const side of [-1, 1]) {
    roadWheels.push(
      wheel('Front road wheel', side, side * 0.82, roadWheelRadius, 1.56, roadWheelRadius, 0.25),
      wheel('Rear road wheel', side, side * 0.82, roadWheelRadius, -1.63, roadWheelRadius, 0.25)
    );
    fender(side, 1.56, true);
    fender(side, -1.63, false);
    bar(fenders, 'Running board', black, [0.31, 0.075, 1.78], [side * 0.81, 0.49, -0.12]);
    pipe(fenders, 'Running board bright edge', chrome, [[side * 0.94, 0.54, -1.06],
      [side * 0.975, 0.50, -0.85], [side * 0.975, 0.50, 0.59], [side * 0.94, 0.55, 0.76]], 0.017);
    for (let i = 0; i < 7; i++) {
      bar(fenders, 'Tread strip', rubber, [0.011, 0.012, 1.61], [side * (0.69 + i * 0.034), 0.532, -0.13]);
    }
    disc(body, 'Tail lamp bezel', chrome, 'z', 0.075, 0.075, [side * 0.86, 0.79, -2.35]);
    disc(body, 'Tail lamp lens', rearLamp, 'z', 0.058, 0.018, [side * 0.86, 0.79, -2.393]);
  }
  const spare = wheel('Side-mounted spare', 1, 0.717, 0.99, 0.58, 0.454, 0.21);
  spare.rotation.z = -0.13;
  pipe(body, 'Mirror stalk', chrome, [[0.64, 1.34, 0.47], [0.83, 1.52, 0.47]], 0.015);
  disc(body, 'Side mirror housing', chrome, 'z', 0.09, 0.04, [0.84, 1.55, 0.47]);
  const rearRay = new THREE.Raycaster();
  function rearWindowPoint(u, v) {
    const y = 1.66 + v * 0.26;
    const halfWidth = 0.38 + 0.025 * Math.sin(v * Math.PI);
    const x = (2 * u - 1) * halfWidth;
    rearRay.set(new THREE.Vector3(x, y, -3), axes.z);
    const [surface] = rearRay.intersectObject(cabinShell, false);
    return [x, y, surface.point.z - 0.018];
  }
  const rearGlass = glass.clone();
  rearGlass.side = THREE.DoubleSide;
  mesh(cabin, 'Curved rear window', grid(24, 16, rearWindowPoint), rearGlass);
  const windowBorder = [];
  for (let i = 0; i < 10; i++) windowBorder.push(rearWindowPoint(i / 10, 0));
  for (let i = 0; i < 10; i++) windowBorder.push(rearWindowPoint(1, i / 10));
  for (let i = 0; i < 10; i++) windowBorder.push(rearWindowPoint(1 - i / 10, 1));
  for (let i = 0; i < 10; i++) windowBorder.push(rearWindowPoint(0, 1 - i / 10));
  pipe(cabin, 'Rear window gasket', dark, windowBorder, 0.015, true);
  root.userData.rollWheels = distance => {
    const angle = distance / (roadWheelRadius * root.scale.x);
    for (const wheel of roadWheels) {
      wheel.rotation.x = (wheel.rotation.x + angle) % (Math.PI * 2);
    }
  };
  root.userData.headlightMaterial = headLamp;
  root.userData.taillightMaterial = rearLamp;
  if (compact) batchCarMeshes(root, [...roadWheels, spare]);
  return root;
}

// Keep each wheel pivot, but submit one mesh per material within each pivot and the body.
function batchCarMeshes(root, wheelPivots) {
  root.updateMatrixWorld(true);
  const batches = new Map([root, ...wheelPivots].map(pivot => [pivot, new Map()]));
  const originals = [];
  root.traverse(part => {
    if (!part.isMesh) return;
    const pivot = batches.has(part.parent) ? part.parent : root;
    const byMaterial = batches.get(pivot);
    if (!byMaterial.has(part.material)) byMaterial.set(part.material, []);
    const geometry = part.geometry.clone();
    geometry.deleteAttribute('uv');
    geometry.applyMatrix4(pivot.matrixWorld.clone().invert().multiply(part.matrixWorld));
    byMaterial.get(part.material).push(geometry);
    originals.push(part);
  });
  for (const part of originals) {
    part.removeFromParent();
    part.geometry.dispose();
  }
  for (const [pivot, byMaterial] of batches) {
    for (const [material, geometries] of byMaterial) {
      const combined = new THREE.Mesh(mergeGeometries(geometries), material);
      combined.castShadow = combined.receiveShadow = true;
      pivot.add(combined);
      for (const geometry of geometries) geometry.dispose();
    }
  }
}
