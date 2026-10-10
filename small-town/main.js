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

// Street cross-section along z: two lanes, each as wide as a sidewalk.
const LANE = 0.8;
const ROAD_HALF = LANE;
const SIDEWALK = 0.8;
const FRONTAGE = ROAD_HALF + SIDEWALK; // where building fronts and the park start
const ROAD_END = 11;

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
camera.position.set(3.5, 7.5, 13);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.2, 1.2);
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
// The character and car packs ship a real colormap.png and keep it.
const BLANK = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
const manager = new THREE.LoadingManager();
manager.setURLModifier(url =>
  url.endsWith('Textures/colormap.png') && !/mini-characters|car-kit/.test(url) ? BLANK : url);
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
  if (Array.isArray(scale)) obj.scale.set(...scale);
  else obj.scale.setScalar(scale);
  scene.add(obj);
  return obj;
}

// Slide a building along z so its front sits on the street frontage.
function alignFront(obj) {
  obj.position.z += -FRONTAGE - 0.02 - new THREE.Box3().setFromObject(obj).max.z;
  return obj;
}

// ---------- shops ----------

const SHOPS = [
  { model: 'building-c', x: -1.72, name: '晨光咖啡', bg: '#3b2a20', fg: '#ffdca8', awning: 0xb8433a },
  { model: 'building-a', x: -2.72, name: '小巷書店', bg: '#1f3b3a', fg: '#f3ead2', awning: 0x2f6b4f },
  { model: 'building-h', x: 1.72, name: '便利商店', bg: '#f7f7f4', fg: '#1d6fd6', awning: 0x2c6fc4 },
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

// ---------- hotel and bus stop ----------

const HOTEL = { model: 'building-n', name: '山嵐旅館', bg: '#1d2440', fg: '#f5d58a' };
// Where hotel guests disappear inside, just under the entrance canopy.
const HOTEL_DOOR = new THREE.Vector3(0, 0.05, -FRONTAGE + 0.06);

// The bus pulls up in the westbound (north) lane with its centre at STOP_X;
// the shelter stands at the curb with its back to the hotel.
const STOP_X = 0.55;
const SHELTER_X = 0.8;
const SHELTER_Z = -(ROAD_HALF + 0.2);
const SHELTER_SEATS = [-0.1, 0.1].map(dx => ({ position: new THREE.Vector3(SHELTER_X + dx, 0.07, SHELTER_Z + 0.02), rotation: 0 }));

function decorateHotel(building) {
  const bounds = new THREE.Box3().setFromObject(building);
  const front = bounds.max.z;
  const top = bounds.max.y;

  // Rooftop sign on two posts.
  const tex = signTexture(HOTEL.name, HOTEL.bg, HOTEL.fg);
  const signMat = new THREE.MeshStandardMaterial({ map: tex, emissive: 0xffffff, emissiveMap: tex, roughness: 0.5 });
  glowing.push([signMat, 0.8]);
  const iron = std(0x2c2f35, { roughness: 0.5, metalness: 0.5 });
  box(1.4, 0.32, 0.04, signMat, 0, top + 0.26, front - 0.3, true);
  for (const x of [-0.5, 0.5]) box(0.03, 0.12, 0.03, iron, x, top + 0.05, front - 0.3);

  // Entrance canopy with a warm downlight, and a carpet to the curb side.
  const canopy = std(0x3a3329, { roughness: 0.6, metalness: 0.3 });
  const downlight = std(0x222222, { emissive: 0xffd49a, emissiveIntensity: 0 });
  glowing.push([downlight, 2.5]);
  box(0.74, 0.025, 0.34, canopy, 0, 0.36, front + 0.17, true);
  box(0.6, 0.006, 0.26, downlight, 0, 0.345, front + 0.17);
  for (const x of [-0.34, 0.34]) box(0.02, 0.31, 0.02, canopy, x, 0.2, front + 0.32, true);
  box(0.3, 0.004, 0.3, std(0x9e2b2b), 0, 0.052, front + 0.15);
}

function buildBusStop() {
  const frame = std(0x2c2f35, { roughness: 0.5, metalness: 0.5 });
  const glass = new THREE.MeshStandardMaterial({ color: 0xbfd8e8, roughness: 0.1, transparent: true, opacity: 0.35 });
  const roofLight = std(0x222222, { emissive: 0xfff0d0, emissiveIntensity: 0 });
  glowing.push([roofLight, 0.6]);
  const back = SHELTER_Z - 0.08;

  // Frame, glass back and end panels, roof with a light strip, and a bench.
  for (const dx of [-0.3, 0.3]) box(0.018, 0.3, 0.018, frame, SHELTER_X + dx, 0.2, back, true);
  box(0.6, 0.2, 0.006, glass, SHELTER_X, 0.18, back);
  box(0.006, 0.2, 0.15, glass, SHELTER_X + 0.3, 0.18, SHELTER_Z);
  box(0.66, 0.018, 0.22, frame, SHELTER_X, 0.355, SHELTER_Z, true);
  box(0.5, 0.005, 0.06, roofLight, SHELTER_X, 0.344, SHELTER_Z);
  box(0.42, 0.012, 0.06, std(0x8a5a3a), SHELTER_X, 0.1, SHELTER_Z - 0.03, true);
  for (const dx of [-0.18, 0.18]) box(0.012, 0.05, 0.05, frame, SHELTER_X + dx, 0.075, SHELTER_Z - 0.03);

  // Stop sign on a pole at the curb.
  const tex = signTexture('公車站', '#1f6fb2', '#ffffff');
  const signMat = new THREE.MeshStandardMaterial({ map: tex, emissive: 0xffffff, emissiveMap: tex, roughness: 0.5 });
  glowing.push([signMat, 0.6]);
  cylinder(0.01, 0.01, 0.42, frame, SHELTER_X - 0.42, 0.26, -ROAD_HALF - 0.08, 8);
  box(0.2, 0.05, 0.012, signMat, SHELTER_X - 0.42, 0.45, -ROAD_HALF - 0.08);
}

// ---------- park ----------

// A fenced lawn south of the street: an entrance path leads to a ring path
// around a fountain, with cross paths out to the side gates.
const PARK = { cz: 4.5, ring: 1.45, xHalf: 4.6, zMin: FRONTAGE + 0.35, zMax: 7.5, path: 0.34 };

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
  const entrance = cz - ring - FRONTAGE;
  box(path, 0.012, entrance, gravel, 0, 0.022, FRONTAGE + entrance / 2);
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
    const z = FRONTAGE + 0.2 + rand() * 7;
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
    box(60, 0.05, SIDEWALK, pavement, 0, 0.025, side * (ROAD_HALF + SIDEWALK / 2));
    box(60, 0.06, 0.06, curb, 0, 0.03, side * (ROAD_HALF + 0.03));
  }

  const jobs = [];
  // Road tiles are 1 × 1; stretch them across to the two-lane width.
  for (let x = -20; x <= 20; x++) jobs.push(place('roads', 'road-straight', { x, scale: [1, 1, ROAD_HALF * 2], mat: roadMat }));

  // The hotel in the middle, with the bus stop at its door.
  jobs.push(place('commercial', HOTEL.model, { x: 0, mat: paletteMaterial(commercial, 0.6) }).then(obj => decorateHotel(alignFront(obj))));
  buildBusStop();

  // The three shops either side of the hotel, each with an awning and a sign.
  SHOPS.forEach((shop, i) => jobs.push(
    place('commercial', shop.model, { x: shop.x, mat: shopMats[i] })
      .then(obj => decorateShop(alignFront(obj), shop))));

  // Neighbours along the street, then a skyline behind.
  const neighbours = ['building-b', 'building-d', 'building-e', 'building-f', 'building-g', 'building-i', 'building-j', 'building-k'];
  [-3.8, 2.75, 3.85, -4.95, 5.0, -6.1].forEach((x, i) =>
    jobs.push(place('commercial', neighbours[i % neighbours.length], { x, mat: shopMats[(i + 1) % 3] }).then(alignFront)));
  for (let i = 0; i < 18; i++) {
    const name = `low-detail-building-${'abcdefghijklmn'[Math.floor(rand() * 14)]}`;
    jobs.push(place('commercial', name, {
      x: -9 + rand() * 18, z: -FRONTAGE - 3.2 - rand() * 5, rot: Math.floor(rand() * 4) * Math.PI / 2,
      scale: 0.55 + rand() * 0.35, mat: towerMats[Math.floor(rand() * 3)],
    }));
  }

  // Across the street: the park.
  buildPark(jobs, houseMat);

  // Street lamps, with a real light under each head.
  const bulbMat = std(0x222222, { emissive: 0xffd9a0, emissiveIntensity: 0 });
  glowing.push([bulbMat, 6]);
  for (const [x, side] of [[-3.3, -1], [-1.25, -1], [2.3, -1], [-2.3, 1], [1.3, 1], [4.8, 1]]) {
    const z = side * (ROAD_HALF + 0.12);
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
    this.z = this.side * (inner ? ROAD_HALF + 0.18 + rand() * 0.12 : ROAD_HALF + 0.45 + rand() * 0.18);
    this.x = x;
    this.obj.position.z = this.z;
    this.face(this.dir * Math.PI / 2);
  }

  // Along the shelter, people on the curb side step over to the shop side.
  laneZ() {
    if (this.side > 0 || Math.abs(this.x - SHELTER_X) > 0.5) return this.z;
    return Math.min(this.z, -(ROAD_HALF + 0.45));
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
    } else if (this.side < 0 && SHOPS.some(s => Math.abs(this.x - s.x) < 0.3) && Math.random() < dt * 0.15) {
      // Window shopping in front of the three shops.
      this.pause = 2 + Math.random() * 4;
      this.walk.fadeOut(0.3);
      this.idle.reset().fadeIn(0.3).play();
      this.face(Math.PI);
    }
    const p = this.obj.position;
    p.set(this.x, 0.05, THREE.MathUtils.damp(p.z, this.laneZ(), 6, dt));
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

