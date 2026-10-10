import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RESIDENTS, PASSERBY_LINES } from './residents.js';

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
const WALKERS = 20;
const STROLLERS = 7;
const STREET_HALF = 9;

// Street cross-section along z: two lanes, each as wide as a sidewalk.
const LANE = 0.8;
const ROAD_HALF = LANE;
const SIDEWALK = 0.8;
const FRONTAGE = ROAD_HALF + SIDEWALK; // where building fronts and the park start
const ROAD_END = 11;

// The town is a grid: two east–west streets joined by two north–south lanes.
const STREETS = [0, -7.2]; // centre line z of the main street and the back street
const ALLEYS = [-5.6, 5.6]; // centre line x of the lanes
const ALLEY_HALF = 0.45;

// Building rows: `front` is the z of the building fronts and `facing` the way
// they face (+1 south, −1 north), so the main street's north side faces +1.
const MAIN_NORTH = { street: STREETS[0], front: STREETS[0] - FRONTAGE, facing: 1 };
const MAIN_SOUTH = { street: STREETS[0], front: STREETS[0] + FRONTAGE, facing: -1 };
const BACK_SOUTH = { street: STREETS[1], front: STREETS[1] + FRONTAGE, facing: -1 };
const BACK_NORTH = { street: STREETS[1], front: STREETS[1] - FRONTAGE, facing: 1 };

// Homes: town houses on the main street and between the streets, detached
// houses (villas) at the ends of the back street.
const OUTER = [-6.6, -7.6, -8.6, -9.6, 6.6, 7.6, 8.6, 9.6];
const HOMES = [
  ...[-3.7, -4.65, 2.68, 3.67, 4.62, ...OUTER].map(x => ({ ...MAIN_NORTH, x })),
  ...[-4.55, -3.6, -2.6, -1.5, 0, 1.5, 2.5, 3.5, 4.55, ...OUTER].map(x => ({ ...BACK_SOUTH, x })),
  ...[-9.4, -10.9, 9.7, 11.2].map(x => ({ ...BACK_NORTH, x, villa: true })),
];

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
scene.fog = new THREE.Fog(0x0b1020, 20, 55);

const camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 0.1, 200);
camera.position.set(4, 12, 13);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.2, -2.2);
controls.enableDamping = true;
controls.maxPolarAngle = 1.32;
controls.minDistance = 3;
controls.maxDistance = 35;

const sun = new THREE.DirectionalLight(0xffffff, 2);
sun.castShadow = true;
sun.shadow.mapSize.set(4096, 4096);
Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 80 });
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

// Tilt-shift with a sharp band: rows within `band` of the focus line `r`
// stay crisp, so the street and its signs read clearly, and only the top
// and bottom of the frame blur. One pass per axis; `texel` is one pixel's size.
const TILT = { r: 0.55, band: 0.28, strength: 3 };
function tiltShiftPass(axis) {
  return new ShaderPass({
    uniforms: { tDiffuse: { value: null }, texel: { value: 0 }, r: { value: TILT.r }, band: { value: TILT.band } },
    vertexShader: `varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform sampler2D tDiffuse; uniform float texel, r, band; varying vec2 vUv;
      void main() {
        vec2 d = vec2(${axis === 'x' ? '1.0, 0.0' : '0.0, 1.0'}) * texel * max(0.0, abs(r - vUv.y) - band);
        vec4 sum = texture2D(tDiffuse, vUv - 4.0 * d) * 0.051 + texture2D(tDiffuse, vUv - 3.0 * d) * 0.0918
          + texture2D(tDiffuse, vUv - 2.0 * d) * 0.12245 + texture2D(tDiffuse, vUv - d) * 0.1531
          + texture2D(tDiffuse, vUv) * 0.1633
          + texture2D(tDiffuse, vUv + d) * 0.1531 + texture2D(tDiffuse, vUv + 2.0 * d) * 0.12245
          + texture2D(tDiffuse, vUv + 3.0 * d) * 0.0918 + texture2D(tDiffuse, vUv + 4.0 * d) * 0.051;
        gl_FragColor = sum;
      }`,
  });
}
const tiltH = tiltShiftPass('x');
const tiltV = tiltShiftPass('y');
composer.addPass(tiltH);
composer.addPass(tiltV);
composer.addPass(new OutputPass());

function resize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
  tiltH.uniforms.texel.value = TILT.strength / innerWidth;
  tiltV.uniforms.texel.value = TILT.strength / innerHeight;
}
addEventListener('resize', resize);
resize();

// ---------- materials ----------

// [material, emissive intensity at full night, lights-out hour, share left on]
// Entries without a lights-out hour stay lit all night (signs, lamps, cars).
const glowing = [];
const lamps = [];

const std = (color, opts = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.9, ...opts });

function box(w, h, d, mat, x, y, z, cast = false, parent = scene) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = cast;
  m.receiveShadow = true;
  parent.add(m);
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

function paletteMaterial(textures, nightGlow, lightsOut, keep = 0) {
  const mat = new THREE.MeshStandardMaterial({ ...textures, emissive: 0xffffff, emissiveIntensity: 0, roughness: 0.8 });
  glowing.push([mat, nightGlow, lightsOut, keep]);
  return mat;
}

// A random bedtime between two clock hours, which may cross midnight.
const bedtime = (from, to) => (from + rand() * ((to - from + 24) % 24)) % 24;

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

// Slide a building along z so its front sits on its row's frontage.
function alignFront(obj, front = MAIN_NORTH.front, facing = 1) {
  const b = new THREE.Box3().setFromObject(obj);
  obj.position.z += facing > 0 ? front - 0.02 - b.max.z : front + 0.02 - b.min.z;
  return obj;
}

// A building in a row, turned to face its street and set on the frontage.
function building(pack, name, x, row, mat) {
  return place(pack, name, { x, rot: row.facing > 0 ? 0 : Math.PI, mat })
    .then(obj => alignFront(obj, row.front, row.facing));
}

// ---------- shops ----------

