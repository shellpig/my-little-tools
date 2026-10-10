import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { HorizontalTiltShiftShader } from 'three/addons/shaders/HorizontalTiltShiftShader.js';
import { VerticalTiltShiftShader } from 'three/addons/shaders/VerticalTiltShiftShader.js';

// Kenney models are built on a 1-unit grid: one road tile is 1 × 1.
const ASSETS = 'assets';
const PALETTE = {
  commercial: 'commercial/Models/Textures/variation-a.png',
  suburban: 'suburban/Models/Textures/variation-a.png',
  roads: 'roads/Models/Textures/variation-a.png',
};
const PEOPLE = ['male-a', 'male-b', 'male-c', 'male-d', 'male-e', 'male-f',
  'female-a', 'female-b', 'female-c', 'female-d', 'female-e', 'female-f'].map(n => `character-${n}`);
const PERSON_SCALE = 0.32;
const WALKERS = 26;
const STROLLERS = 7;
const STREET_HALF = 9;

let seed = 11;
const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

// ---------- renderer, scene, camera ----------

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.prepend(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x0b1020, 14, 40);

const camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 0.1, 200);
camera.position.set(7, 7.5, 12.5);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.2, 1.4);
controls.enableDamping = true;
controls.maxPolarAngle = 1.32;
controls.minDistance = 3;
controls.maxDistance = 25;

const sun = new THREE.DirectionalLight(0xffffff, 2);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 1, far: 70 });
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.01;
scene.add(sun, sun.target);

const hemi = new THREE.HemisphereLight(0xcfe2ff, 0x4a4234, 1);
scene.add(hemi);

// ---------- post-processing: bloom for lit windows, tilt-shift for the miniature look ----------

const target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
const composer = new EffectComposer(renderer, target);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.6, 0.5, 0.82);
composer.addPass(bloom);
const tiltH = new ShaderPass(HorizontalTiltShiftShader);
const tiltV = new ShaderPass(VerticalTiltShiftShader);
tiltH.uniforms.r.value = tiltV.uniforms.r.value = 0.5;
composer.addPass(tiltH);
composer.addPass(tiltV);
composer.addPass(new OutputPass());

function resize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
  tiltH.uniforms.h.value = 2.5 / innerWidth;
  tiltV.uniforms.v.value = 2.5 / innerHeight;
}
addEventListener('resize', resize);
resize();

// ---------- materials ----------

// [material, emissive intensity at full night]
const glowing = [];
const lamps = [];

const std = (color, opts = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.9, ...opts });

function box(w, h, d, mat, x, y, z, cast = false) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = cast;
  m.receiveShadow = true;
  scene.add(m);
  return m;
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

// The packs ship only alternate "variation" palettes (orange walls, pink
// curbs). Repaint the swatches the models actually sample, as
// [x, y, w, h, top colour, bottom colour] in palette pixels.
const REPAINT = {
  commercial: [
    [224, 256, 32, 128, '#f4f1ea', '#d6d1c8'], // walls
  ],
  suburban: [],
  roads: [
    [0, 384, 64, 128, '#cfccc6', '#b8b4ad'], // curbs and road edges
  ],
};

function repaint(ctx, pack) {
  for (const [x, y, w, h, top, bottom] of REPAINT[pack]) {
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, top);
    g.addColorStop(1, bottom);
    ctx.fillStyle = g;
    ctx.fillRect(x, y, w, h);
  }
}

// Window glass in the Kenney palettes is the light-blue swatch family.
const isWindow = (r, g, b) => b > r + 40 && b > g && g > r && (r + g + b) / 3 > 110;