// Walks once from one point to another, then goes inside (is removed):
// passengers getting off the bus into the hotel, or out to catch it.
class Passenger extends Person {
  constructor(gltf, from, to, delay) {
    super(gltf, 0);
    this.startWalking(0.3);
    this.obj.position.copy(from);
    this.obj.visible = false;
    this.to = to;
    this.delay = delay;
  }

  update(dt) {
    if ((this.delay -= dt) > 0) return;
    this.obj.visible = true;
    this.mixer.update(dt);
    const p = this.obj.position;
    const dx = this.to.x - p.x;
    const dz = this.to.z - p.z;
    const d = Math.hypot(dx, dz);
    if (d < 0.03) {
      this.done = true;
      scene.remove(this.obj);
      return;
    }
    const step = Math.min(d, this.speed * dt);
    p.x += dx / d * step;
    p.z += dz / d * step;
    this.face(Math.atan2(dx, dz));
  }
}

let peopleGltfs = [];

async function addPeople() {
  const gltfs = peopleGltfs = await Promise.all(PEOPLE.map(n => model('mini-characters', n)));
  const pick = i => gltfs[i % gltfs.length];
  for (let i = 0; i < WALKERS; i++) walkers.push(new Walker(pick(i), i / WALKERS));
  for (let i = 0; i < STROLLERS; i++) walkers.push(new Stroller(pick(i + 5), i / STROLLERS));
  // Only some benches are taken, and people sit mostly in the daytime.
  benchSeats.filter((_, i) => i % 3 !== 2).forEach((seat, i) =>
    walkers.push(new Sitter(pick(i + 9), 0.3 + i * 0.12, seat)));
  SHELTER_SEATS.forEach((seat, i) => walkers.push(new Sitter(pick(i + 3), 0.2 + i * 0.35, seat)));
  for (const w of walkers) w.obj.visible = w.rank < activity(time);
}