// `closes` is the clock hour the sign and lights go out; shops without one
// are open all night.
const SHOPS = [
  { ...MAIN_NORTH, model: 'building-c', x: -1.72, name: '晨光咖啡', bg: '#3b2a20', fg: '#ffdca8', awning: 0xb8433a, glow: 1.4, closes: 22.5 },
  { ...MAIN_NORTH, model: 'building-a', x: -2.72, name: '小巷書店', bg: '#1f3b3a', fg: '#f3ead2', awning: 0x2f6b4f, glow: 1.2, closes: 21.5 },
  { ...MAIN_NORTH, model: 'building-h', x: 1.72, name: '便利商店', bg: '#f7f7f4', fg: '#1d6fd6', awning: 0x2c6fc4, glow: 1.8 },
  { ...BACK_NORTH, model: 'building-d', x: -4.55, name: '麥香麵包', bg: '#5a3a1e', fg: '#ffe7b0', awning: 0xd9822b, glow: 1.3, closes: 20 },
  { ...BACK_NORTH, model: 'building-b', x: -3.6, name: '小花園花店', bg: '#f4e8ef', fg: '#c0466e', awning: 0xe58fb0, glow: 1.0, closes: 19.5 },
  { ...BACK_NORTH, model: 'building-c', x: -2.6, name: '阿嬤早餐', bg: '#fff3c4', fg: '#8a4b00', awning: 0xf2c14e, glow: 1.2, closes: 13 },
  { ...BACK_NORTH, model: 'building-a', x: -1.5, name: '老街麵館', bg: '#7a1f1f', fg: '#fff1d6', awning: 0xb83a2e, glow: 1.5, closes: 21 },
  { ...BACK_NORTH, model: 'building-h', x: 1.5, name: '安心藥局', bg: '#ffffff', fg: '#1f8a4c', awning: 0x2f9e5b, glow: 1.3, closes: 22 },
  { ...BACK_NORTH, model: 'building-f', x: 2.5, name: '泡泡洗衣', bg: '#dff3ff', fg: '#1f6fb2', awning: 0x5aa9e6, glow: 1.0 },
  { ...BACK_NORTH, model: 'building-g', x: 3.5, name: '拾光文具', bg: '#3d2f5c', fg: '#f3e6ff', awning: 0x7a5cc4, glow: 1.1, closes: 21 },
  { ...BACK_NORTH, model: 'building-d', x: 4.55, name: '甜甜手搖飲', bg: '#1f4d4a', fg: '#c9f2e6', awning: 0x2fb3a0, glow: 1.4, closes: 23 },
];

// Public buildings beyond the lanes on the back street's north side: signs
// but no awnings.
const CIVIC = [
  { ...BACK_NORTH, model: 'building-j', x: -7.2, name: '鎮立小學', bg: '#f2efe6', fg: '#2f5d8a', glow: 0.5, closes: 18 },
  { ...BACK_NORTH, model: 'building-i', x: 6.75, name: '郵局', bg: '#1f7a3d', fg: '#ffffff', glow: 0.8, closes: 18.5 },
  { ...BACK_NORTH, model: 'building-l', x: 8.2, name: '仁心診所', bg: '#ffffff', fg: '#c62f2f', glow: 1.0, closes: 21 },
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

// Awning and sign are built facing +z in a group set on the shop's front
// and turned with it, so the same code serves both sides of a street.
async function decorateShop(building, shop) {
  const bounds = new THREE.Box3().setFromObject(building);
  const width = Math.min(bounds.max.x - bounds.min.x, 1.2);
  const g = new THREE.Group();
  g.position.set(shop.x, 0, shop.facing > 0 ? bounds.max.z : bounds.min.z);
  g.rotation.y = shop.facing > 0 ? 0 : Math.PI;
  scene.add(g);
  if (shop.awning) addAwning(g, width * 0.82, shop.awning);

  const tex = signTexture(shop.name, shop.bg, shop.fg);
  const signMat = new THREE.MeshStandardMaterial({ map: tex, emissive: 0xffffff, emissiveMap: tex, roughness: 0.6 });
  glowing.push([signMat, 0.45, shop.closes]);
  box(width * 0.72, width * 0.17, 0.02, signMat, 0, 0.45, 0.012, false, g);
}

// A striped cloth awning: a sloped canopy plus a short vertical valance.
const AWNING_Y = 0.36;
const AWNING_DEPTH = 0.17;
const AWNING_TILT = 0.42;

function addAwning(parent, width, color) {
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
  canopy.position.set(0, AWNING_Y, 0);
  canopy.rotation.x = AWNING_TILT;
  valance.position.set(0, AWNING_Y - AWNING_DEPTH * Math.sin(AWNING_TILT), AWNING_DEPTH * Math.cos(AWNING_TILT));
  parent.add(canopy, valance);
}

// ---------- hotel and bus stop ----------

const HOTEL = { model: 'building-n', name: '山嵐旅館', bg: '#1d2440', fg: '#f5d58a' };
// Where people disappear inside: under the hotel canopy, or into the store.
const HOTEL_DOOR = new THREE.Vector3(0, 0.05, -FRONTAGE + 0.06);
const STORE_DOOR = new THREE.Vector3(1.72, 0.05, -FRONTAGE + 0.06);

// The bus pulls up in the westbound (north) lane with its centre at STOP_X,
// outside the convenience store; the shelter stands at the curb with its
// back to the store.
const STOP_X = 1.75;
const SHELTER_X = 1.85;
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
  for (let placed = 0; placed < 22;) {
    const x = -11 + rand() * 22;
    const z = zMax + 0.4 + rand() * 3;
    if (ALLEYS.some(ax => Math.abs(x - ax) < ALLEY_HALF + 0.2)) continue;
    tree(x, z);
    placed++;
  }
}

// ---------- town layout ----------