// Each pack shares one palette texture. Load it once and derive a mask of the
// window swatches, so lighting windows at night is one emissive map.
async function palette(pack) {
  const img = await loadImage(`${ASSETS}/${PALETTE[pack]}`);
  const src = document.createElement('canvas');
  src.width = img.width;
  src.height = img.height;
  const ctx = src.getContext('2d');
  ctx.drawImage(img, 0, 0);
  repaint(ctx, pack);
  const pixels = ctx.getImageData(0, 0, src.width, src.height).data;

  const mask = document.createElement('canvas');
  mask.width = src.width;
  mask.height = src.height;
  const mctx = mask.getContext('2d');
  const out = mctx.createImageData(src.width, src.height);
  for (let i = 0; i < pixels.length; i += 4) {
    if (isWindow(pixels[i], pixels[i + 1], pixels[i + 2])) out.data.set([255, 190, 115], i);
    out.data[i + 3] = 255;
  }
  mctx.putImageData(out, 0, 0);

  return { map: paletteTexture(src), emissiveMap: paletteTexture(mask) };
}

function paletteTexture(canvas) {
  const t = new THREE.CanvasTexture(canvas);
  t.flipY = false;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// An emissive map that lights a single palette swatch, for models whose
// windows are not drawn with the light-blue glass swatches.
function swatchMask(x, y, w, h) {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 512, 512);
  ctx.fillStyle = '#ffbe73';
  ctx.fillRect(x, y, w, h);
  return paletteTexture(c);
}

function paletteMaterial(textures, nightGlow) {
  const mat = new THREE.MeshStandardMaterial({ ...textures, emissive: 0xffffff, emissiveIntensity: 0, roughness: 0.8 });
  glowing.push([mat, nightGlow]);
  return mat;
}

// ---------- model loading ----------

// Building, road and suburban GLBs point at Textures/colormap.png, which the
// packs ship as Models/Textures/variation-*.png. Their materials are replaced
// after loading, so answer that request with a blank pixel instead of a 404.
const BLANK = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
const manager = new THREE.LoadingManager();
manager.setURLModifier(url =>
  url.endsWith('Textures/colormap.png') && !url.includes('mini-characters') ? BLANK : url);
const loader = new GLTFLoader(manager);
const cache = new Map();

function model(pack, name) {
  const url = `${ASSETS}/${pack}/Models/GLB format/${name}.glb`;
  if (!cache.has(url)) cache.set(url, loader.loadAsync(url));
  return cache.get(url);
}

async function place(pack, name, { x = 0, y = 0, z = 0, rot = 0, scale = 1, mat } = {}) {
  const gltf = await model(pack, name);
  const obj = gltf.scene.clone(true);
  obj.traverse(o => {
    if (!o.isMesh) return;
    o.castShadow = true;
    o.receiveShadow = true;
    if (mat) o.material = mat;
  });
  obj.position.set(x, y, z);
  obj.rotation.y = rot;
  obj.scale.setScalar(scale);
  scene.add(obj);
  return obj;
}

// ---------- shops ----------

const SHOPS = [
  { model: 'building-c', x: -1.05, name: '晨光咖啡', bg: '#3b2a20', fg: '#ffdca8', awning: 0xb8433a },
  { model: 'building-a', x: 0, name: '小巷書店', bg: '#1f3b3a', fg: '#f3ead2', awning: 0x2f6b4f },
  { model: 'building-h', x: 1.05, name: '便利商店', bg: '#f7f7f4', fg: '#1d6fd6', awning: 0x2c6fc4 },
];

function signTexture(text, bg, fg) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 128;
  const ctx = c.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = fg;
  ctx.font = '900 88px "Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, 68);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

async function decorateShop(building, shop) {
  const bounds = new THREE.Box3().setFromObject(building);
  const front = bounds.max.z;
  const width = bounds.max.x - bounds.min.x;
  addAwning(shop.x, front, width * 0.82, shop.awning);

  const tex = signTexture(shop.name, shop.bg, shop.fg);
  const signMat = new THREE.MeshStandardMaterial({ map: tex, emissive: 0xffffff, emissiveMap: tex, roughness: 0.6 });
  glowing.push([signMat, 0.45]);
  box(width * 0.72, width * 0.17, 0.02, signMat, shop.x, 0.45, front + 0.012);
}