// ---------- traffic ----------

// Right-hand traffic: eastbound (+x) in the south lane, westbound in the
// north lane, which is the one passing the bus stop.
const LANES = [{ z: -LANE / 2, dir: -1 }, { z: LANE / 2, dir: 1 }];
const CARS = ['sedan', 'taxi', 'suv', 'van', 'hatchback-sports', 'delivery', 'sedan', 'taxi', 'suv'];
const CAR_SCALE = 0.2;
const BUS_LENGTH = 1.3;
const BUS_WIDTH = 0.32;
const BUS_DWELL = 7;
const vehicles = [];

// Vehicles are built facing +z and turned to their lane's direction.
class Vehicle {
  constructor(obj, lane, length, cruise, rank) {
    Object.assign(this, { obj, lane, length, cruise, rank });
    this.speed = 0;
    this.x = 0;
    this.onRoad = false;
    this.cooldown = rand() * 8;
    obj.rotation.y = lane.dir * Math.PI / 2;
    obj.visible = false;
    scene.add(obj);
  }

  desiredSpeed() { return this.cruise; }

  enter() {
    this.onRoad = true;
    this.obj.visible = true;
    this.x = -this.lane.dir * ROAD_END;
    this.speed = this.cruise;
  }

  leave() {
    this.onRoad = false;
    this.obj.visible = false;
    this.cooldown = 1 + Math.random() * 6;
  }
}