async function buildTown() {
  const [commercial, suburban, roads] = await Promise.all(['commercial', 'suburban', 'roads'].map(palette));
  // Every building has its own material so its lights go out at its own time.
  const houseMat = paletteMaterial(suburban, 1.2);
  const roadMat = paletteMaterial(roads, 0);
  // Skyline towers draw their window bands with the grey-blue swatch.
  const towerWindows = { map: commercial.map, emissiveMap: swatchMask(32, 256, 32, 128) };
  const townHouseMat = () => paletteMaterial(commercial, [1.4, 0.7, 2.2][Math.floor(rand() * 3)], bedtime(21.5, 2.5), rand() * 0.15);
  const villaMat = () => paletteMaterial(suburban, 0.9 + rand() * 0.6, bedtime(21, 1), rand() * 0.1);

  // Ground, then each street's sidewalks, curbs and road.
  box(120, 0.1, 120, std(0x667a52), 0, -0.05, 0);
  const pavement = std(0xb3ada3);
  const curb = std(0xd2ccc0);
  const jobs = [];
  for (const street of STREETS) {
    for (const side of [-1, 1]) {
      box(60, 0.05, SIDEWALK, pavement, 0, 0.025, street + side * (ROAD_HALF + SIDEWALK / 2));
      box(60, 0.06, 0.06, curb, 0, 0.03, street + side * (ROAD_HALF + 0.03));
    }
    // Road tiles are 1 × 1; stretch them across to the two-lane width.
    for (let x = -20; x <= 20; x++) {
      jobs.push(place('roads', 'road-straight', { x, z: street, scale: [1, 1, ROAD_HALF * 2], mat: roadMat }));
    }
  }
  buildAlleys();

  // The hotel in the middle; the bus stop is outside the convenience store.
  jobs.push(place('commercial', HOTEL.model, { x: 0, mat: paletteMaterial(commercial, 0.6, 0.5, 0.3) }).then(obj => decorateHotel(alignFront(obj))));
  buildBusStop();

  // Shops and public buildings, each with a sign and the shops with awnings.
  for (const shop of [...SHOPS, ...CIVIC]) {
    const mat = paletteMaterial(commercial, shop.glow, shop.closes);
    jobs.push(building('commercial', shop.model, shop.x, shop, mat).then(obj => decorateShop(obj, shop)));
  }

  // Homes fill the rest of the rows.
  const townHouses = ['building-b', 'building-d', 'building-f', 'building-g'];
  const villas = ['building-type-a', 'building-type-c', 'building-type-e', 'building-type-g'];
  HOMES.forEach((home, i) => {
    if (home.villa) jobs.push(building('suburban', villas[i % villas.length], home.x, home, villaMat()));
    else jobs.push(building('commercial', home.x === 0 ? 'building-e' : townHouses[i % 4], home.x, home, townHouseMat()));
  });

  // Skyline behind the back street.
  for (let i = 0; i < 22; i++) {
    const name = `low-detail-building-${'abcdefghijklmn'[Math.floor(rand() * 14)]}`;
    jobs.push(place('commercial', name, {
      x: -12 + rand() * 24, z: BACK_NORTH.front - 3.4 - rand() * 5, rot: Math.floor(rand() * 4) * Math.PI / 2,
      scale: 0.55 + rand() * 0.35, mat: paletteMaterial(towerWindows, 0.3 + rand() * 0.6, bedtime(22, 3), 0.2),
    }));
  }

  // South of the main street: the park, with a gas station and a car park either side.
  buildPark(jobs, houseMat);
  buildGasStation();
  buildParkingLot();

  // Street lamps on both streets, with a real light under each head.
  const bulbMat = std(0x222222, { emissive: 0xffd9a0, emissiveIntensity: 0 });
  glowing.push([bulbMat, 6]);
  const LAMPS = [
    [STREETS[0], [[-3.3, -1], [-1.25, -1], [2.75, -1], [7.8, -1], [-7.8, -1], [-2.3, 1], [1.3, 1], [4.8, 1]]],
    [STREETS[1], [[-3.1, 1], [2.0, 1], [-1.1, -1], [3.1, -1]]],
  ];
  for (const [street, spots] of LAMPS) {
    for (const [x, side] of spots) {
      const z = street + side * (ROAD_HALF + 0.12);
      jobs.push(place('roads', 'light-square', { x, z, rot: side < 0 ? Math.PI : 0, mat: roadMat }));
      const head = new THREE.Vector3(x, 0.57, z - side * 0.19);
      box(0.06, 0.015, 0.06, bulbMat, head.x, head.y, head.z);
      const light = new THREE.PointLight(0xffbe7a, 0, 3.2, 1.6);
      light.position.copy(head).y -= 0.04;
      scene.add(light);
      lamps.push(light);
    }
  }

  await Promise.all(jobs);
}

// The two lanes: paved strips between the streets and on beyond them, with
// zebra crossings where they meet each street, plus one from the hotel to
// the park gate.
function buildAlleys() {
  const paving = std(0x9d978c);
  const zebra = std(0xe8e2cf, { roughness: 0.6 });
  const spans = [
    [BACK_SOUTH.front, MAIN_NORTH.front],
    [MAIN_SOUTH.front, PARK.zMax + 1],
    [BACK_NORTH.front - 3, BACK_NORTH.front],
  ];
  const crossing = (x, street, width) => {
    for (let i = 0; i < 7; i++) box(width, 0.004, 0.11, zebra, x, 0.022, street - ROAD_HALF + 0.12 + i * 0.226);
  };
  for (const x of ALLEYS) {
    for (const [z0, z1] of spans) box(ALLEY_HALF * 2, 0.02, z1 - z0, paving, x, 0.01, (z0 + z1) / 2);
    for (const street of STREETS) crossing(x, street, ALLEY_HALF * 1.6);
  }
  crossing(0, STREETS[0], 0.6);
}

// ---------- gas station and car park ----------

const GAS = { x: -8, z: MAIN_SOUTH.front + 1.4 };
const LOT = { x: 8, z: MAIN_SOUTH.front + 1.4 };
// Two rows of five stalls facing each other across the aisle.
const PARKING_STALLS = [-1, 1].flatMap(row =>
  [-1.2, -0.6, 0, 0.6, 1.2].map(dx => ({ x: LOT.x + dx, z: LOT.z + row * 0.65, rot: row > 0 ? Math.PI : 0 })));

const asphalt = () => std(0x3a3d44, { roughness: 0.95 });

// A roadside sign on a pole, facing the street.
function poleSign(text, bg, fg, x, z, glow) {
  const grey = std(0x8a8f99, { roughness: 0.5, metalness: 0.4 });
  cylinder(0.02, 0.02, 0.6, grey, x, 0.3, z, 8);
  const tex = signTexture(text, bg, fg);
  const mat = new THREE.MeshStandardMaterial({ map: tex, emissive: 0xffffff, emissiveMap: tex, roughness: 0.5 });
  glowing.push([mat, glow]);
  box(0.5, 0.125, 0.03, mat, x, 0.62, z, true);
}