// A striped cloth awning: a sloped canopy plus a short vertical valance.
const AWNING_Y = 0.36;
const AWNING_DEPTH = 0.17;
const AWNING_TILT = 0.42;

function addAwning(x, front, width, color) {
  const cloth = [std(color, { roughness: 0.75 }), std(0xf1ebe0, { roughness: 0.75 })];
  const canopy = new THREE.Group();
  const valance = new THREE.Group();
  const stripes = 7;
  const sw = width / stripes;
  for (let i = 0; i < stripes; i++) {
    const sx = -width / 2 + (i + 0.5) * sw;
    const top = new THREE.Mesh(new THREE.BoxGeometry(sw, 0.008, AWNING_DEPTH), cloth[i % 2]);
    top.position.set(sx, 0, AWNING_DEPTH / 2);
    const flap = new THREE.Mesh(new THREE.BoxGeometry(sw, 0.035, 0.006), cloth[i % 2]);
    flap.position.set(sx, -0.0175, 0);
    for (const m of [top, flap]) m.castShadow = m.receiveShadow = true;
    canopy.add(top);
    valance.add(flap);
  }
  canopy.position.set(x, AWNING_Y, front);
  canopy.rotation.x = AWNING_TILT;
  valance.position.set(x, AWNING_Y - AWNING_DEPTH * Math.sin(AWNING_TILT), front + AWNING_DEPTH * Math.cos(AWNING_TILT));
  scene.add(canopy, valance);
}

// ---------- park ----------

// A fenced lawn south of the street: an entrance path leads to a ring path
// around a fountain, with cross paths out to the side gates.
const PARK = { cz: 4.2, ring: 1.45, xHalf: 4.6, zMin: 1.65, zMax: 7.2, path: 0.34 };

// Benches sit outside the ring on the diagonals, facing the fountain.
const BENCH_RADIUS = PARK.ring + 0.33;
const benchSeats = [45, 135, 225, 315].flatMap(deg => {
  const a = THREE.MathUtils.degToRad(deg);
  const rotation = Math.atan2(-Math.cos(a), -Math.sin(a));
  const x = Math.cos(a) * BENCH_RADIUS;
  const z = PARK.cz + Math.sin(a) * BENCH_RADIUS;
  // Two seats per bench, side by side along the bench.
  return [-0.07, 0.07].map(offset => ({
    bench: { x, z, rotation },
    position: new THREE.Vector3(x + Math.cos(rotation) * offset + Math.sin(rotation) * 0.02, 0.035,
      z - Math.sin(rotation) * offset + Math.cos(rotation) * 0.02),
    rotation,
  }));
});

function cylinder(rTop, rBottom, h, mat, x, y, z, segments = 24) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBottom, h, segments), mat);
  m.position.set(x, y, z);
  m.castShadow = m.receiveShadow = true;
  scene.add(m);
  return m;
}

function bench(x, z, rotation) {
  const wood = std(0x8a5a3a, { roughness: 0.8 });
  const iron = std(0x2c2f35, { roughness: 0.5, metalness: 0.5 });
  const g = new THREE.Group();
  const part = (w, h, d, mat, px, py, pz) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(px, py, pz);
    m.castShadow = m.receiveShadow = true;
    g.add(m);
  };
  part(0.32, 0.014, 0.085, wood, 0, 0.07, 0);
  part(0.32, 0.05, 0.012, wood, 0, 0.115, -0.042);
  for (const sx of [-0.13, 0.13]) part(0.014, 0.075, 0.085, iron, sx, 0.037, 0);
  g.position.set(x, 0.02, z);
  g.rotation.y = rotation;
  scene.add(g);
}