class Bus extends Vehicle {
  constructor(obj, lane) {
    super(obj, lane, BUS_LENGTH, 0.8, 0);
    this.cooldown = 2;
  }

  enter() {
    super.enter();
    this.state = 'arriving';
  }

  leave() {
    super.leave();
    this.cooldown = 12 + Math.random() * 8;
  }

  desiredSpeed(dt) {
    if (this.state === 'arriving') {
      const left = (STOP_X - this.x) * this.lane.dir;
      if (left < 0.02 && this.speed < 0.05) {
        this.state = 'dwelling';
        this.wait = BUS_DWELL;
        unloadBus(this);
        return 0;
      }
      // Brake evenly so the bus comes to rest at the stop.
      return Math.min(this.cruise, Math.sqrt(Math.max(left, 0)));
    }
    if (this.state === 'dwelling') {
      if ((this.wait -= dt) <= 0) this.state = 'leaving';
      return 0;
    }
    return this.cruise;
  }
}

// A few riders step off at the front door and walk into the hotel, and a
// guest or two come out to board.
function unloadBus(bus) {
  if (!peopleGltfs.length) return;
  const door = new THREE.Vector3(bus.x + bus.lane.dir * (BUS_LENGTH / 2 - 0.22), 0.05, -ROAD_HALF - 0.06);
  const pick = () => peopleGltfs[Math.floor(Math.random() * peopleGltfs.length)];
  const off = 1 + Math.floor(Math.random() * 3);
  for (let i = 0; i < off; i++) walkers.push(new Passenger(pick(), door, HOTEL_DOOR, 0.6 + i * 0.9));
  const on = Math.floor(Math.random() * 3);
  for (let i = 0; i < on; i++) walkers.push(new Passenger(pick(), HOTEL_DOOR, door, i * 1.2));
}

function lightPair(group, mat, x, y, z) {
  for (const sx of [-x, x]) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.025, 0.01), mat);
    m.position.set(sx, y, z);
    group.add(m);
  }
}

function makeCar(gltf, headMat, tailMat) {
  const group = new THREE.Group();
  const body = gltf.scene.clone(true);
  body.scale.setScalar(CAR_SCALE);
  body.traverse(o => { if (o.isMesh) o.castShadow = o.receiveShadow = true; });
  group.add(body);
  const b = new THREE.Box3().setFromObject(body);
  const half = b.max.z;
  lightPair(group, headMat, b.max.x * 0.6, b.max.y * 0.3, half + 0.004);
  lightPair(group, tailMat, b.max.x * 0.6, b.max.y * 0.3, -half - 0.004);
  return { group, length: half * 2 };
}