function buildGasStation() {
  const { x, z } = GAS;
  const white = std(0xf2f0ea, { roughness: 0.6 });
  const red = std(0xd2352b, { roughness: 0.6 });
  const grey = std(0x8a8f99, { roughness: 0.5, metalness: 0.4 });
  // Open all night: the canopy lights and the kiosk window never go out.
  const light = std(0x222222, { emissive: 0xfff4dc, emissiveIntensity: 0 });
  glowing.push([light, 2.2]);
  box(3.4, 0.012, 2.4, asphalt(), x, 0.008, z);

  // Canopy on four posts over two pumps.
  const cx = x + 0.3;
  box(2.0, 0.07, 1.1, white, cx, 0.5, z, true);
  box(2.02, 0.035, 1.12, red, cx, 0.47, z);
  box(1.7, 0.006, 0.8, light, cx, 0.45, z);
  for (const dx of [-0.85, 0.85]) for (const dz of [-0.4, 0.4]) box(0.04, 0.45, 0.04, grey, cx + dx, 0.225, z + dz, true);
  for (const dx of [-0.4, 0.4]) {
    box(0.22, 0.03, 0.14, grey, cx + dx, 0.015, z);
    box(0.12, 0.22, 0.1, red, cx + dx, 0.14, z, true);
    box(0.08, 0.05, 0.005, light, cx + dx, 0.2, z - 0.053);
  }

  // Kiosk at the back, its window toward the street.
  box(0.9, 0.36, 0.55, white, x - 1.1, 0.18, z + 0.7, true);
  box(0.6, 0.18, 0.006, light, x - 1.1, 0.17, z + 0.42);
  poleSign('加油站', '#d2352b', '#ffffff', x + 1.5, MAIN_SOUTH.front + 0.15, 0.7);

  const lamp = new THREE.PointLight(0xfff4dc, 0, 2.2, 1.6);
  lamp.position.set(cx, 0.4, z);
  scene.add(lamp);
  lamps.push(lamp);
}

function buildParkingLot() {
  const { x, z } = LOT;
  const paint = std(0xe8e2cf, { roughness: 0.6 });
  box(3.4, 0.012, 2.4, asphalt(), x, 0.008, z);
  for (const row of [-1, 1]) {
    for (let i = 0; i < 6; i++) box(0.02, 0.004, 0.55, paint, x - 1.5 + i * 0.6, 0.016, z + row * 0.65);
  }
  poleSign('停車場', '#1f5fae', '#ffffff', x - 1.55, MAIN_SOUTH.front + 0.15, 0.6);
}

// ---------- pedestrians ----------

const walkers = [];

// `rank` in [0, 1) decides when a person is out: they show while it is below
// the current activity level, so the town empties gradually at night.
// Clicks land on an invisible box around each person: easier to hit than
// the small skinned model.
const HIT_BOX = new THREE.BoxGeometry(0.9, 0.8, 0.7).translate(0, 0.4, 0);
const HIT_MAT = new THREE.MeshBasicMaterial({ visible: false });

const ROLES = { Walker: '路過的人', Stroller: '散步的人', Sitter: '坐著休息的人', Passenger: '公車乘客' };

class Person {
  constructor(gltf, rank) {
    this.gltf = gltf;
    this.obj = SkeletonUtils.clone(gltf.scene);
    this.obj.scale.setScalar(PERSON_SCALE);
    this.obj.traverse(o => { if (o.isMesh) o.castShadow = true; });
    this.hit = new THREE.Mesh(HIT_BOX, HIT_MAT);
    this.hit.userData.person = this;
    this.obj.add(this.hit);
    this.mixer = new THREE.AnimationMixer(this.obj);
    this.rank = rank;
    this.hop = 0;
    scene.add(this.obj);
  }

  speech() {
    const lines = PASSERBY_LINES[partOfDay(time)];
    return { name: '路人', role: ROLES[this.constructor.name], line: lines[Math.floor(Math.random() * lines.length)] };
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
    this.state = 'walking';
    this.spawn(-STREET_HALF + rand() * STREET_HALF * 2);
  }

  spawn(x) {
    this.street = STREETS[Math.floor(rand() * STREETS.length)];
    this.side = rand() < 0.5 ? -1 : 1;
    this.dir = rand() < 0.5 ? 1 : -1;
    // Keep the two walking directions in separate lanes so people rarely overlap.
    const inner = this.dir * this.side > 0;
    this.z = this.street + this.side * (inner ? ROAD_HALF + 0.18 + rand() * 0.12 : ROAD_HALF + 0.45 + rand() * 0.18);
    this.x = x;
    this.obj.position.z = this.z;
    this.face(this.dir * Math.PI / 2);
  }

  // Along the shelter, people on the curb side step over to the shop side.
  laneZ() {
    if (this.street !== STREETS[0] || this.side > 0 || Math.abs(this.x - SHELTER_X) > 0.5) return this.z;
    return Math.min(this.z, -(ROAD_HALF + 0.45));
  }

  // The outer edge of the sidewalk: house doors on the north side, the park
  // fence on the south. People go home and come out across it.
  edgeZ() { return this.street + this.side * (FRONTAGE + 0.02); }

  goHome() {
    if (this.pause > 0) {
      this.pause = 0;
      this.idle.fadeOut(0.3);
      this.walk.reset().fadeIn(0.3).play();
    }
    this.state = 'leaving';
    this.face(this.side < 0 ? Math.PI : 0);
  }

  update(dt, activity) {
    this.mixer.update(dt);
    const p = this.obj.position;
    const home = this.rank >= activity;
    if (this.state === 'away') {
      if (home) return;
      this.spawn(STREET_HALF * 0.8 * (Math.random() * 2 - 1));
      p.set(this.x, 0.05, this.edgeZ());
      this.face(this.side < 0 ? 0 : Math.PI);
      this.obj.visible = true;
      this.state = 'arriving';
      return;
    }
    if (this.state === 'arriving' || this.state === 'leaving') {
      const target = this.state === 'arriving' ? this.laneZ() : this.edgeZ();
      const step = this.speed * dt;
      if (Math.abs(target - p.z) > step) {
        p.z += Math.sign(target - p.z) * step;
      } else if (this.state === 'leaving') {
        this.obj.visible = false;
        this.state = 'away';
      } else {
        p.z = target;
        this.state = 'walking';
        this.face(this.dir * Math.PI / 2);
      }
      return;
    }
    if (home) {
      this.goHome();
      return;
    }
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
    } else if (SHOPS.some(s => s.street === this.street && s.facing === -this.side && Math.abs(this.x - s.x) < 0.3)
      && Math.random() < dt * 0.15) {
      // Window shopping: turn to the shop on this side of the street.
      this.pause = 2 + Math.random() * 4;
      this.walk.fadeOut(0.3);
      this.idle.reset().fadeIn(0.3).play();
      this.face(this.side < 0 ? Math.PI : 0);
    }
    p.set(this.x, 0.05, THREE.MathUtils.damp(p.z, this.laneZ(), 6, dt));
  }
}