function parkLamp(x, z, bulbMat) {
  const iron = std(0x2c2f35, { roughness: 0.5, metalness: 0.5 });
  cylinder(0.012, 0.016, 0.34, iron, x, 0.19, z, 8);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), bulbMat);
  head.position.set(x, 0.37, z);
  scene.add(head);
  const light = new THREE.PointLight(0xffc98a, 0, 1.8, 1.6);
  light.position.set(x, 0.34, z);
  scene.add(light);
  lamps.push(light);
}

function insidePark(x, z, margin = 0) {
  return Math.abs(x) < PARK.xHalf + margin && z > PARK.zMin - margin && z < PARK.zMax + margin;
}

function onPath(x, z) {
  const r = Math.hypot(x, z - PARK.cz);
  return r < PARK.ring + 0.5 // fountain, ring and benches
    || (Math.abs(x) < 0.45 && z < PARK.cz) // entrance path
    || (Math.abs(z - PARK.cz) < 0.4); // cross paths
}

function buildPark(jobs, plantMat) {
  const { cz, ring, xHalf, zMin, zMax, path } = PARK;
  const lawn = std(0x74924f);
  const gravel = std(0xcdbf9f, { roughness: 1 });
  const stone = std(0xb9b2a6, { roughness: 0.85 });

  box(xHalf * 2, 0.02, zMax - zMin, lawn, 0, 0.01, (zMin + zMax) / 2);

  const ringPath = new THREE.Mesh(new THREE.RingGeometry(ring - path / 2, ring + path / 2, 64), gravel);
  ringPath.rotation.x = -Math.PI / 2;
  ringPath.position.set(0, 0.022, cz);
  ringPath.receiveShadow = true;
  scene.add(ringPath);
  const entrance = cz - ring - 1.3;
  box(path, 0.012, entrance, gravel, 0, 0.022, 1.3 + entrance / 2);
  for (const side of [-1, 1]) box(xHalf - ring, 0.012, path, gravel, side * (ring + xHalf) / 2, 0.022, cz);

  // Fountain: stone basin, water with underwater lights, a two-tier pedestal.
  const water = std(0x3f7fa8, { roughness: 0.1, metalness: 0.2, emissive: 0x5fb8ff, emissiveIntensity: 0 });
  glowing.push([water, 0.5]);
  cylinder(0.56, 0.6, 0.09, stone, 0, 0.045, cz, 32);
  cylinder(0.5, 0.5, 0.012, water, 0, 0.085, cz, 32);
  cylinder(0.06, 0.08, 0.22, stone, 0, 0.17, cz, 12);
  cylinder(0.2, 0.11, 0.05, stone, 0, 0.29, cz, 20);
  cylinder(0.17, 0.17, 0.008, water, 0, 0.312, cz, 20);
  cylinder(0.025, 0.04, 0.1, water, 0, 0.36, cz, 10);

  for (let i = 0; i < benchSeats.length; i += 2) {
    const { x, z, rotation } = benchSeats[i].bench;
    bench(x, z, rotation);
  }

  const bulbMat = std(0x222222, { emissive: 0xffe0b0, emissiveIntensity: 0 });
  glowing.push([bulbMat, 3]);
  parkLamp(-0.32, zMin + 0.15, bulbMat);
  parkLamp(0.32, zMin + 0.15, bulbMat);
  parkLamp(-(ring + 0.3), cz + 0.3, bulbMat);
  parkLamp(ring + 0.3, cz - 0.3, bulbMat);
  parkLamp(0.3, cz + ring + 0.3, bulbMat);

  // Flowers in a ring between the fountain and the path.
  const flowerColors = [0xf28bb0, 0xf6d55c, 0xfaf3e6, 0xe2574c, 0xb58be0].map(c => new THREE.Color(c));
  const flowers = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.03, 0), std(0xffffff, { roughness: 0.7 }), 90);
  const m4 = new THREE.Matrix4();
  for (let i = 0; i < flowers.count; i++) {
    const a = rand() * Math.PI * 2;
    const r = 0.8 + rand() * 0.3;
    m4.makeTranslation(Math.cos(a) * r, 0.04 + rand() * 0.02, cz + Math.sin(a) * r);
    flowers.setMatrixAt(i, m4);
    flowers.setColorAt(i, flowerColors[Math.floor(rand() * flowerColors.length)]);
  }
  flowers.castShadow = true;
  scene.add(flowers);

  // Fence round the lawn, with gaps for the entrance and the side gates.
  const fenceMat = std(0xefebe2, { roughness: 0.8 });
  for (let x = -xHalf + 0.24; x < xHalf; x += 0.48) {
    if (Math.abs(x) > 0.4) jobs.push(place('suburban', 'fence', { x, z: zMin, mat: fenceMat }));
    jobs.push(place('suburban', 'fence', { x, z: zMax, mat: fenceMat }));
  }
  for (let z = zMin + 0.24; z < zMax; z += 0.48) {
    if (Math.abs(z - cz) < 0.3) continue;
    for (const side of [-1, 1]) jobs.push(place('suburban', 'fence', { x: side * xHalf, z, rot: Math.PI / 2, mat: fenceMat }));
  }
  for (const x of [-0.62, 0.62]) jobs.push(place('suburban', 'planter', { x, z: zMin - 0.12, mat: plantMat }));

  // Trees: dense inside the park away from the paths, sparser outside it.
  const tree = (x, z) => jobs.push(place('suburban', rand() < 0.5 ? 'tree-large' : 'tree-small',
    { x, z, rot: rand() * 6, scale: 1 + rand() * 0.5, mat: plantMat }));
  for (let placed = 0; placed < 26;) {
    const x = (rand() * 2 - 1) * (xHalf - 0.25);
    const z = zMin + 0.25 + rand() * (zMax - zMin - 0.5);
    if (onPath(x, z)) continue;
    tree(x, z);
    placed++;
  }
  for (let placed = 0; placed < 18;) {
    const x = -10 + rand() * 20;
    const z = 1.8 + rand() * 7;
    if (insidePark(x, z, 0.3)) continue;
    tree(x, z);
    placed++;
  }
}