// The city bus: green lower body, a window band lit from inside at night,
// white roof, front door on the curb (−x) side and four Car Kit wheels.
function makeBus(wheel, headMat, tailMat) {
  const g = new THREE.Group();
  const L = BUS_LENGTH;
  const W = BUS_WIDTH;
  const paint = std(0x2e8b74, { roughness: 0.5 });
  const white = std(0xf2f0ea, { roughness: 0.5 });
  const glass = std(0x1c2a36, { roughness: 0.15, metalness: 0.3, emissive: 0xffe2b0, emissiveIntensity: 0 });
  glowing.push([glass, 0.6]);
  const sign = std(0x222222, { emissive: 0xffb347, emissiveIntensity: 0 });
  glowing.push([sign, 2]);
  const part = (w, h, d, mat, x, y, z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    m.castShadow = m.receiveShadow = true;
    g.add(m);
  };
  part(W, 0.15, L, paint, 0, 0.13, 0);
  part(W - 0.004, 0.13, L - 0.004, glass, 0, 0.27, 0);
  for (let k = 0; k < 6; k++) part(W + 0.006, 0.13, 0.025, white, 0, 0.27, -L / 2 + 0.06 + k * (L - 0.24) / 5);
  part(W, 0.06, L, white, 0, 0.365, 0);
  part(W * 0.7, 0.04, 0.35, white, 0, 0.415, -0.2);
  part(W * 0.7, 0.035, 0.01, sign, 0, 0.365, L / 2 + 0.003);
  part(0.006, 0.24, 0.14, glass, -W / 2 - 0.004, 0.18, L / 2 - 0.22);
  lightPair(g, headMat, 0.11, 0.1, L / 2 + 0.004);
  lightPair(g, tailMat, 0.11, 0.1, -L / 2 - 0.004);
  for (const z of [L / 2 - 0.25, -L / 2 + 0.25]) {
    for (const x of [-(W / 2 - 0.03), W / 2 - 0.03]) {
      const w = wheel.scene.clone(true);
      w.scale.setScalar(0.18);
      w.position.set(x, 0.055, z);
      w.traverse(o => { if (o.isMesh) o.castShadow = true; });
      g.add(w);
    }
  }
  return g;
}

async function addTraffic() {
  const headMat = std(0x222222, { emissive: 0xfff4d6, emissiveIntensity: 0 });
  const tailMat = std(0x441111, { emissive: 0xff3a2a, emissiveIntensity: 0 });
  glowing.push([headMat, 4], [tailMat, 2.5]);
  const [wheel, ...cars] = await Promise.all(['wheel-default', ...CARS].map(n => model('car-kit', n)));
  cars.forEach((gltf, i) => {
    const { group, length } = makeCar(gltf, headMat, tailMat);
    vehicles.push(new Vehicle(group, LANES[i % 2], length, 0.9 + rand() * 0.35, i / cars.length));
  });
  vehicles.push(new Bus(makeBus(wheel, headMat, tailMat), LANES[0]));
}

// Each lane is a queue: everyone drives at their own pace but brakes to keep
// a gap behind the vehicle ahead, so cars wait behind the bus at its stop.
function updateTraffic(dt, activity) {
  for (const v of vehicles) if (!v.onRoad) v.cooldown -= dt;
  for (const lane of LANES) {
    const queue = vehicles.filter(v => v.lane === lane && v.onRoad).sort((a, b) => (b.x - a.x) * lane.dir);
    queue.forEach((v, i) => {
      let target = v.desiredSpeed(dt);
      const ahead = queue[i - 1];
      if (ahead) {
        const gap = (ahead.x - v.x) * lane.dir - (ahead.length + v.length) / 2;
        target = Math.min(target, Math.max(0, (gap - 0.15) * 1.2));
      }
      v.speed += THREE.MathUtils.clamp(target - v.speed, -1.5 * dt, 0.5 * dt);
      v.x += v.speed * lane.dir * dt;
      v.obj.position.set(v.x, 0.02, lane.z);
      if (v.x * lane.dir > ROAD_END) v.leave();
    });
    // Let the next waiting vehicle in once the start of the lane is clear.
    const last = queue.filter(v => v.onRoad).at(-1);
    if (last && last.x * lane.dir < -ROAD_END + last.length + 0.8) continue;
    const next = vehicles.find(v => v.lane === lane && !v.onRoad && v.cooldown <= 0 && v.rank < activity);
    if (next) next.enter();
  }
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
  for (let i = walkers.length; i--;) if (walkers[i].done) walkers.splice(i, 1);
  updateTraffic(dt, a);
  controls.update();
  updateUI();
  composer.render();
  requestAnimationFrame(frame);
}

await Promise.all([buildTown(), addPeople(), addTraffic()]);
$('loading').classList.add('done');
frame();