// Walks laps around the park's ring path, and leaves and returns straight
// across the lawn among the trees.
const STROLL_OUT = PARK.ring + 0.6;

class Stroller extends Person {
  constructor(gltf, rank) {
    super(gltf, rank);
    this.startWalking(0.2 + rand() * 0.1);
    this.dir = rand() < 0.5 ? 1 : -1;
    this.radius = this.r = PARK.ring + (rand() - 0.5) * 0.14;
    this.angle = rand() * Math.PI * 2;
    this.state = 'walking';
  }

  update(dt, activity) {
    this.mixer.update(dt);
    const home = this.rank >= activity;
    if (this.state === 'away') {
      if (home) return;
      this.state = 'arriving';
      this.r = STROLL_OUT;
      this.obj.visible = true;
    }
    if (this.state === 'walking' && home) this.state = 'leaving';
    const c = Math.cos(this.angle);
    const s = Math.sin(this.angle);
    if (this.state === 'walking') {
      this.angle += this.dir * this.speed / this.radius * dt;
      this.face(Math.atan2(-s * this.dir, c * this.dir));
    } else {
      const target = this.state === 'arriving' ? this.radius : STROLL_OUT;
      const step = this.speed * dt;
      if (Math.abs(target - this.r) > step) {
        this.r += Math.sign(target - this.r) * step;
      } else if (this.state === 'leaving') {
        this.obj.visible = false;
        this.state = 'away';
        return;
      } else {
        this.r = target;
        this.state = 'walking';
      }
      const out = this.state === 'leaving' ? 1 : -1;
      this.face(Math.atan2(c * out, s * out));
    }
    this.obj.position.set(Math.cos(this.angle) * this.r, 0.03, PARK.cz + Math.sin(this.angle) * this.r);
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

// ---------- residents ----------

// Residents walk a day plan in game time: where they are follows the clock,
// so scrubbing or speeding up time moves them like a time-lapse.
const WALK_SPEED = 22.8; // town units per game hour: 0.38 per second at 60×

const partOfDay = t => (t >= 5 && t < 11 ? 'morning' : t >= 11 && t < 17 ? 'day' : t >= 17 && t < 22 ? 'evening' : 'night');

// Which sidewalk of each street faces the block between the two streets,
// and where each street can be crossed.
const BLOCK_SIDE = new Map([[STREETS[0], -1], [STREETS[1], 1]]);
const CROSSINGS = new Map([[STREETS[0], [...ALLEYS, 0]], [STREETS[1], ALLEYS]]);

// A place is a door on a sidewalk: x along the street, the street, which
// side of it (−1 north, +1 south) and the door point itself.
function door(x, row) {
  return { x, street: row.street, side: -row.facing, door: new THREE.Vector3(x, 0.05, row.front + row.facing * 0.05) };
}

const PLACES = new Map([
  ...[...SHOPS, ...CIVIC].map(s => [s.name, door(s.x, s)]),
  [HOTEL.name, { x: 0, street: STREETS[0], side: -1, door: HOTEL_DOOR }],
  ['公車站', { x: STOP_X - 0.43, street: STREETS[0], side: -1, door: new THREE.Vector3(STOP_X - 0.43, 0.05, -ROAD_HALF - 0.06), away: true }],
  ['加油站', { x: GAS.x - 1.1, street: STREETS[0], side: 1, door: new THREE.Vector3(GAS.x - 1.1, 0.03, GAS.z + 0.35) }],
  ['公園', { x: 0, street: STREETS[0], side: 1, door: new THREE.Vector3(0, 0.03, PARK.cz - PARK.ring), park: true }],
]);

// Hand out homes in order: upstairs from the workplace, or the next free
// town house or villa (villas are shared by families when they run out).
const townHouseDoors = HOMES.filter(h => !h.villa).map(h => door(h.x, h));
const villaDoors = HOMES.filter(h => h.villa).map(h => door(h.x, h));
let nextTownHouse = 0;
let nextVilla = 0;
function homeFor(info) {
  if (info.home === 'upstairs') return PLACES.get(info.work);
  if (info.home === 'villa') return villaDoors[nextVilla++ % villaDoors.length];
  return townHouseDoors[nextTownHouse++ % townHouseDoors.length];
}

// The sidewalk line a resident keeps to; on the main street's north side
// they keep to the shop side, clear of the bus shelter.
function walkZ(street, side, lane) {
  const inner = street === STREETS[0] && side < 0 ? 0.45 : 0.2;
  return street + side * (ROAD_HALF + inner + lane * 0.3);
}

// Door to door along sidewalks, crossing a street only at a crossing and
// changing streets only by a lane.
function route(a, b, lane) {
  const pts = [a.door.clone()];
  const at = (x, street, side) => pts.push(new THREE.Vector3(x, 0.05, walkZ(street, side, lane)));
  const via = (xs, x0, x1) => xs.reduce((best, x) =>
    (Math.abs(x0 - x) + Math.abs(x - x1) < Math.abs(x0 - best) + Math.abs(best - x1) ? x : best));
  at(a.x, a.street, a.side);
  if (a.street === b.street) {
    if (a.side !== b.side) {
      const x = via(CROSSINGS.get(a.street), a.x, b.x);
      at(x, a.street, a.side);
      at(x, b.street, b.side);
    }
  } else {
    const x = via(ALLEYS, a.x, b.x) + (lane - 0.5) * 0.4;
    const aBlock = BLOCK_SIDE.get(a.street);
    const bBlock = BLOCK_SIDE.get(b.street);
    at(x, a.street, a.side);
    if (a.side !== aBlock) at(x, a.street, aBlock);
    at(x, b.street, bBlock);
    if (b.side !== bBlock) at(x, b.street, b.side);
  }
  at(b.x, b.street, b.side);
  pts.push(b.door.clone());
  return pts;
}

class Resident extends Person {
  constructor(gltf, info) {
    super(gltf, 0);
    this.info = info;
    this.walk = this.action('walk');
    this.walk.play();
    this.lane = rand();
    this.strollDir = rand() < 0.5 ? 1 : -1;
    const home = homeFor(info);
    const stops = info.plan.map(([hour, key]) => [hour, key === 'home' ? home : PLACES.get(key)]);
    // Each leg runs from the previous stop; the first from where yesterday ended.
    // Going upstairs from the shop below is no walk at all.
    this.legs = stops.map(([start, to], i) => {
      const from = stops[(i + stops.length - 1) % stops.length][1];
      const pts = from === to ? [to.door] : route(from, to, this.lane);
      const lengths = pts.slice(1).map((q, k) => q.distanceTo(pts[k]));
      return { start, to, pts, lengths, length: lengths.reduce((a, b) => a + b, 0) };
    });
  }

  speech() {
    return { name: this.info.name, role: this.info.job, line: this.info.say[partOfDay(time)] };
  }

  update(dt) {
    this.walk.timeScale = Math.min(speed / 60, 4);
    this.mixer.update(dt);
    const leg = this.legs.findLast(l => l.start <= time) ?? this.legs.at(-1);
    let walked = ((time - leg.start + 24) % 24) * WALK_SPEED;
    const p = this.obj.position;
    if (walked < leg.length) {
      // On the way: find the segment and the point along it.
      let k = 0;
      while (walked > leg.lengths[k]) walked -= leg.lengths[k++];
      const a = leg.pts[k];
      const b = leg.pts[k + 1];
      p.lerpVectors(a, b, leg.lengths[k] ? walked / leg.lengths[k] : 1);
      this.face(Math.atan2(b.x - a.x, b.z - a.z));
      this.obj.visible = true;
    } else if (leg.to.park) {
      // In the park: laps of the ring path from the entrance.
      const r = PARK.ring + (this.lane - 0.5) * 0.12;
      const angle = -Math.PI / 2 + this.strollDir * (walked - leg.length) / r;
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      p.set(c * r, 0.03, PARK.cz + s * r);
      this.face(Math.atan2(-s * this.strollDir, c * this.strollDir));
      this.obj.visible = true;
    } else {
      this.obj.visible = false;
    }
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
  for (const info of RESIDENTS) walkers.push(new Resident(gltfs[PEOPLE.indexOf(`character-${info.look}`)], info));
  for (const w of walkers) {
    w.obj.visible = w.rank < activity(time);
    if (!w.obj.visible && w.state) w.state = 'away';
  }
}

// ---------- traffic ----------

// Right-hand traffic on both streets: eastbound (+x) in the south lane,
// westbound in the north. The bus runs the main street's westbound lane.
const LANES = STREETS.flatMap(street => [{ z: street - LANE / 2, dir: -1 }, { z: street + LANE / 2, dir: 1 }]);
const CARS = ['sedan', 'taxi', 'suv', 'van', 'hatchback-sports', 'delivery', 'sedan', 'taxi', 'suv',
  'van', 'hatchback-sports', 'sedan', 'truck'];
const PARKED = ['sedan', 'suv', 'van', 'taxi', 'hatchback-sports', 'sedan', 'suv'];
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

// A few riders step off at the front door and walk into the hotel or the
// store, and a guest or two come out to board. Late at night it is quiet.
function unloadBus(bus) {
  if (!peopleGltfs.length) return;
  const door = new THREE.Vector3(bus.x + bus.lane.dir * (BUS_LENGTH / 2 - 0.22), 0.05, -ROAD_HALF - 0.06);
  const pick = () => peopleGltfs[Math.floor(Math.random() * peopleGltfs.length)];
  const late = activity(time) < 0.15;
  const off = late ? Number(Math.random() < 0.4) : 1 + Math.floor(Math.random() * 3);
  const inside = () => (Math.random() < 0.6 ? HOTEL_DOOR : STORE_DOOR);
  for (let i = 0; i < off; i++) walkers.push(new Passenger(pick(), door, inside(), 0.6 + i * 0.9));
  const on = late ? 0 : Math.floor(Math.random() * 3);
  for (let i = 0; i < on; i++) walkers.push(new Passenger(pick(), inside(), door, i * 1.2));
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
    vehicles.push(new Vehicle(group, LANES[i % LANES.length], length, 0.9 + rand() * 0.35, i / cars.length));
  });
  vehicles.push(new Bus(makeBus(wheel, headMat, tailMat), LANES[0]));

  // Parked cars in the car park, lights off.
  const off = std(0x333333);
  const parked = await Promise.all(PARKED.map(n => model('car-kit', n)));
  parked.forEach((gltf, i) => {
    const stall = PARKING_STALLS[(i * 3) % PARKING_STALLS.length];
    const { group } = makeCar(gltf, off, off);
    group.position.set(stall.x, 0.012, stall.z);
    group.rotation.y = stall.rot;
    scene.add(group);
  });
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

// Share of people (and cars) out, by clock hour: busy through the afternoon,
// thinning out from the evening to two or three people in the small hours,
// and picking up again after six.
const ACTIVITY = [[0, 0.12], [1, 0.08], [2, 0.05], [5, 0.05], [6, 0.08], [7, 0.3], [8, 0.6], [9, 0.8],
  [12, 0.9], [15, 1], [18, 0.9], [20, 0.65], [22, 0.35], [23, 0.2], [24, 0.12]];
function activity(t) {
  const i = ACTIVITY.findIndex(([h]) => h > t);
  const [h0, a0] = ACTIVITY[i - 1];
  const [h1, a1] = ACTIVITY[i];
  return a0 + (a1 - a0) * (t - h0) / (h1 - h0);
}

// 0 before a building's lights-out hour, rising to 1 over the half hour after.
// Hours count from noon so that an evening and the night after it compare.
const sinceNoon = h => (h + 12) % 24;
const lightsGone = (t, out) => smooth(sinceNoon(t), sinceNoon(out), sinceNoon(out) + 0.5);

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

  for (const [mat, glow, out, keep = 0] of glowing) {
    const on = out === undefined ? 1 : 1 - (1 - keep) * lightsGone(t, out);
    mat.emissiveIntensity = glow * night * on;
  }
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

// ---------- cats ----------

// Eight cats, each with its own coat, hide around town. Click one to find
// it: it meows, hearts float up and it slips off to another hiding spot.
// Their eyes shine at night, which makes them easier to spot after dark.
const CATS = [
  { name: '橘子', coat: 0xe8913a, patch: 0xfbd3a0, eyes: 0x9be564 },
  { name: '煤球', coat: 0x2a2a2f, patch: 0x2a2a2f, eyes: 0xf5d547 },
  { name: '雪球', coat: 0xf6f3ec, patch: 0xf6f3ec, eyes: 0x6fb7ff },
  { name: '三花', coat: 0xf6f3ec, patch: 0xe8913a, patch2: 0x2a2a2f, muzzle: 0xf6f3ec, eyes: 0xf5b547 },
  { name: '灰灰', coat: 0x8c939d, patch: 0xc3c8cf, eyes: 0xf2c94c },
  { name: '奶茶', coat: 0xeadcc2, patch: 0x5b4032, eyes: 0x5aa7ff, points: true },
  { name: '乳牛', coat: 0xf6f3ec, patch: 0x2a2a2f, muzzle: 0xf6f3ec, ears: 0x2a2a2f, eyes: 0x9be564 },
  { name: '虎斑', coat: 0xa88f6a, patch: 0x5e4a33, muzzle: 0xd8c6a5, eyes: 0x9be564, stripes: true },
];
const CAT_LINES = ['喵～被你找到了！', '（伸懶腰）', '呼嚕呼嚕……', '喵？你看得到我？', '（舔爪子）', '這裡曬太陽最舒服。'];
const CAT_SCALE = 0.8;

// Hiding spots as x, z; the height is wherever a ray from above lands, so
// a spot can be a rooftop, an awning, a car roof or a tree.
const CAT_SPOTS = [
  [-1.72, -2.1], [-2.72, -2.1], [1.72, -2.1], [0.45, -2.6], [2.5, -4.9],
  [-4.55, -9.3], [4.55, -9.3], [-7.2, -9.5], [8.2, -9.4],
  [SHELTER_X, SHELTER_Z], [0.2, -1.47], [GAS.x + 0.3, GAS.z], [PARKING_STALLS[3].x, PARKING_STALLS[3].z],
  [ALLEYS[0], -3.6], [ALLEYS[1], -4.6], [0.53, PARK.cz], [-0.95, PARK.cz + 0.25],
  [3.2, PARK.zMax + 0.6], [-6.5, PARK.zMax + 1.2], [-3.4, PARK.cz + 1.6],
];

const cats = [];
const catSpots = [];

function makeCat(c) {
  const g = new THREE.Group();
  const m = color => std(color, { roughness: 0.8 });
  const coat = m(c.coat);
  const patch = m(c.patch);
  const ends = c.points ? patch : coat;
  // Eyes are dark by day and shine in their own colour at night.
  const eyes = std(0x111111, { emissive: c.eyes, emissiveIntensity: 0 });
  glowing.push([eyes, 3]);
  const part = (w, h, d, mat, x, y, z, parent = g) => box(w, h, d, mat, x, y, z, true, parent);

  part(0.13, 0.055, 0.07, coat, 0, 0.05, 0);
  for (const [x, z] of [[0.045, 0.022], [0.045, -0.022], [-0.045, 0.022], [-0.045, -0.022]]) part(0.016, 0.03, 0.016, ends, x, 0.015, z);
  part(0.06, 0.012, 0.072, patch, -0.01, 0.0775, 0);
  if (c.patch2) part(0.035, 0.013, 0.05, m(c.patch2), 0.035, 0.078, 0.008);
  if (c.stripes) for (const x of [-0.04, 0, 0.04]) part(0.012, 0.058, 0.074, patch, x, 0.05, 0);

  const head = new THREE.Group();
  head.position.set(0.075, 0.085, 0);
  g.add(head);
  part(0.06, 0.055, 0.062, coat, 0.01, 0, 0, head);
  part(0.02, 0.022, 0.036, m(c.muzzle ?? (c.points ? c.patch : c.coat)), 0.04, -0.012, 0, head);
  for (const z of [-0.018, 0.018]) {
    part(0.016, 0.022, 0.014, m(c.ears ?? (c.points ? c.patch : c.coat)), 0.005, 0.036, z, head);
    part(0.004, 0.011, 0.011, eyes, 0.041, 0.008, z * 0.8, head);
  }

  const tail = new THREE.Group();
  tail.position.set(-0.065, 0.065, 0);
  tail.rotation.z = 0.5;
  g.add(tail);
  part(0.012, 0.075, 0.012, c.stripes ? patch : ends, 0, 0.035, 0, tail);
  g.scale.setScalar(CAT_SCALE);
  return { group: g, head, tail };
}

class Cat {
  constructor(info) {
    this.info = info;
    Object.assign(this, makeCat(info));
    this.obj = this.group;
    this.hit = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.22, 0.24).translate(0, 0.09, 0), HIT_MAT);
    this.hit.userData.cat = this;
    this.obj.add(this.hit);
    this.phase = rand() * 10;
    this.bubbleY = 0.16;
    this.poof = 0; // > 0 while shrinking away, < 0 while popping up again
    scene.add(this.obj);
  }