// ---------- town layout ----------

async function buildTown() {
  const [commercial, suburban, roads] = await Promise.all(['commercial', 'suburban', 'roads'].map(palette));
  // Three window brightnesses so the buildings are not lit identically.
  const shopMats = [paletteMaterial(commercial, 2.2), paletteMaterial(commercial, 1.4), paletteMaterial(commercial, 0.7)];
  const houseMat = paletteMaterial(suburban, 1.2);
  const roadMat = paletteMaterial(roads, 0);
  // Skyline towers draw their window bands with the grey-blue swatch.
  const towerWindows = { map: commercial.map, emissiveMap: swatchMask(32, 256, 32, 128) };
  const towerMats = [paletteMaterial(towerWindows, 0.9), paletteMaterial(towerWindows, 0.55), paletteMaterial(towerWindows, 0.3)];

  // Ground, sidewalks and curbs.
  box(120, 0.1, 120, std(0x667a52), 0, -0.05, 0);
  const pavement = std(0xb3ada3);
  const curb = std(0xd2ccc0);
  for (const side of [-1, 1]) {
    box(60, 0.05, 0.8, pavement, 0, 0.025, side * 0.9);
    box(60, 0.06, 0.06, curb, 0, 0.03, side * 0.53);
  }

  const jobs = [];
  for (let x = -20; x <= 20; x++) jobs.push(place('roads', 'road-straight', { x, mat: roadMat }));

  // The three shops facing the street, each with an awning and a sign.
  SHOPS.forEach((shop, i) => jobs.push(
    place('commercial', shop.model, { x: shop.x, z: -1.85, mat: shopMats[i] })
      .then(obj => decorateShop(obj, shop))));

  // Neighbours along the street, then a skyline behind.
  const neighbours = ['building-b', 'building-d', 'building-e', 'building-f', 'building-g', 'building-i', 'building-j', 'building-k'];
  [-2.3, -3.6, 2.3, 3.6, -5.0, 5.0].forEach((x, i) =>
    jobs.push(place('commercial', neighbours[i % neighbours.length], { x, z: -1.9, mat: shopMats[(i + 1) % 3] })));
  for (let i = 0; i < 18; i++) {
    const name = `low-detail-building-${'abcdefghijklmn'[Math.floor(rand() * 14)]}`;
    jobs.push(place('commercial', name, {
      x: -9 + rand() * 18, z: -4 - rand() * 5, rot: Math.floor(rand() * 4) * Math.PI / 2,
      scale: 0.55 + rand() * 0.35, mat: towerMats[Math.floor(rand() * 3)],
    }));
  }

  // Across the street: the park.
  buildPark(jobs, houseMat);

  // Street lamps, with a real light under each head.
  const bulbMat = std(0x222222, { emissive: 0xffd9a0, emissiveIntensity: 0 });
  glowing.push([bulbMat, 6]);
  for (const [x, side] of [[-4, -1], [-0.5, -1], [3, -1], [-2.3, 1], [1.3, 1], [4.8, 1]]) {
    const z = side * 0.62;
    jobs.push(place('roads', 'light-square', { x, z, rot: side < 0 ? Math.PI : 0, mat: roadMat }));
    const head = new THREE.Vector3(x, 0.57, z - side * 0.19);
    box(0.06, 0.015, 0.06, bulbMat, head.x, head.y, head.z);
    const light = new THREE.PointLight(0xffbe7a, 0, 3.2, 1.6);
    light.position.copy(head).y -= 0.04;
    scene.add(light);
    lamps.push(light);
  }

  await Promise.all(jobs);
}