  speech() {
    return { name: this.info.name, role: '貓咪', line: CAT_LINES[Math.floor(Math.random() * CAT_LINES.length)] };
  }

  hideAt(spot) {
    this.spot = spot;
    this.obj.position.copy(spot);
    this.obj.rotation.y = Math.random() * Math.PI * 2;
  }

  // Slip away to a free spot: shrink, move, pop up again.
  sneakOff(delay = 0) {
    if (this.poof) return;
    this.wait = delay;
    this.poof = 0.35;
  }

  update(dt) {
    this.phase += dt;
    this.tail.rotation.x = Math.sin(this.phase * 2.2) * 0.45;
    this.head.rotation.y = Math.sin(this.phase * 0.7) * 0.35;
    let size = 1 + Math.sin(this.phase * 3) * 0.02;
    if (this.wait > 0) {
      this.wait -= dt;
    } else if (this.poof > 0) {
      this.poof = Math.max(0, this.poof - dt);
      size *= this.poof / 0.35;
      if (this.poof === 0) {
        const taken = new Set(cats.map(c => c.spot));
        const free = catSpots.filter(sp => !taken.has(sp));
        this.hideAt(free[Math.floor(Math.random() * free.length)]);
        this.poof = -0.35;
      }
    } else if (this.poof < 0) {
      this.poof = Math.min(0, this.poof + dt);
      size *= 1 + this.poof / 0.35;
    }
    this.obj.scale.setScalar(CAT_SCALE * size);
  }
}

// Where a ray straight down from above lands, ignoring people, cats and
// anything hidden (the cars are still off the road when this runs).
const down = new THREE.Raycaster();
function shown(o) {
  for (; o; o = o.parent) if (!o.visible) return false;
  return true;
}
function surfaceY(x, z) {
  down.set(new THREE.Vector3(x, 20, z), new THREE.Vector3(0, -1, 0));
  const hit = down.intersectObjects(scene.children, true)
    .find(h => h.object.isMesh && !h.object.isSkinnedMesh && h.object.material !== HIT_MAT && shown(h.object));
  return hit ? hit.point.y : 0;
}

// Found cats and the number of finds, kept in this browser.
const CAT_KEY = 'small-town:cats';
let catBook = { found: [], finds: 0 };
try { catBook = { ...catBook, ...JSON.parse(localStorage.getItem(CAT_KEY) || '{}') }; } catch { /* storage unavailable */ }

const hex = c => `#${c.toString(16).padStart(6, '0')}`;
function drawCatBook(fresh) {
  $('cat-count').textContent = `${catBook.found.length}/${CATS.length}`;
  $('cat-row').replaceChildren(...CATS.map(c => {
    const chip = document.createElement('span');
    const found = catBook.found.includes(c.name);
    chip.className = `chip${found ? ' found' : ''}${c.name === fresh ? ' pop' : ''}`;
    chip.textContent = found ? c.name : '?';
    if (found) chip.style.background = `linear-gradient(135deg, ${hex(c.coat)} 55%, ${hex(c.patch2 ?? c.patch)} 55%)`;
    if (found) chip.style.color = [0x2a2a2f, 0x5e4a33, 0xa88f6a, 0x8c939d].includes(c.coat) ? '#fff' : '#1d2230';
    return chip;
  }));
  $('cat-total').textContent = catBook.finds ? `一共找到 ${catBook.finds} 次` : '貓咪躲在小鎮各處，點牠們一下';
}