// ---------- pedestrians ----------

const walkers = [];

// `rank` in [0, 1) decides when a person is out: they show while it is below
// the current activity level, so the town empties gradually at night.
class Person {
  constructor(gltf, rank) {
    this.gltf = gltf;
    this.obj = SkeletonUtils.clone(gltf.scene);
    this.obj.scale.setScalar(PERSON_SCALE);
    this.obj.traverse(o => { if (o.isMesh) o.castShadow = true; });
    this.mixer = new THREE.AnimationMixer(this.obj);
    this.rank = rank;
    scene.add(this.obj);
  }

  action(name) { return this.mixer.clipAction(THREE.AnimationClip.findByName(this.gltf.animations, name)); }

  face(angle) { this.obj.rotation.y = angle; }

  startWalking(speed) {
    this.speed = speed;
    this.walk = this.action('walk');
    this.walk.timeScale = speed / 0.38;
    this.walk.play();
    this.walk.time = rand() * this.walk.getClip().duration;
  }
}

class Walker extends Person {
  constructor(gltf, rank) {
    super(gltf, rank);
    this.startWalking(0.32 + rand() * 0.12);
    this.idle = this.action('idle');
    this.pause = 0;
    this.spawn(-STREET_HALF + rand() * STREET_HALF * 2);
  }

  spawn(x) {
    this.side = rand() < 0.5 ? -1 : 1;
    this.dir = rand() < 0.5 ? 1 : -1;
    // Keep the two walking directions in separate lanes so people rarely overlap.
    const inner = this.dir * this.side > 0;
    this.z = this.side * (inner ? 0.68 + rand() * 0.12 : 0.95 + rand() * 0.18);
    this.x = x;
    this.face(this.dir * Math.PI / 2);
  }

  update(dt, activity) {
    this.mixer.update(dt);
    if (this.pause > 0) {
      this.pause -= dt;
      if (this.pause <= 0) {
        this.idle.fadeOut(0.3);
        this.walk.reset().fadeIn(0.3).play();
        this.face(this.dir * Math.PI / 2);
      }
      return;
    }
    this.x += this.dir * this.speed * dt;
    if (Math.abs(this.x) > STREET_HALF) {
      this.spawn(-Math.sign(this.x) * STREET_HALF);
      this.obj.visible = this.rank < activity;
    } else if (this.side < 0 && Math.abs(this.x) < 1.6 && Math.random() < dt * 0.08) {
      // Window shopping in front of the three shops.
      this.pause = 2 + Math.random() * 4;
      this.walk.fadeOut(0.3);
      this.idle.reset().fadeIn(0.3).play();
      this.face(Math.PI);
    }
    this.obj.position.set(this.x, 0.05, this.z);
  }
}

// Walks laps around the park's ring path.
class Stroller extends Person {
  constructor(gltf, rank) {
    super(gltf, rank);
    this.startWalking(0.2 + rand() * 0.1);
    this.dir = rand() < 0.5 ? 1 : -1;
    this.radius = PARK.ring + (rand() - 0.5) * 0.14;
    this.angle = rand() * Math.PI * 2;
  }

  update(dt, activity) {
    this.mixer.update(dt);
    const lap = Math.floor(this.angle / (Math.PI * 2));
    this.angle += this.dir * this.speed / this.radius * dt;
    if (Math.floor(this.angle / (Math.PI * 2)) !== lap) this.obj.visible = this.rank < activity;
    const c = Math.cos(this.angle);
    const s = Math.sin(this.angle);
    this.obj.position.set(c * this.radius, 0.03, PARK.cz + s * this.radius);
    this.face(Math.atan2(-s * this.dir, c * this.dir));
  }
}

// Sits on a park bench.
class Sitter extends Person {
  constructor(gltf, rank, seat) {
    super(gltf, rank);
    this.action('sit').play();
    this.obj.position.copy(seat.position);
    this.face(seat.rotation);
  }

  update(dt, activity) {
    this.mixer.update(dt);
    this.obj.visible = this.rank < activity;
  }
}

async function addPeople() {
  const gltfs = await Promise.all(PEOPLE.map(n => model('mini-characters', n)));
  const pick = i => gltfs[i % gltfs.length];
  for (let i = 0; i < WALKERS; i++) walkers.push(new Walker(pick(i), i / WALKERS));
  for (let i = 0; i < STROLLERS; i++) walkers.push(new Stroller(pick(i + 5), i / STROLLERS));
  // Only some benches are taken, and people sit mostly in the daytime.
  benchSeats.filter((_, i) => i % 3 !== 2).forEach((seat, i) =>
    walkers.push(new Sitter(pick(i + 9), 0.3 + i * 0.12, seat)));
  for (const w of walkers) w.obj.visible = w.rank < activity(time);
}

// ---------- time of day ----------

let time = +(new URLSearchParams(location.search).get('t') ?? 21);
let speed = 60;
let lastSpeed = 60;

const smooth = THREE.MathUtils.smoothstep;
const SKY_NIGHT = new THREE.Color(0x0b1020);
const SKY_DAY = new THREE.Color(0x9fc6ea);
const SKY_DUSK = new THREE.Color(0xe98a5c);
const SUN_LOW = new THREE.Color(0xffa060);
const SUN_HIGH = new THREE.Color(0xfff2de);
const MOON = new THREE.Color(0x9bb4ff);
const sky = new THREE.Color();
const lightDir = new THREE.Vector3();

// Share of pedestrians out on the street: busy in the afternoon, few at night.
const activity = t => 0.18 + 0.82 * Math.max(0, Math.sin(Math.PI * (t - 6) / 18));