function findCat(cat) {
  const fresh = !catBook.found.includes(cat.info.name);
  if (fresh) catBook.found.push(cat.info.name);
  catBook.finds++;
  try { localStorage.setItem(CAT_KEY, JSON.stringify(catBook)); } catch { /* storage unavailable */ }
  drawCatBook(fresh ? cat.info.name : null);
  cat.sneakOff(1.6);
}

// Hearts in many colours float up from where the cat was clicked.
const HEART_COLORS = ['#ff6b8b', '#ff9f43', '#ffd93d', '#6bcB77', '#4d96ff', '#c77dff'];
function hearts(x, y) {
  for (let i = 0; i < 7; i++) {
    const h = document.createElement('span');
    h.className = 'heart';
    h.textContent = '❤';
    h.style.left = `${x + (Math.random() - 0.5) * 50}px`;
    h.style.top = `${y - 10}px`;
    h.style.color = HEART_COLORS[i % HEART_COLORS.length];
    h.style.animationDelay = `${i * 60}ms`;
    h.style.setProperty('--drift', `${(Math.random() - 0.5) * 60}px`);
    h.addEventListener('animationend', () => h.remove());
    document.body.append(h);
  }
}

function addCats() {
  // Nothing has been rendered yet, so bring world matrices up to date for the rays.
  scene.updateMatrixWorld(true);
  for (const [x, z] of CAT_SPOTS) catSpots.push(new THREE.Vector3(x, surfaceY(x, z), z));
  const order = [...catSpots].sort(() => Math.random() - 0.5);
  CATS.forEach((info, i) => {
    const cat = new Cat(info);
    cat.hideAt(order[i]);
    cats.push(cat);
  });
  drawCatBook();
}

// Now and then a cat wanders off to somewhere new on its own.
let wanderIn = 45;
function updateCats(dt) {
  for (const cat of cats) cat.update(dt);
  if ((wanderIn -= dt) > 0) return;
  wanderIn = 40 + Math.random() * 50;
  const cat = cats[Math.floor(Math.random() * cats.length)];
  if (cat !== talking) cat.sneakOff();
}

// ---------- talking to people ----------

// A click (not a drag) on someone makes them hop and say a line in a
// bubble that follows them around for a few seconds.
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const bubble = $('bubble');
let talking = null;
let talkUntil = 0;
let downAt = null;

renderer.domElement.addEventListener('pointerdown', e => { downAt = [e.clientX, e.clientY]; });
renderer.domElement.addEventListener('pointerup', e => {
  if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 5) return;
  pointer.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  const targets = [...walkers.filter(w => w.obj.visible), ...cats.filter(c => !c.poof)].map(w => w.hit);
  const hit = raycaster.intersectObjects(targets, false)[0];
  if (!hit) return;
  const person = hit.object.userData.person ?? hit.object.userData.cat;
  if (hit.object.userData.cat) {
    findCat(person);
    hearts(e.clientX, e.clientY);
  }
  const { name, role, line } = person.speech();
  bubble.querySelector('b').textContent = name;
  bubble.querySelector('span').textContent = role;
  bubble.querySelector('p').textContent = line;
  bubble.hidden = false;
  talking = person;
  talkUntil = performance.now() + 5000;
  if (person instanceof Person) person.hop = HOP;
});

const HOP = 0.45;
const head = new THREE.Vector3();

function updateTalk(dt) {
  for (const w of walkers) {
    if (w.hop <= 0) continue;
    w.hop = Math.max(0, w.hop - dt);
    // Squash and stretch: a quick boing on the spot.
    const k = Math.sin((1 - w.hop / HOP) * Math.PI * 2) * 0.18 * (w.hop / HOP);
    w.obj.scale.set(PERSON_SCALE * (1 - k), PERSON_SCALE * (1 + k), PERSON_SCALE * (1 - k));
  }
  if (!talking) return;
  // A found cat keeps its bubble while it lingers, and loses it as it slips away.
  if (performance.now() > talkUntil || !talking.obj.visible || (talking.poof > 0 && !(talking.wait > 0))) {
    bubble.hidden = true;
    talking = null;
    return;
  }
  head.copy(talking.obj.position).y += talking.bubbleY ?? 0.32;
  head.project(camera);
  bubble.style.left = `${(head.x + 1) / 2 * innerWidth}px`;
  bubble.style.top = `${(1 - head.y) / 2 * innerHeight}px`;
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
  updateCats(dt);
  updateTalk(dt);
  controls.update();
  updateUI();
  composer.render();
  requestAnimationFrame(frame);
}

await Promise.all([buildTown(), addPeople(), addTraffic()]);
addCats();
$('loading').classList.add('done');
frame();