function applyTime(t) {
  const angle = (t - 6) / 12 * Math.PI;
  const elevation = Math.sin(angle);
  const day = smooth(elevation, -0.12, 0.22);
  const night = 1 - day;
  const dusk = Math.exp(-((elevation / 0.18) ** 2));

  // The same light is the sun by day and the moon by night.
  if (elevation >= 0) {
    lightDir.set(Math.cos(angle), Math.max(elevation, 0.12), 0.6);
    sun.intensity = 3 * smooth(elevation, -0.05, 0.3);
    sun.color.lerpColors(SUN_LOW, SUN_HIGH, smooth(elevation, 0, 0.45));
  } else {
    lightDir.set(-Math.cos(angle), Math.max(-elevation, 0.12), 0.6);
    sun.intensity = 0.45 * smooth(-elevation, 0, 0.3);
    sun.color.copy(MOON);
  }
  sun.position.copy(lightDir.normalize().multiplyScalar(30));

  hemi.intensity = 0.3 + 0.7 * day;
  hemi.color.setHex(0x3c4a7a).lerp(new THREE.Color(0xcfe2ff), day);
  hemi.groundColor.setHex(0x12121a).lerp(new THREE.Color(0x4a4234), day);

  sky.copy(SKY_NIGHT).lerp(SKY_DAY, day).lerp(SKY_DUSK, dusk * 0.55);
  scene.background = sky;
  scene.fog.color.copy(sky);

  for (const [mat, glow] of glowing) mat.emissiveIntensity = glow * night;
  for (const l of lamps) l.intensity = 2.2 * night;
  bloom.strength = 0.2 + 0.6 * night;
}

// ---------- UI ----------

const $ = id => document.getElementById(id);
const slider = $('time');
let dragging = false;
slider.addEventListener('pointerdown', () => { dragging = true; });
addEventListener('pointerup', () => { dragging = false; });
slider.addEventListener('input', () => { time = +slider.value; });

function setSpeed(s) {
  if (s) lastSpeed = s;
  speed = s;
  document.querySelectorAll('[data-speed]').forEach(b => b.classList.toggle('on', +b.dataset.speed === s));
}
document.querySelectorAll('[data-speed]').forEach(b => b.addEventListener('click', () => { setSpeed(+b.dataset.speed); b.blur(); }));
document.querySelectorAll('[data-time]').forEach(b => b.addEventListener('click', () => { time = +b.dataset.time; b.blur(); }));
// The panel can collapse to just the clock; the choice is remembered per browser.
const panel = document.querySelector('.panel');
const toggle = $('toggle');
function setCollapsed(collapsed) {
  panel.classList.toggle('collapsed', collapsed);
  toggle.setAttribute('aria-expanded', String(!collapsed));
  toggle.title = collapsed ? '展開（H）' : '收合（H）';
  toggle.textContent = collapsed ? '▴' : '▾';
  try { localStorage.setItem('small-town:collapsed', collapsed ? '1' : '0'); } catch { /* storage unavailable */ }
}
try { setCollapsed(localStorage.getItem('small-town:collapsed') === '1'); } catch { /* storage unavailable */ }
toggle.addEventListener('click', () => { setCollapsed(!panel.classList.contains('collapsed')); toggle.blur(); });

addEventListener('keydown', e => {
  if (e.code === 'KeyH') setCollapsed(!panel.classList.contains('collapsed'));
  if (e.code !== 'Space') return;
  e.preventDefault();
  setSpeed(speed ? 0 : lastSpeed);
});

const PERIODS = [[5, '凌晨'], [11, '早上'], [13, '中午'], [17, '下午'], [19, '傍晚'], [24, '夜晚']];
function updateUI() {
  const minutes = Math.floor(time * 60);
  $('clock').textContent = `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
  $('period').textContent = PERIODS.find(([h]) => time < h)[1];
  if (!dragging) slider.value = time;
}

// ---------- main loop ----------

const clock = new THREE.Clock();
function frame() {
  const dt = Math.min(clock.getDelta(), 0.1);
  time = (time + dt * speed / 3600) % 24;
  applyTime(time);
  const a = activity(time);
  for (const w of walkers) w.update(dt, a);
  controls.update();
  updateUI();
  composer.render();
  requestAnimationFrame(frame);
}

await Promise.all([buildTown(), addPeople()]);
$('loading').classList.add('done');
frame();
