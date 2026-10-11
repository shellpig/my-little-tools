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
import { createWishes, patchSnow, BLESSINGS, RARITY } from './wishes.js';
import { createWardrobe, PARTS, ACCESSORIES } from './wardrobe.js';

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
controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
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

// What the player can walk into: footprints (boxes in x/z) and round posts.
const solids = [];
const posts = [];
const solid = (x, z, hw, hd) => solids.push({ minX: x - hw, maxX: x + hw, minZ: z - hd, maxZ: z + hd });
const post = (x, z, r) => posts.push({ x, z, r });
function solidOf(obj) {
  const b = new THREE.Box3().setFromObject(obj);
  solids.push({ minX: b.min.x + 0.02, maxX: b.max.x - 0.02, minZ: b.min.z + 0.02, maxZ: b.max.z - 0.02 });
  obj.userData.solid = solids.at(-1);
  return obj;
}

// What a builder adds to the scene, and the footprints and posts it sets
// down, so they can be moved together later.
function collect(fn) {
  const [c0, s0, p0] = [scene.children.length, solids.length, posts.length];
  fn();
  return { parts: scene.children.slice(c0), solids: solids.slice(s0), posts: posts.slice(p0) };
}

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
  // Suburban roofs are also blue; only the glass swatch family emits light.
  if (pack === 'suburban') return { map: paletteTexture(src), emissiveMap: swatchMask(320, 128, 64, 128) };
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

// An emissive map that lights a specific palette region.
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

// The commercial palette with its wall swatch in a pastel instead of white.
const PASTELS = [['#c2dcf4', '#a2bedb'], ['#c6e8bd', '#a5cb9b'], ['#f6e4a2', '#dbc781']];
function pastel(textures, [top, bottom]) {
  const c = document.createElement('canvas');
  c.width = textures.map.image.width;
  c.height = textures.map.image.height;
  const ctx = c.getContext('2d');
  ctx.drawImage(textures.map.image, 0, 0);
  const [x, y, w, h] = REPAINT.commercial[0];
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  return { ...textures, map: paletteTexture(c) };
}

// Palettes and shared materials from building the town, kept for adding to it.
const kit = {};

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
    .then(obj => solidOf(alignFront(obj, row.front, row.facing)));
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
  return g;
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
// The sit pose rests the thighs about SIT_DROP below a person's origin, so a
// sitter's origin goes that far above the seat.
const SIT_DROP = 0.014;
const SHELTER_SEATS = [-0.1, 0.1].map(dx => ({ position: new THREE.Vector3(SHELTER_X + dx, 0.106 + SIT_DROP, SHELTER_Z - 0.005), rotation: 0 }));

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
  for (const x of [-0.34, 0.34]) {
    box(0.02, 0.31, 0.02, canopy, x, 0.2, front + 0.32, true);
    post(x, front + 0.32, 0.03);
  }
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
  solid(SHELTER_X, SHELTER_Z - 0.02, 0.33, 0.1);
  post(SHELTER_X - 0.42, -ROAD_HALF - 0.08, 0.03);

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
    position: new THREE.Vector3(x + Math.cos(rotation) * offset + Math.sin(rotation) * 0.02, 0.097 + SIT_DROP,
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
  post(x, z, 0.15);
}

function parkLamp(x, z, bulbMat) {
  const iron = std(0x2c2f35, { roughness: 0.5, metalness: 0.5 });
  cylinder(0.012, 0.016, 0.34, iron, x, 0.19, z, 8);
  post(x, z, 0.03);
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

// Filled in by buildPark for the wishing fountain.
const fountain = {};

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
  const spout = cylinder(0.025, 0.04, 0.1, water, 0, 0.36, cz, 10);
  Object.assign(fountain, { water, spout, spoutY: spout.position.y });
  fountain.hit = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.5, 16), HIT_MAT);
  fountain.hit.position.set(0, 0.25, cz);
  fountain.hit.userData.fountain = true;
  scene.add(fountain.hit);
  post(0, cz, 0.6);

  for (let i = 0; i < benchSeats.length; i += 2) {
    const { x, z, rotation } = benchSeats[i].bench;
    bench(x, z, rotation);
  }

  const bulbMat = std(0x222222, { emissive: 0xffe0b0, emissiveIntensity: 0 });
  glowing.push([bulbMat, 3]);
  [[-0.32, zMin + 0.15], [0.32, zMin + 0.15], [-(ring + 0.3), cz + 0.3], [ring + 0.3, cz - 0.3], [0.3, cz + ring + 0.3]].forEach(([x, z], i) => {
    const c = collect(() => parkLamp(x, z, bulbMat));
    editable(`park-lamp:${i}`, c.parts, c);
  });

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
    if (Math.abs(x) > 0.4) {
      jobs.push(place('suburban', 'fence', { x, z: zMin, mat: fenceMat }));
      solid(x, zMin, 0.24, 0.05);
    }
    jobs.push(place('suburban', 'fence', { x, z: zMax, mat: fenceMat }));
    solid(x, zMax, 0.24, 0.05);
  }
  for (let z = zMin + 0.24; z < zMax; z += 0.48) {
    if (Math.abs(z - cz) < 0.3) continue;
    for (const side of [-1, 1]) {
      jobs.push(place('suburban', 'fence', { x: side * xHalf, z, rot: Math.PI / 2, mat: fenceMat }));
      solid(side * xHalf, z, 0.05, 0.24);
    }
  }
  for (const x of [-0.62, 0.62]) {
    jobs.push(place('suburban', 'planter', { x, z: zMin - 0.12, mat: plantMat }));
    solid(x, zMin - 0.12, 0.2, 0.15);
  }

  // Trees: dense inside the park away from the paths, sparser outside it.
  let trees = 0;
  const tree = (x, z) => {
    const id = `tree:${trees++}`;
    const c = collect(() => post(x, z, 0.1));
    jobs.push(place('suburban', rand() < 0.5 ? 'tree-large' : 'tree-small',
      { x, z, rot: rand() * 6, scale: 1 + rand() * 0.5, mat: plantMat }).then(obj => editable(id, [obj], c)));
  };
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
  // About one town house in four has pastel walls.
  const pastels = PASTELS.map(p => pastel(commercial, p));
  Object.assign(kit, { commercial, suburban, pastels, plantMat: houseMat, roadMat });
  const townHouseMat = i => paletteMaterial(i % 7 === 2 || i % 7 === 5 ? pastels[i % 3] : commercial,
    [1.4, 0.7, 2.2][Math.floor(rand() * 3)], bedtime(21.5, 2.5), rand() * 0.15);
  const villaMat = () => paletteMaterial(suburban, 0.9 + rand() * 0.6, bedtime(21, 1), rand() * 0.1);

  // Ground, then each street's sidewalks, curbs and road.
  box(120, 0.1, 120, std(0x667a52), 0, -0.05, 0);
  Object.assign(kit, { pavement: std(0xb3ada3), curb: std(0xd2ccc0) });
  paveSidewalks();
  // The streets' road surface is drawn with the painted roads.
  const jobs = [drawTiles()];
  buildAlleys();

  // The hotel in the middle; the bus stop is outside the convenience store.
  jobs.push(place('commercial', HOTEL.model, { x: 0, mat: paletteMaterial(commercial, 0.6, 0.5, 0.3) }).then(obj => {
    const c = collect(() => decorateHotel(solidOf(alignFront(obj))));
    editable('hotel', [obj, ...c.parts], { ...c, points: [HOTEL_DOOR] });
  }));
  buildBusStop();

  // Shops and public buildings, each with a sign and the shops with awnings.
  for (const shop of [...SHOPS, ...CIVIC]) {
    const mat = paletteMaterial(commercial, shop.glow, shop.closes);
    jobs.push(building('commercial', shop.model, shop.x, shop, mat).then(obj => {
      const c = collect(() => decorateShop(obj, shop));
      editable(`shop:${shop.name}`, [obj, ...c.parts], {
        solids: [obj.userData.solid], places: [PLACES.get(shop.name)], points: shop.name === '便利商店' ? [STORE_DOOR] : [],
      });
    }));
  }

  // Homes fill the rest of the rows.
  const townHouses = ['building-b', 'building-d', 'building-f', 'building-g'];
  const villas = ['building-type-a', 'building-type-c', 'building-type-e', 'building-type-g'];
  HOMES.forEach((home, i) => {
    const made = home.villa
      ? building('suburban', villas[i % villas.length], home.x, home, villaMat())
      : building('commercial', home.x === 0 ? 'building-e' : townHouses[i % 4], home.x, home, townHouseMat(i));
    jobs.push(made.then(obj => editable(`home:${i}`, [obj], { solids: [obj.userData.solid], places: [homeDoors[i]] })));
  });

  // South of the main street: the park, with a gas station and a car park either side.
  buildPark(jobs, houseMat);
  buildGasStation();
  buildParkingLot();

  // Street lamps on both streets, with a real light under each head.
  kit.bulbMat = std(0x222222, { emissive: 0xffd9a0, emissiveIntensity: 0 });
  glowing.push([kit.bulbMat, 6]);
  const LAMPS = [
    [STREETS[0], [[-3.3, -1], [-1.25, -1], [2.75, -1], [7.8, -1], [-7.8, -1], [-7.8, 1], [-2.3, 1], [1.3, 1], [4.8, 1], [8, 1]]],
    [STREETS[1], [[-3.1, 1], [2.0, 1], [-1.1, -1], [3.1, -1], [-10.15, -1], [10.45, -1]]],
  ];
  let lampCount = 0;
  for (const [street, spots] of LAMPS) {
    for (const [x, side] of spots) jobs.push(streetLamp(`lamp:${lampCount++}`, x, street + side * (ROAD_HALF + 0.12), side));
  }

  await Promise.all(jobs);
}

// A street lamp with a real light under its head, which hangs toward −z
// (side +1) or +z (side −1). The curved one stands a little taller.
function streetLamp(id, x, z, side, model = 'light-square') {
  const c = collect(() => {
    post(x, z, 0.04);
    const head = new THREE.Vector3(x, model === 'light-curved' ? 0.64 : 0.57, z - side * 0.19);
    box(0.06, 0.015, 0.06, kit.bulbMat, head.x, head.y, head.z);
    const light = new THREE.PointLight(0xffbe7a, 0, 3.2, 1.6);
    light.position.copy(head).y -= 0.04;
    scene.add(light);
    lamps.push(light);
  });
  return place('roads', model, { x, z, rot: side < 0 ? Math.PI : 0, mat: kit.roadMat })
    .then(obj => editable(id, [obj, ...c.parts], c));
}

// The two lanes: paved strips between the streets and on beyond them. Their
// zebra crossings are drawn with the painted ones (see paving).
function buildAlleys() {
  const paving = std(0x9d978c);
  const spans = [
    [BACK_SOUTH.front, MAIN_NORTH.front],
    [MAIN_SOUTH.front, PARK.zMax + 1],
    [BACK_NORTH.front - 3, BACK_NORTH.front],
  ];
  for (const x of ALLEYS) {
    for (const [z0, z1] of spans) box(ALLEY_HALF * 2, 0.02, z1 - z0, paving, x, 0.01, (z0 + z1) / 2);
  }
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
  post(x, z, 0.04);
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
  for (const dx of [-0.85, 0.85]) {
    for (const dz of [-0.4, 0.4]) {
      box(0.04, 0.45, 0.04, grey, cx + dx, 0.225, z + dz, true);
      post(cx + dx, z + dz, 0.04);
    }
  }
  for (const dx of [-0.4, 0.4]) {
    box(0.22, 0.03, 0.14, grey, cx + dx, 0.015, z);
    box(0.12, 0.22, 0.1, red, cx + dx, 0.14, z, true);
    solid(cx + dx, z, 0.11, 0.07);
    box(0.08, 0.05, 0.005, light, cx + dx, 0.2, z - 0.053);
  }

  // Kiosk at the back, its window toward the street.
  box(0.9, 0.36, 0.55, white, x - 1.1, 0.18, z + 0.7, true);
  solid(x - 1.1, z + 0.7, 0.45, 0.275);
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
const crossingsAt = street => zebras.filter(zb => !zb.ns && zb.z === street).map(zb => zb.x);

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
const homeDoors = HOMES.map(h => door(h.x, h));
const townHouseDoors = homeDoors.filter((_, i) => !HOMES[i].villa);
const villaDoors = homeDoors.filter((_, i) => HOMES[i].villa);
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

// Door to door along sidewalks, crossing a street at a zebra crossing (or
// straight over where it has none) and changing streets only by a lane.
function route(a, b, lane) {
  const pts = [a.door.clone()];
  const at = (x, street, side) => pts.push(new THREE.Vector3(x, 0.05, walkZ(street, side, lane)));
  const via = (xs, x0, x1) => xs.reduce((best, x) =>
    (Math.abs(x0 - x) + Math.abs(x - x1) < Math.abs(x0 - best) + Math.abs(best - x1) ? x : best));
  at(a.x, a.street, a.side);
  if (a.street === b.street) {
    if (a.side !== b.side) {
      const xs = crossingsAt(a.street);
      const x = xs.length ? via(xs, a.x, b.x) : a.x;
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
    this.home = homeFor(info);
    this.plan();
  }

  // Each leg runs from the previous stop; the first from where yesterday ended.
  // Going upstairs from the shop below is no walk at all. A stop whose
  // building has been removed is spent at home instead.
  plan() {
    const stops = this.info.plan.map(([hour, key]) => {
      const to = key === 'home' ? this.home : PLACES.get(key);
      return [hour, to.removed ? this.home : to];
    });
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

// Cars drive the road network: every column of the two streets and every
// painted road cell is a node, and a car crosses each node on a curve from
// the side it came in by to the side it leaves by, keeping right. At a
// junction it picks a way at random, mostly straight on, and turns back at a
// dead end. Only one car is in a junction at a time. Cars come in out of the
// fog at either end of the streets and leave past their last column. The bus
// runs the main street westbound.
const CARS = ['sedan', 'taxi', 'suv', 'van', 'hatchback-sports', 'delivery', 'sedan', 'taxi', 'suv',
  'van', 'hatchback-sports', 'sedan', 'truck'];
const PARKED = ['sedan', 'suv', 'van', 'taxi', 'hatchback-sports', 'sedan', 'suv'];
const CAR_SCALE = 0.2;
const BUS_LENGTH = 1.3;
const BUS_WIDTH = 0.32;
const BUS_DWELL = 7;
const STREET_ENTRY = 7; // street column where cars come in, at the edge of the fog
const LOOK_AHEAD = 2.5;
const JUNCTION_RUN = 4; // most junctions in a row a car claims at once
const vehicles = [];
const roads = new Map(); // node key → { key, x, z, hx, hz, links: side → key | 'exit', holder }
const paths = new Map(); // "key,from,to" → curve across that node

// The unit step toward a side, and the side across from it.
const dirOf = side => (side === NORTH ? [0, -1] : side === EAST ? [1, 0] : side === SOUTH ? [0, 1] : [-1, 0]);
const opposite = side => quarter(quarter(side));
const isJunction = node => node.links.size !== 2;

// Called whenever the painted roads change. A car whose node is gone leaves;
// the rest finish the curve they are on and plan again from there.
function buildRoads() {
  roads.clear();
  paths.clear();
  const node = (key, x, z, hx, hz) => roads.set(key, { key, x, z, hx, hz, links: new Map(), holder: null });
  const link = (a, side, b) => {
    roads.get(a).links.set(side, b);
    roads.get(b).links.set(opposite(side), a);
  };
  STREETS.forEach((street, k) => {
    const [lo, hi] = streetSpan(k);
    for (let i = lo; i <= hi; i++) {
      node(`s${k},${i}`, i * CELL, street, ROAD_HALF, ROAD_HALF);
      if (i > lo) link(`s${k},${i - 1}`, EAST, `s${k},${i}`);
    }
    roads.get(`s${k},${lo}`).links.set(WEST, 'exit');
    roads.get(`s${k},${hi}`).links.set(EAST, 'exit');
  });
  const cells = gridCells().filter(([, , kind]) => kind === 'road');
  for (const [i, j] of cells) {
    const z = j * CELL;
    if (!halfCell(j)) {
      node(cellKey(i, j), i * CELL, z, ROAD_HALF, ROAD_HALF);
      continue;
    }
    // A stub from the street's edge to the cell's far edge.
    const s = STREETS.reduce((a, b) => (Math.abs(z - b) < Math.abs(z - a) ? b : a));
    const near = s + Math.sign(z - s) * ROAD_HALF;
    const far = z + Math.sign(z - s) * ROAD_HALF;
    node(cellKey(i, j), i * CELL, (near + far) / 2, ROAD_HALF, Math.abs(far - near) / 2);
  }
  for (const [i, j] of cells) {
    const key = cellKey(i, j);
    const z = j * CELL;
    if (!halfCell(j) && roads.has(cellKey(i + 1, j))) link(key, EAST, cellKey(i + 1, j));
    for (const [side, edge] of [[NORTH, z - ROAD_HALF], [SOUTH, z + ROAD_HALF]]) {
      const k = STREETS.findIndex(s => Math.abs(edge - s) <= ROAD_HALF + 1e-6);
      if (k >= 0) {
        if (roads.has(`s${k},${i}`)) link(key, side, `s${k},${i}`);
      } else if (side === SOUTH && roads.has(cellKey(i, j + 1))) {
        link(key, SOUTH, cellKey(i, j + 1));
      }
    }
  }
  for (const v of vehicles) if (v.onRoad) v.replan();
}

// The curve across a node: in at the right-hand half of one side, out at the
// right-hand half of another (or the same side, turning back).
function pathThrough(node, from, to) {
  const id = `${node.key},${from},${to}`;
  if (paths.has(id)) return paths.get(id);
  const [dx, dz] = dirOf(opposite(from));
  const [ex, ez] = dirOf(to);
  const reach = (x, z) => Math.abs(x) * node.hx + Math.abs(z) * node.hz;
  const a = new THREE.Vector3(node.x - dx * reach(dx, dz) - dz * LANE / 2, 0.02, node.z - dz * reach(dx, dz) + dx * LANE / 2);
  const b = new THREE.Vector3(node.x + ex * reach(ex, ez) - ez * LANE / 2, 0.02, node.z + ez * reach(ex, ez) + ex * LANE / 2);
  let curve;
  if (to === opposite(from)) {
    curve = new THREE.LineCurve3(a, b);
  } else {
    const k = reach(dx, dz) * (to === from ? 1.3 : 0.55);
    curve = new THREE.CubicBezierCurve3(a, a.clone().add(new THREE.Vector3(dx * k, 0, dz * k)),
      b.clone().sub(new THREE.Vector3(ex * k, 0, ez * k)), b);
  }
  curve.len = curve.getLength();
  paths.set(id, curve);
  return curve;
}

// Vehicles are built facing +z and turned to the way they are going.
class Vehicle {
  constructor(obj, length, cruise, rank) {
    Object.assign(this, { obj, length, cruise, rank });
    this.speed = 0;
    this.onRoad = false;
    this.cooldown = rand() * 8;
    this.pos = new THREE.Vector3();
    this.heading = new THREE.Vector3(0, 0, 1);
    this.path = []; // the node it is on, then the ones it has chosen next
    this.held = []; // junctions it has claimed
    obj.visible = false;
    scene.add(obj);
  }

  desiredSpeed() { return this.cruise; }

  // Mostly straight on; back the way it came at a dead end.
  chooseExit(node, from) {
    const ways = [...node.links.keys()].filter(s => s !== from);
    if (!ways.length) return from;
    const weights = ways.map(s => (s === opposite(from) ? 4 : 1));
    let r = Math.random() * weights.reduce((a, b) => a + b, 0);
    return ways.find((_, i) => (r -= weights[i]) < 0) ?? ways.at(-1);
  }

  step(node, from) {
    const to = this.chooseExit(node, from);
    return { node, from, to, curve: pathThrough(node, from, to) };
  }

  // Choose the node after the last one planned.
  extend() {
    const last = this.path.at(-1);
    if (last.exit) return;
    const next = roads.get(last.node.links.get(last.to));
    this.path.push(next ? this.step(next, opposite(last.to)) : { exit: true });
  }

  // Into a junction only when it is free, together with the junctions right
  // after it, so two cars never wait on each other inside.
  claim() {
    const want = [];
    for (let k = 1; want.length < JUNCTION_RUN; k++) {
      if (k >= this.path.length) this.extend();
      const seg = this.path[k];
      if (seg.exit || !isJunction(seg.node)) break;
      want.push(seg.node);
    }
    if (want.some(n => n.holder && n.holder !== this)) return false;
    for (const n of want) n.holder = this;
    this.held.push(...want);
    return true;
  }

  enter(key, from) {
    const node = roads.get(key);
    this.onRoad = true;
    this.obj.visible = true;
    this.path = [this.step(node, from)];
    this.held = [];
    if (isJunction(node)) {
      node.holder = this;
      this.held.push(node);
    }
    this.s = 0;
    this.speed = this.cruise;
    this.place();
  }

  leave() {
    for (const n of this.held) if (n.holder === this) n.holder = null;
    this.held = [];
    this.onRoad = false;
    this.obj.visible = false;
    this.cooldown = 1 + Math.random() * 6;
  }

  // The roads were redrawn: keep the curve it is on, choose again after it.
  replan() {
    const seg = this.path[0];
    const node = roads.get(seg.node.key);
    if (!node) return this.leave();
    this.path = [{ ...seg, node }];
    this.held = [];
    if (isJunction(node) && !node.holder) {
      node.holder = this;
      this.held.push(node);
    }
  }

  place() {
    const { curve } = this.path[0];
    const u = Math.min(this.s / curve.len, 1);
    curve.getPointAt(u, this.pos);
    curve.getTangentAt(u, this.heading);
    this.obj.position.copy(this.pos);
    this.obj.rotation.y = Math.atan2(this.heading.x, this.heading.z);
  }

  // Keep a gap to whatever is in the cone ahead: cars, people in the road,
  // a crossing someone is on, and a junction it can't have yet.
  drive(dt, people, busy) {
    let target = this.desiredSpeed(dt);
    const brake = gap => { target = Math.min(target, Math.max(0, gap)); };
    const h = this.heading;
    const ahead = p => {
      const rx = p.x - this.pos.x;
      const rz = p.z - this.pos.z;
      const along = rx * h.x + rz * h.z;
      return along > 0 && along < LOOK_AHEAD && Math.abs(rx * h.z - rz * h.x) < 0.2 + along * 0.08 ? along : null;
    };
    let queued = Infinity; // how far ahead the nearest car is
    for (const o of vehicles) {
      if (o === this || !o.onRoad) continue;
      const along = ahead(o.pos);
      if (along === null) continue;
      brake((along - (this.length + o.length) / 2 - 0.15) * 1.2);
      queued = Math.min(queued, along - o.length / 2);
    }
    for (const p of people) {
      const along = ahead(p);
      if (along !== null) brake((along - this.length / 2 - 0.12) * 1.5);
    }
    for (const zb of busy) {
      // Only a crossing over the road this car is on.
      if (zb.ns ? Math.abs(h.z) < 0.7 : Math.abs(h.x) < 0.7) continue;
      const rx = zb.x - this.pos.x;
      const rz = zb.z - this.pos.z;
      if (Math.abs(rx * h.z - rz * h.x) > ROAD_HALF) continue;
      const gap = rx * h.x + rz * h.z - zb.w / 2 - this.length / 2 - 0.08;
      if (gap > -0.05 && gap < LOOK_AHEAD) brake(gap * 1.5);
    }
    if (this.path.length < 2) this.extend();
    const seg = this.path[0];
    const next = this.path[1];
    // Claim it only at the front of the queue, close to the junction.
    const toJunction = seg.curve.len - this.s;
    const blocked = !next.exit && isJunction(next.node) && !this.held.includes(next.node)
      && (queued < toJunction || toJunction - this.length / 2 > 0.8 || !this.claim());
    if (blocked) brake((seg.curve.len - this.s - this.length / 2 - 0.05) * 1.2);

    this.speed += THREE.MathUtils.clamp(target - this.speed, -1.5 * dt, 0.5 * dt);
    this.s += this.speed * dt;
    if (blocked) this.s = Math.min(this.s, seg.curve.len - 1e-3);
    while (this.s >= this.path[0].curve.len) {
      const done = this.path.shift();
      this.s -= done.curve.len;
      if (done.node.holder === this) done.node.holder = null;
      this.held = this.held.filter(n => n !== done.node);
      if (this.path[0].exit) return this.leave();
      if (this.path.length < 2) this.extend();
    }
    this.place();
  }
}

class Bus extends Vehicle {
  constructor(obj) {
    super(obj, BUS_LENGTH, 0.8, 0);
    this.cooldown = 2;
  }

  chooseExit(node, from) { return opposite(from); }

  enter(key, from) {
    super.enter(key, from);
    this.state = 'arriving';
  }

  leave() {
    super.leave();
    this.cooldown = 12 + Math.random() * 8;
  }

  desiredSpeed(dt) {
    if (this.state === 'arriving') {
      const left = this.pos.x - STOP_X;
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
  const door = new THREE.Vector3(bus.pos.x + bus.heading.x * (BUS_LENGTH / 2 - 0.22), 0.05, -ROAD_HALF - 0.06);
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
    vehicles.push(new Vehicle(group, length, 0.9 + rand() * 0.35, i / cars.length));
  });
  vehicles.push(new Bus(makeBus(wheel, headMat, tailMat)));

  // Parked cars in the car park, lights off.
  const off = std(0x333333);
  const parked = await Promise.all(PARKED.map(n => model('car-kit', n)));
  parked.forEach((gltf, i) => {
    const stall = PARKING_STALLS[(i * 3) % PARKING_STALLS.length];
    const { group } = makeCar(gltf, off, off);
    group.position.set(stall.x, 0.012, stall.z);
    group.rotation.y = stall.rot;
    scene.add(group);
    solid(stall.x, stall.z, 0.16, 0.27);
  });
}

// Waiting vehicles come in at either end of a street once the way in is
// clear; the bus always at the main street's east end.
function updateTraffic(dt, activity) {
  const people = walkers.filter(w => w.obj.visible).map(w => w.obj.position);
  if (player.active) people.push(player.pos);
  const busy = zebras.filter(zb => people.some(p => onZebra(zb, p)));
  for (const v of vehicles) {
    if (v.onRoad) v.drive(dt, people, busy);
    else v.cooldown -= dt;
  }
  const entries = STREETS.flatMap((_, k) => [[`s${k},${-STREET_ENTRY}`, WEST], [`s${k},${STREET_ENTRY}`, EAST]]);
  for (const v of vehicles) {
    if (v.onRoad || v.cooldown > 0 || v.rank >= activity) continue;
    const ways = v instanceof Bus ? [[`s0,${STREET_ENTRY}`, EAST]] : [...entries].sort(() => Math.random() - 0.5);
    const way = ways.find(([key, from]) => {
      const node = roads.get(key);
      if (!node || node.holder) return false;
      const start = pathThrough(node, from, opposite(from)).getPoint(0);
      return vehicles.every(o => !o.onRoad || o.pos.distanceTo(start) > (o.length + v.length) / 2 + 0.6);
    });
    if (way) v.enter(...way);
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
// Dawn has no orange: the dark sky greys and pales into day.
const SKY_DAWN = new THREE.Color(0xb7c3d6);
const SUN_LOW = new THREE.Color(0xffa060);
const SUN_DAWN = new THREE.Color(0xdde4f0);
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
  const morning = t < 12;

  // The same light is the sun by day and the moon by night.
  if (elevation >= 0) {
    lightDir.set(Math.cos(angle), Math.max(elevation, 0.12), 0.6);
    sun.intensity = 3 * smooth(elevation, -0.05, 0.3);
    sun.color.lerpColors(morning ? SUN_DAWN : SUN_LOW, SUN_HIGH, smooth(elevation, 0, 0.45));
  } else {
    lightDir.set(-Math.cos(angle), Math.max(-elevation, 0.12), 0.6);
    sun.intensity = 0.45 * smooth(-elevation, 0, 0.3);
    sun.color.copy(MOON);
  }
  sun.position.copy(lightDir.normalize().multiplyScalar(30));

  hemi.intensity = 0.3 + 0.7 * day;
  hemi.color.setHex(0x3c4a7a).lerp(new THREE.Color(0xcfe2ff), day);
  hemi.groundColor.setHex(0x12121a).lerp(new THREE.Color(0x4a4234), day);

  sky.copy(SKY_NIGHT).lerp(SKY_DAY, day).lerp(morning ? SKY_DAWN : SKY_DUSK, dusk * (morning ? 0.35 : 0.55));
  scene.background = sky;
  scene.fog.color.copy(sky);

  for (const [mat, glow, out, keep = 0] of glowing) {
    const on = out === undefined ? 1 : 1 - (1 - keep) * lightsGone(t, out);
    mat.emissiveIntensity = glow * night * on + (mat.userData.boost ?? 0);
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
  if (e.target instanceof HTMLInputElement) return;
  if (e.code === 'KeyH') setCollapsed(!panel.classList.contains('collapsed'));
  // While walking about, space jumps instead.
  if (e.code !== 'Space' || (player.active && closet.hidden)) return;
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

// The town book: found cats, the number of finds, blessings seen and
// coins thrown, kept in this browser.
const CAT_KEY = 'small-town:cats';
let catBook = { found: [], finds: 0, blessings: [], coins: 0 };
try { catBook = { ...catBook, ...JSON.parse(localStorage.getItem(CAT_KEY) || '{}') }; } catch { /* storage unavailable */ }

const hex = c => `#${c.toString(16).padStart(6, '0')}`;
function saveBook() {
  try { localStorage.setItem(CAT_KEY, JSON.stringify(catBook)); } catch { /* storage unavailable */ }
}
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
  $('wish-count').textContent = `${catBook.blessings.length}/${BLESSINGS.length}`;
  $('wish-row').replaceChildren(...BLESSINGS.map(b => {
    const chip = document.createElement('span');
    const seen = catBook.blessings.includes(b.id);
    chip.className = `chip${seen ? ' found' : ''}${b.id === fresh ? ' pop' : ''}`;
    chip.textContent = seen ? b.icon : '?';
    chip.title = seen ? `${b.name}：${b.desc}` : '在噴水池許願';
    if (seen) chip.style.background = RARITY[b.rarity].color;
    if (seen) chip.style.color = '#1d2230';
    return chip;
  }));
  const parts = [];
  if (catBook.finds) parts.push(`找到貓 ${catBook.finds} 次`);
  if (catBook.coins) parts.push(`許願 ${catBook.coins} 次`);
  $('cat-total').textContent = parts.length ? parts.join('・') : '貓咪躲在小鎮各處；點噴水池可以許願';
}

function findCat(cat) {
  const fresh = !catBook.found.includes(cat.info.name);
  if (fresh) catBook.found.push(cat.info.name);
  catBook.finds++;
  saveBook();
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

// ---------- wishing fountain ----------

let crowdBoost = 0;
let wishes;
const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.3);
let pointerOnGround = null;

// The fountain speaks for the coin: a plain wish, or the blessing it brought.
const fountainVoice = { obj: { position: new THREE.Vector3(0, 0.1, PARK.cz), visible: true }, bubbleY: 0.6 };

function wishResult({ line, blessing }) {
  catBook.coins++;
  let fresh = null;
  if (blessing && !catBook.blessings.includes(blessing.id)) {
    catBook.blessings.push(blessing.id);
    fresh = blessing.id;
  }
  saveBook();
  drawCatBook(fresh);
  const rarity = blessing && RARITY[blessing.rarity];
  talk(fountainVoice, { name: blessing ? `✨ ${blessing.name}` : '許願池', role: rarity ? rarity.label : '', line });
  if (blessing) announce(`${rarity.label}・${blessing.name}`, rarity.color);
}

let bannerTimer = 0;
function announce(text, color) {
  const banner = $('banner');
  banner.textContent = `✨ ${text}`;
  banner.style.setProperty('--glow', color);
  banner.classList.remove('show');
  void banner.offsetWidth;
  banner.classList.add('show');
  clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => banner.classList.remove('show'), 3500);
}

function addWishes() {
  patchSnow(scene);
  wishes = createWishes({
    scene,
    camera,
    park: PARK,
    fountain,
    getTime: () => time,
    setCrowdBoost: v => { crowdBoost = v; },
    pointerGround: () => pointerOnGround,
    streets: { back: STREETS[1], alleys: ALLEYS },
  });
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

function talk(speaker, { name, role, line }) {
  bubble.querySelector('b').textContent = name;
  bubble.querySelector('span').textContent = role;
  bubble.querySelector('p').textContent = line;
  bubble.hidden = false;
  talking = speaker;
  talkUntil = performance.now() + 5000;
}

function aim(e) {
  pointer.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
}

renderer.domElement.addEventListener('pointermove', e => {
  aim(e);
  pointerOnGround = raycaster.ray.intersectPlane(groundPlane, new THREE.Vector3());
});
renderer.domElement.addEventListener('pointerdown', e => { downAt = [e.clientX, e.clientY]; });
renderer.domElement.addEventListener('pointerup', e => {
  if (editing || e.button !== 0 || !downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 5) return;
  aim(e);
  const targets = [
    ...wishes.clickables(),
    ...[...walkers.filter(w => w.obj.visible), ...cats.filter(c => !c.poof)].map(w => w.hit),
    fountain.hit,
  ];
  const hit = raycaster.intersectObjects(targets, false)[0];
  if (!hit) return;
  const data = hit.object.userData;
  if (data.onClick) return data.onClick();
  if (data.fountain) {
    // One coin in the air at a time.
    if (!wishes.flying()) wishes.throwCoin(wishResult);
    return;
  }
  const speaker = data.person ?? data.cat;
  if (data.cat) {
    findCat(speaker);
    hearts(e.clientX, e.clientY);
  }
  talk(speaker, speaker.speech());
  if (speaker instanceof Person) speaker.hop = HOP;
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

// ---------- playing a townsperson ----------

// Walk the town as one of the townspeople. The camera keeps following
// from behind and above and can still be turned and zoomed; movement is
// relative to where it looks. Touch screens get a stick and an action button.
const PLAYER_KEY = 'small-town:player';
const PLAYER_R = 0.09;
const WALK = 0.825;
const RUN = 1.25;
const JUMP_SPEED = 1.6;
const GRAVITY = 6;
const BOUNDS = { minX: -12.5, maxX: 12.5, minZ: BACK_NORTH.front - 2.8, maxZ: PARK.zMax + 3 };
const player = { active: false, look: 'male-f', name: '', outfit: {}, pos: new THREE.Vector3(0.6, 0, MAIN_SOUTH.front - 0.35), obj: null, air: 0, vy: 0 };
try {
  const saved = JSON.parse(localStorage.getItem(PLAYER_KEY) || '{}');
  Object.assign(player, { look: saved.look ?? player.look, name: saved.name ?? '', outfit: saved.outfit ?? {} });
} catch { /* storage unavailable */ }
function savePlayer() {
  try {
    localStorage.setItem(PLAYER_KEY, JSON.stringify({ look: player.look, name: player.name, outfit: player.outfit }));
    $('player-save-status').textContent = '變更已自動儲存';
  } catch {
    $('player-save-status').textContent = '無法儲存，設定僅保留於本次使用';
  }
}
const keys = new Set();
const stick = { x: 0, y: 0 };
const overview = { pos: camera.position.clone(), target: controls.target.clone() };

// Road, sidewalks and park paths sit a little above the grass.
function groundHeight(x, z) {
  const tile = tiles.get(cellKey(Math.round(x / CELL), Math.round(z / CELL)));
  if (tile) return tile === 'walk' ? 0.05 : 0.02;
  for (const street of STREETS) {
    const d = Math.abs(z - street);
    if (d < ROAD_HALF) return 0.02;
    if (d < FRONTAGE) return 0.05;
  }
  return Math.abs(x) < PARK.xHalf && z > PARK.zMin && z < PARK.zMax ? 0.02 : 0;
}

// Push the player's circle out of every footprint and post, then keep it in town.
function collide(p) {
  for (let pass = 0; pass < 2; pass++) {
    for (const s of solids) {
      const cx = THREE.MathUtils.clamp(p.x, s.minX, s.maxX);
      const cz = THREE.MathUtils.clamp(p.z, s.minZ, s.maxZ);
      const dx = p.x - cx;
      const dz = p.z - cz;
      const d2 = dx * dx + dz * dz;
      if (d2 >= PLAYER_R * PLAYER_R) continue;
      if (d2 > 1e-8) {
        const d = Math.sqrt(d2);
        p.x = cx + dx / d * PLAYER_R;
        p.z = cz + dz / d * PLAYER_R;
      } else {
        // Inside the box: leave by the nearest side.
        const out = [[s.minX - PLAYER_R - p.x, 0], [s.maxX + PLAYER_R - p.x, 0], [0, s.minZ - PLAYER_R - p.z], [0, s.maxZ + PLAYER_R - p.z]]
          .sort((a, b) => Math.abs(a[0] + a[1]) - Math.abs(b[0] + b[1]))[0];
        p.x += out[0];
        p.z += out[1];
      }
    }
    for (const c of posts) {
      const dx = p.x - c.x;
      const dz = p.z - c.z;
      const d = Math.hypot(dx, dz);
      const min = c.r + PLAYER_R;
      if (d >= min) continue;
      const k = d > 1e-6 ? min / d : 0;
      p.x = d > 1e-6 ? c.x + dx * k : c.x + min;
      p.z = d > 1e-6 ? c.z + dz * k : c.z;
    }
  }
  p.x = THREE.MathUtils.clamp(p.x, BOUNDS.minX, BOUNDS.maxX);
  p.z = THREE.MathUtils.clamp(p.z, BOUNDS.minZ, BOUNDS.maxZ);
}

function dressPlayer() {
  if (player.obj) scene.remove(player.obj);
  const gltf = peopleGltfs[PEOPLE.indexOf(`character-${player.look}`)];
  const obj = wardrobe.dress(player.look, player.outfit);
  obj.scale.setScalar(PERSON_SCALE);
  obj.position.copy(player.pos);
  obj.rotation.y = player.obj?.rotation.y ?? Math.PI;
  scene.add(obj);
  const mixer = new THREE.AnimationMixer(obj);
  const clip = name => mixer.clipAction(THREE.AnimationClip.findByName(gltf.animations, name));
  Object.assign(player, { obj, mixer, moves: { idle: clip('idle'), walk: clip('walk'), sprint: clip('sprint'), jump: clip('jump') }, move: 'idle' });
  player.moves.walk.timeScale = WALK / 0.55; // the steps keep up with the faster walk
  player.moves.jump.setLoop(THREE.LoopOnce).clampWhenFinished = true;
  player.moves.idle.play();
}

function setMove(move) {
  if (move === player.move) return;
  player.moves[player.move].fadeOut(0.2);
  player.moves[move].reset().fadeIn(0.2).play();
  player.move = move;
}

function togglePlay() {
  if (editing) setEditing(false);
  player.active = !player.active;
  document.body.classList.toggle('playing', player.active);
  const [ico, label] = $('play').children;
  [ico.textContent, label.textContent] = player.active ? ['🏙', '回到俯瞰（P）'] : ['🚶', '散步模式（P）'];
  if (player.active) {
    player.pos.y = groundHeight(player.pos.x, player.pos.z);
    dressPlayer();
    controls.target.copy(player.pos).y += 0.15;
    camera.position.copy(controls.target).add(new THREE.Vector3(0, 0.9, 1.8));
    Object.assign(controls, { minDistance: 0.6, maxDistance: 10, maxPolarAngle: 1.45 });
    if (matchMedia('(pointer: coarse)').matches) setCollapsed(true);
  } else {
    scene.remove(player.obj);
    player.obj = null;
    camera.position.copy(overview.pos);
    controls.target.copy(overview.target);
    Object.assign(controls, { minDistance: 3, maxDistance: 35, maxPolarAngle: 1.32 });
    $('prompt').hidden = true;
  }
}

// ---------- the closet ----------

// Pick a body, recolour it and put something on, on a turntable that can be
// dragged round. The player and the turntable share one material, so a new
// colour shows on both at once.
const LOOKS = PEOPLE.map(n => n.replace('character-', ''));
let wardrobe = null;

async function addWardrobe() {
  const aids = await Promise.all(ACCESSORIES.filter(a => a.glb).map(async a => [a.glb, await model('mini-characters', a.glb)]));
  wardrobe = createWardrobe(Object.fromEntries(LOOKS.map((look, i) => [look, peopleGltfs[i]])), Object.fromEntries(aids));
}

const closet = $('closet');
const stage = new THREE.Scene();
stage.add(new THREE.HemisphereLight('#ffffff', '#7c8296', 2.2));
const keyLight = new THREE.DirectionalLight('#fff4e0', 2.4);
keyLight.position.set(1.5, 2.5, 2);
stage.add(keyLight);
const viewCam = new THREE.PerspectiveCamera(28, 1, 0.1, 20);
viewCam.position.set(0, 0.5, 3.4);
viewCam.lookAt(0, 0.35, 0);
let view = null;
const turn = { angle: 0.5, from: null, obj: null, mixer: null, clock: new THREE.Clock() };

function showPreview() {
  if (turn.obj) stage.remove(turn.obj);
  turn.obj = wardrobe.dress(player.look, player.outfit);
  turn.mixer = new THREE.AnimationMixer(turn.obj);
  const gltf = peopleGltfs[LOOKS.indexOf(player.look)];
  turn.mixer.clipAction(THREE.AnimationClip.findByName(gltf.animations, 'idle')).play();
  stage.add(turn.obj);
}

function spin() {
  if (closet.hidden) return;
  const dt = Math.min(turn.clock.getDelta(), 0.1);
  turn.obj.rotation.y = turn.angle;
  turn.mixer.update(dt);
  const canvas = view.domElement;
  if (canvas.width !== Math.round(canvas.clientWidth * view.getPixelRatio())) {
    view.setSize(canvas.clientWidth, canvas.clientHeight, false);
    viewCam.aspect = canvas.clientWidth / canvas.clientHeight;
    viewCam.updateProjectionMatrix();
  }
  view.render(stage, viewCam);
  requestAnimationFrame(spin);
}

function openCloset(open = closet.hidden) {
  if (!wardrobe) return;
  closet.hidden = !open;
  if (!open) return;
  keys.clear();
  releaseStick();
  if (!view) {
    view = new THREE.WebGLRenderer({ canvas: $('closet-view'), antialias: true, alpha: true });
    view.setPixelRatio(Math.min(devicePixelRatio, 2));
  }
  $('player-name').value = player.name;
  showPreview();
  renderCloset();
  turn.clock.getDelta();
  spin();
}

// Something about the outfit changed: save it, and redress whoever needs it.
function restyle(change) {
  if (change.look) {
    player.look = change.look;
    showPreview();
    if (player.active) dressPlayer();
  } else if ('accessory' in change) {
    player.outfit.accessory = change.accessory;
    wardrobe.wear(turn.obj, player.look, change.accessory);
    if (player.obj) wardrobe.wear(player.obj, player.look, change.accessory);
  } else {
    Object.assign(player.outfit, change);
    for (const [part, color] of Object.entries(change)) if (!color) delete player.outfit[part];
    wardrobe.paint(player.look, player.outfit);
  }
  savePlayer();
  renderCloset();
}

function renderCloset() {
  $('looks').replaceChildren(...LOOKS.map(look => {
    const b = document.createElement('button');
    b.className = look === player.look ? 'on' : '';
    b.title = look;
    b.innerHTML = `<img src="${ASSETS}/mini-characters/Previews/character-${look}.png" alt="">`;
    b.onclick = () => restyle({ look });
    return b;
  }));
  $('colors').replaceChildren(...PARTS.flatMap(({ id, label, colors }) => {
    const title = document.createElement('div');
    title.className = 'opt-label';
    title.textContent = label;
    const row = document.createElement('div');
    row.className = 'colors';
    const swatch = (color, text) => {
      const b = document.createElement('button');
      b.className = (player.outfit[id] ?? '') === color ? 'on' : '';
      if (color) b.style.background = color;
      else [b.className, b.textContent, b.title] = [`${b.className} orig`, text, '原本的顏色'];
      b.onclick = () => restyle({ [id]: color });
      return b;
    };
    const pick = document.createElement('input');
    pick.type = 'color';
    pick.title = '自訂顏色';
    pick.value = player.outfit[id] ?? colors[0];
    pick.oninput = () => restyle({ [id]: pick.value });
    row.append(swatch('', '原'), ...colors.map(c => swatch(c)), pick);
    return [title, row];
  }));
  $('accessories').replaceChildren(...ACCESSORIES.map(({ id, label }) => {
    const b = document.createElement('button');
    b.className = (player.outfit.accessory ?? '') === id ? 'on' : '';
    b.textContent = label;
    b.onclick = () => restyle({ accessory: id });
    return b;
  }));
}

$('closet-view').addEventListener('pointerdown', e => {
  e.currentTarget.setPointerCapture(e.pointerId);
  turn.from = [e.clientX, turn.angle];
});
$('closet-view').addEventListener('pointermove', e => {
  if (turn.from) turn.angle = turn.from[1] + (e.clientX - turn.from[0]) * 0.012;
});
$('closet-view').addEventListener('pointerup', () => { turn.from = null; });
$('closet-view').addEventListener('pointercancel', () => { turn.from = null; });
$('player-name').addEventListener('input', e => {
  player.name = e.target.value.trim();
  savePlayer();
});
$('dress').addEventListener('click', e => { openCloset(); e.currentTarget.blur(); });
$('closet-close').addEventListener('click', () => openCloset(false));
$('closet-done').addEventListener('click', () => openCloset(false));
closet.addEventListener('click', e => { if (e.target === closet) openCloset(false); });

// Whoever or whatever is close enough to use: people and cats within reach
// (cats on roofs only from the roof), or the fountain's rim.
function nearby() {
  const p = player.pos;
  let best = null;
  let bestD = 0.55;
  for (const w of walkers) {
    if (!w.obj.visible) continue;
    const d = Math.hypot(w.obj.position.x - p.x, w.obj.position.z - p.z);
    if (d < bestD) [best, bestD] = [{ kind: 'person', it: w }, d];
  }
  for (const c of cats) {
    if (c.poof || Math.abs(c.obj.position.y - p.y) > 0.3) continue;
    const d = Math.hypot(c.obj.position.x - p.x, c.obj.position.z - p.z);
    if (d < bestD) [best, bestD] = [{ kind: 'cat', it: c }, d];
  }
  if (!best && Math.hypot(p.x, p.z - PARK.cz) < 0.62 + 0.35) best = { kind: 'fountain' };
  return best;
}

function promptFor(target) {
  if (!target) return '';
  if (target.kind === 'fountain') return '投硬幣許願';
  if (target.kind === 'cat') return '這裡有一隻貓！';
  return `跟${target.it.info?.name ?? '路人'}說話`;
}

function interact() {
  const target = nearby();
  if (!target) return;
  if (target.kind === 'fountain') {
    if (!wishes.flying()) wishes.throwCoin(wishResult);
    return;
  }
  const it = target.it;
  if (target.kind === 'cat') {
    findCat(it);
    const v = it.obj.position.clone().project(camera);
    hearts((v.x + 1) / 2 * innerWidth, (1 - v.y) / 2 * innerHeight);
  } else {
    it.hop = HOP;
  }
  const said = it.speech();
  // Residents call a named player by name.
  if (it instanceof Resident && player.name) said.line = `${player.name}，${said.line}`;
  talk(it, said);
}

const MOVE_KEYS = { KeyW: [0, 1], ArrowUp: [0, 1], KeyS: [0, -1], ArrowDown: [0, -1], KeyA: [-1, 0], ArrowLeft: [-1, 0], KeyD: [1, 0], ArrowRight: [1, 0] };
addEventListener('keydown', e => {
  if (e.code === 'Escape') openCloset(false);
  if (e.target instanceof HTMLInputElement) return;
  if (e.code === 'KeyC' && !e.repeat) openCloset();
  if (!closet.hidden) return;
  if (e.code === 'KeyP') togglePlay();
  if (!player.active) return;
  if (MOVE_KEYS[e.code] || e.code.startsWith('Shift')) {
    keys.add(e.code);
    if (e.code.startsWith('Arrow')) e.preventDefault();
  }
  if (e.code === 'KeyE' && !e.repeat) interact();
  if (e.code === 'Space') {
    e.preventDefault();
    if (!e.repeat && !player.air) player.vy = JUMP_SPEED;
  }
});
addEventListener('keyup', e => keys.delete(e.code));
addEventListener('blur', () => keys.clear());
$('play').addEventListener('click', e => { togglePlay(); e.currentTarget.blur(); });
$('act').addEventListener('click', interact);

// The touch stick: drag the knob; pushed all the way out it runs.
const stickEl = $('stick');
const knob = stickEl.querySelector('.knob');
const STICK_R = 46;
function moveStick(e) {
  const r = stickEl.getBoundingClientRect();
  let dx = e.clientX - (r.left + r.width / 2);
  let dy = e.clientY - (r.top + r.height / 2);
  const d = Math.hypot(dx, dy);
  if (d > STICK_R) [dx, dy] = [dx / d * STICK_R, dy / d * STICK_R];
  knob.style.transform = `translate(${dx}px, ${dy}px)`;
  [stick.x, stick.y] = [dx / STICK_R, dy / STICK_R];
}
stickEl.addEventListener('pointerdown', e => { stickEl.setPointerCapture(e.pointerId); moveStick(e); });
stickEl.addEventListener('pointermove', e => { if (stickEl.hasPointerCapture(e.pointerId)) moveStick(e); });
const releaseStick = () => { knob.style.transform = ''; stick.x = stick.y = 0; };
stickEl.addEventListener('pointerup', releaseStick);
stickEl.addEventListener('pointercancel', releaseStick);

// A resident who passes close greets a named player, at most once a minute each.
const GREETINGS = { morning: '早安！', day: '午安！', evening: '晚上好！', night: '這麼晚還在散步呀？' };
const greetedAt = new Map();
function greetPlayer() {
  const now = performance.now();
  if (!player.name || (talking && now < talkUntil)) return;
  let best = null;
  let bestD = 0.45;
  for (const w of walkers) {
    if (!(w instanceof Resident) || !w.obj.visible) continue;
    if (now - (greetedAt.get(w) ?? -Infinity) < 60000) continue;
    const d = Math.hypot(w.obj.position.x - player.pos.x, w.obj.position.z - player.pos.z);
    if (d < bestD) [best, bestD] = [w, d];
  }
  if (!best) return;
  greetedAt.set(best, now);
  best.hop = HOP;
  talk(best, { name: best.info.name, role: best.info.job, line: `${player.name}，${GREETINGS[partOfDay(time)]}` });
}

const forward = new THREE.Vector3();
function updatePlayer(dt) {
  if (!player.active || !closet.hidden) return;
  let ix = stick.x;
  let iz = -stick.y;
  for (const code of keys) {
    const k = MOVE_KEYS[code];
    if (k) [ix, iz] = [ix + k[0], iz + k[1]];
  }
  const amount = Math.min(1, Math.hypot(ix, iz));
  const running = [...keys].some(c => c.startsWith('Shift')) || Math.hypot(stick.x, stick.y) > 0.92;
  const before = player.pos.clone();
  // A jump: up and back down onto whatever is underfoot.
  if (player.vy || player.air) {
    player.air += player.vy * dt;
    player.vy -= GRAVITY * dt;
    if (player.air <= 0) player.air = player.vy = 0;
  }
  if (amount > 0.1) {
    // W heads where the camera looks, flattened onto the ground.
    camera.getWorldDirection(forward).setY(0).normalize();
    const dx = forward.x * iz - forward.z * ix;
    const dz = forward.z * iz + forward.x * ix;
    const len = Math.hypot(dx, dz);
    const step = (running ? RUN : WALK) * amount * dt;
    player.pos.x += dx / len * step;
    player.pos.z += dz / len * step;
    collide(player.pos);
    player.obj.rotation.y = Math.atan2(dx, dz);
    setMove(player.air ? 'jump' : running ? 'sprint' : 'walk');
  } else {
    setMove(player.air ? 'jump' : 'idle');
  }
  player.pos.y = groundHeight(player.pos.x, player.pos.z) + player.air;
  player.obj.position.copy(player.pos);
  player.mixer.update(dt);
  // The camera rides along by however far the player moved.
  const moved = player.pos.clone().sub(before);
  camera.position.add(moved);
  controls.target.add(moved);

  greetPlayer();
  const label = promptFor(nearby());
  $('prompt').hidden = !label;
  $('prompt').textContent = `E　${label}`;
  $('act').textContent = label || '互動';
  $('act').disabled = !label;
}

// ---------- editing the town ----------

// Buildings, trees and lamps can be dragged about, turned and removed. Each
// one lives in a pivot group with its signs, awnings and lights; its
// footprint, posts and doors are kept in the pivot's space and put back into
// the world after every change. Changes are saved in this browser.
const LAYOUT_KEY = 'small-town:layout';
const SNAP = 0.1;
const editables = new Map();
const undos = [];
let editing = false;
let selected = null;
let drag = null;
const floor = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
// The selection: a see-through cyan box round the item (cyan stands apart
// from the warm lights at night), and a frame on the ground beneath it that is
// never narrower than MARK_MIN, so thin things like lamps still stand out.
const MARK_MIN = 0.5;
const MARK_BAR = 0.04;
const outline = new THREE.Group();
const shell = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x3ec8ff, transparent: true, opacity: 0.3, depthWrite: false }));
const frameMat = new THREE.MeshBasicMaterial({ color: 0x3ec8ff });
const bars = [0, 1, 2, 3].map(() => new THREE.Mesh(new THREE.BoxGeometry(1, 0.012, 1), frameMat));
outline.add(shell, ...bars);
outline.visible = false;
outline.traverse(o => { o.raycast = () => {}; }); // never a surface for cats or clicks
scene.add(outline);
function hug(item) {
  const b = new THREE.Box3().setFromObject(item.pivot);
  b.getCenter(shell.position);
  b.getSize(shell.scale).addScalar(0.06);
  const w = Math.max(shell.scale.x, MARK_MIN);
  const d = Math.max(shell.scale.z, MARK_MIN);
  const { x, z } = shell.position;
  [[x, z - d / 2, w + MARK_BAR, MARK_BAR], [x, z + d / 2, w + MARK_BAR, MARK_BAR], [x - w / 2, z, MARK_BAR, d], [x + w / 2, z, MARK_BAR, d]]
    .forEach(([bx, bz, sx, sz], i) => {
      bars[i].position.set(bx, 0.065, bz);
      bars[i].scale.set(sx, 1, sz);
    });
}

function editable(id, parts, { solids: ss = [], posts: ps = [], places = [], points = [] } = {}) {
  const box3 = new THREE.Box3();
  for (const part of parts) box3.expandByObject(part);
  const centre = box3.getCenter(new THREE.Vector3());
  const pivot = new THREE.Group();
  pivot.position.set(Math.round(centre.x / SNAP) * SNAP, 0, Math.round(centre.z / SNAP) * SNAP);
  scene.add(pivot);
  pivot.updateMatrixWorld(true);
  for (const part of parts) pivot.attach(part);
  const local = (x, z) => pivot.worldToLocal(new THREE.Vector3(x, 0, z));
  const item = {
    id, pivot, removed: false,
    base: { x: pivot.position.x, z: pivot.position.z, rot: 0 },
    solids: ss.map(s => ({ s, a: local(s.minX, s.minZ), b: local(s.maxX, s.maxZ) })),
    posts: ps.map(p => ({ p, at: local(p.x, p.z) })),
    places: places.map(pl => ({ pl, at: local(pl.door.x, pl.door.z) })),
    points: points.map(v => ({ v, at: local(v.x, v.z) })),
  };
  pivot.userData.editable = item;
  editables.set(id, item);
  return item;
}

const stateOf = item => ({ x: item.pivot.position.x, z: item.pivot.position.z, rot: item.pivot.rotation.y, removed: item.removed });

// Put an item where `state` says and bring everything that hangs off it along.
function applyState(item, { x, z, rot, removed }) {
  item.pivot.position.set(x, 0, z);
  item.pivot.rotation.y = rot;
  item.pivot.updateMatrixWorld(true);
  const world = at => item.pivot.localToWorld(at.clone());
  for (const { s, a, b } of item.solids) {
    const [p, q] = [world(a), world(b)];
    Object.assign(s, { minX: Math.min(p.x, q.x), maxX: Math.max(p.x, q.x), minZ: Math.min(p.z, q.z), maxZ: Math.max(p.z, q.z) });
  }
  for (const { p, at } of item.posts) Object.assign(p, { x: world(at).x, z: world(at).z });
  for (const { v, at } of item.points) [v.x, v.z] = [world(at).x, world(at).z];
  for (const { pl, at } of item.places) {
    [pl.door.x, pl.door.z] = [world(at).x, world(at).z];
    // The sidewalk it now opens onto.
    pl.street = STREETS.reduce((a, b) => (Math.abs(pl.door.z - b) < Math.abs(pl.door.z - a) ? b : a));
    pl.side = pl.door.z < pl.street ? -1 : 1;
    pl.x = pl.door.x;
  }
  if (removed !== item.removed) {
    item.removed = removed;
    item.pivot.visible = !removed;
    for (const { s } of item.solids) removed ? solids.splice(solids.indexOf(s), 1) : solids.push(s);
    for (const { p } of item.posts) removed ? posts.splice(posts.indexOf(p), 1) : posts.push(p);
    for (const { pl } of item.places) pl.removed = removed;
  }
}

// Residents re-plan their walks and the cats settle onto whatever is below them now.
function settleTown() {
  for (const w of walkers) if (w instanceof Resident) w.plan();
  scene.updateMatrixWorld(true);
  for (const spot of catSpots) spot.y = surfaceY(spot.x, spot.z);
  for (const cat of cats) if (!cat.poof) cat.obj.position.copy(cat.spot);
}

// Only what differs from the default town.
function currentLayout() {
  const layout = {};
  if (tiles.size) layout['#tiles'] = Object.fromEntries(tiles);
  if (JSON.stringify(zebras) !== JSON.stringify(DEFAULT_ZEBRAS)) layout['#zebras'] = zebras;
  for (const item of editables.values()) {
    const s = stateOf(item);
    // Added things are kept with how to build them again, unless removed.
    if (item.add) {
      if (!s.removed && item !== placing) layout[item.id] = { ...s, add: item.add };
    } else if (s.removed || s.x !== item.base.x || s.z !== item.base.z || s.rot !== item.base.rot) {
      layout[item.id] = s;
    }
  }
  return layout;
}

function saveLayout() {
  try { localStorage.setItem(LAYOUT_KEY, JSON.stringify(currentLayout())); } catch { /* storage unavailable */ }
}

async function applyLayout() {
  let layout = {};
  try { layout = JSON.parse(localStorage.getItem(LAYOUT_KEY) || '{}'); } catch { /* storage unavailable */ }
  for (const [id, s] of Object.entries(layout)) {
    const item = editables.get(id) ?? (s.add ? await buildAdded(id, s.add) : null);
    if (item) applyState(item, s);
  }
  setTiles(layout['#tiles']);
  setZebras(layout['#zebras'] ?? DEFAULT_ZEBRAS);
  settleTown();
}

// Every change goes through here so it can be undone. An undo step is a
// list of [item, state before], so loading a whole layout undoes in one go.
function change(item, next) {
  undos.push([[item, stateOf(item)]]);
  applyState(item, next);
  saveLayout();
  settleTown();
  select(item.removed ? null : item);
}

// A step may also carry the painted cells and crossings from before it.
function undo() {
  const last = undos.pop();
  if (!last) return;
  if (last.tiles) setTiles(Object.fromEntries(last.tiles));
  if (last.zebras) setZebras(last.zebras);
  for (const [item, state] of last) applyState(item, state);
  saveLayout();
  settleTown();
  select(last.length === 1 && !last[0][0].removed ? last[0][0] : null);
}

// Replace the whole layout: everything not mentioned goes back to its default place.
async function loadLayout(layout) {
  cancelPlacing();
  // Build what the layout adds first, hidden, so undo hides it again.
  for (const [id, s] of Object.entries(layout)) {
    if (!s.add || editables.has(id)) continue;
    const item = await buildAdded(id, s.add);
    applyState(item, { ...stateOf(item), removed: true });
  }
  const step = Object.assign([], { tiles: new Map(tiles), zebras: zebras.map(zb => ({ ...zb })) });
  setTiles(layout['#tiles']);
  setZebras(layout['#zebras'] ?? DEFAULT_ZEBRAS);
  for (const item of editables.values()) {
    step.push([item, stateOf(item)]);
    applyState(item, layout[item.id] ?? (item.add ? { ...stateOf(item), removed: true } : { ...item.base, removed: false }));
  }
  undos.push(step);
  saveLayout();
  settleTown();
  select(null);
}

function select(item) {
  selected = item;
  outline.visible = !!item;
  if (item) hug(item);
}

function setEditing(on) {
  if (on && player.active) togglePlay();
  editing = on;
  document.body.classList.toggle('editing', on);
  const [ico, label] = $('edit').children;
  [ico.textContent, label.textContent] = on ? ['✅', '完成編輯（B）'] : ['🛠', '編輯（B）'];
  if (!on) {
    setBrush(null);
    cancelPlacing();
    select(null);
    $('slots').hidden = true;
    $('add-panel').hidden = true;
  }
}

function itemAt(e) {
  aim(e);
  const pivots = [...editables.values()].filter(i => !i.removed).map(i => i.pivot);
  for (const hit of raycaster.intersectObjects(pivots, true)) {
    if (!hit.object.isMesh) continue;
    let o = hit.object;
    while (!o.userData.editable) o = o.parent;
    return o.userData.editable;
  }
  return null;
}

// Capture the press before the camera controls see it, so dragging a
// building moves the building instead of the view.
addEventListener('pointerdown', e => {
  if (!editing || e.target !== renderer.domElement) return;
  if (brush) {
    if (e.button === 2) return setBrush(null);
    if (e.button !== 0) return;
    controls.enabled = false;
    drag = {};
    stroke = { tiles: new Map(tiles), zebras: JSON.stringify(zebras) };
    aim(e);
    const at = raycaster.ray.intersectPlane(floor, new THREE.Vector3());
    if (at) paintAt(at);
    return;
  }
  if (placing) {
    if (e.button === 2) return cancelPlacing();
    if (e.button !== 0) return;
    controls.enabled = false;
    drag = {};
    return putDown();
  }
  if (e.button !== 0) return;
  const item = itemAt(e);
  if (!item) {
    drag = { from: [e.clientX, e.clientY] };
    return;
  }
  controls.enabled = false;
  select(item);
  const at = raycaster.ray.intersectPlane(floor, new THREE.Vector3());
  drag = { item, before: stateOf(item), offset: item.pivot.position.clone().sub(at), moved: false };
}, true);
addEventListener('pointermove', e => {
  if (!editing || e.target !== renderer.domElement) return;
  aim(e);
  const at = raycaster.ray.intersectPlane(floor, new THREE.Vector3());
  if (!at) return;
  pointerFloor = at.clone();
  if (brush) return paintAt(at);
  if (placing) {
    applyState(placing, { ...stateOf(placing), x: Math.round(at.x / SNAP) * SNAP, z: Math.round(at.z / SNAP) * SNAP });
    hug(placing);
    return;
  }
  if (!drag?.item) return;
  at.add(drag.offset);
  const x = Math.round(at.x / SNAP) * SNAP;
  const z = Math.round(at.z / SNAP) * SNAP;
  if (x === drag.item.pivot.position.x && z === drag.item.pivot.position.z) return;
  drag.moved = true;
  applyState(drag.item, { ...stateOf(drag.item), x, z });
  hug(drag.item);
});
addEventListener('pointerup', e => {
  if (stroke) endStroke();
  if (!drag) return;
  controls.enabled = true;
  const { item, before, moved, from } = drag;
  drag = null;
  if (from && Math.hypot(e.clientX - from[0], e.clientY - from[1]) < 5) select(null);
  if (!item || !moved) return;
  const after = stateOf(item);
  applyState(item, before);
  change(item, after);
});

addEventListener('keydown', e => {
  if (e.target instanceof HTMLInputElement) return;
  if (e.code === 'KeyB' && !e.repeat) setEditing(!editing);
  if (!editing) return;
  if (brush && e.code === 'Escape') return setBrush(null);
  if (placing) {
    if (e.code === 'KeyR' && !e.repeat) {
      applyState(placing, { ...stateOf(placing), rot: (placing.pivot.rotation.y + Math.PI / 2) % (Math.PI * 2) });
      hug(placing);
    }
    if (e.code === 'Escape' || ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ')) cancelPlacing();
    return;
  }
  if ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ') {
    e.preventDefault();
    undo();
    return;
  }
  if (!selected) return;
  if (e.code === 'KeyR' && !e.repeat) change(selected, { ...stateOf(selected), rot: (selected.pivot.rotation.y + Math.PI / 2) % (Math.PI * 2) });
  if (e.code === 'Delete' || e.code === 'Backspace') change(selected, { ...stateOf(selected), removed: true });
  if (e.code === 'Escape') select(null);
});
// ---------- adding to the town ----------

// Pick a type and a model in the panel; the new thing follows the pointer
// until a click on the ground puts it down. Added things are saved in the
// layout with what is needed to build them again.
const BUILDINGS = [...'abcdefghijklmn'].map(c => `building-${c}`);
const ADD_TYPES = [
  { type: 'house', label: '住家', pack: 'commercial', models: BUILDINGS },
  { type: 'villa', label: '別墅', pack: 'suburban', models: [...'abcdefghijklmnopqrstu'].map(c => `building-type-${c}`) },
  { type: 'shop', label: '商店', pack: 'commercial', models: BUILDINGS },
  { type: 'tree', label: '樹', pack: 'suburban', models: ['tree-large', 'tree-small'] },
  { type: 'lamp', label: '路燈', pack: 'roads', models: ['light-square', 'light-curved'] },
  { type: 'paving', label: '道路', models: [] },
];
const BRUSHES = [['road', '馬路'], ['walk', '人行道'], ['zebra', '斑馬線'], ['erase', '清除']];
// Wall colours: white, or one of the pastels.
const WALLS = [['白色', -1], ['淡藍', 0], ['淡綠', 1], ['淡黃', 2]];
const SHOP_THEMES = [
  { bg: '#3b2a20', fg: '#ffdca8', awning: 0xb8433a },
  { bg: '#1f3b3a', fg: '#f3ead2', awning: 0x2f6b4f },
  { bg: '#f7f7f4', fg: '#1d6fd6', awning: 0x2c6fc4 },
  { bg: '#fff3c4', fg: '#8a4b00', awning: 0xf2c14e },
  { bg: '#f4e8ef', fg: '#c0466e', awning: 0xe58fb0 },
  { bg: '#3d2f5c', fg: '#f3e6ff', awning: 0x7a5cc4 },
];
let placing = null;
let placingTicket = null;
let pointerFloor = null;
const addChoice = { type: 'house', wall: -1, theme: 0 };

// Built at the origin facing +z; its pivot then carries it into place.
async function buildAdded(id, add) {
  let item;
  if (add.type === 'tree') {
    const c = collect(() => post(0, 0, 0.1));
    const obj = await place('suburban', add.model, { scale: 1.25, mat: kit.plantMat });
    item = editable(id, [obj], c);
  } else if (add.type === 'lamp') {
    item = await streetLamp(id, 0, 0, 1, add.model);
  } else {
    const villa = add.type === 'villa';
    const walls = add.wall >= 0 ? kit.pastels[add.wall] : kit.commercial;
    const mat = villa
      ? paletteMaterial(kit.suburban, 0.9 + Math.random() * 0.6, 21 + Math.random(), Math.random() * 0.1)
      : paletteMaterial(walls, add.type === 'shop' ? 1.3 : [1.4, 0.7, 2.2][Math.floor(Math.random() * 3)],
        add.type === 'shop' ? 22 : (21.5 + Math.random() * 5) % 24, add.type === 'shop' ? 0 : Math.random() * 0.15);
    const obj = solidOf(await place(villa ? 'suburban' : 'commercial', add.model, { mat }));
    const c = add.type === 'shop'
      ? collect(() => decorateShop(obj, { x: 0, facing: 1, name: add.name, ...SHOP_THEMES[add.theme], closes: 22 }))
      : { parts: [] };
    item = editable(id, [obj, ...c.parts], { solids: [obj.userData.solid] });
  }
  item.add = add;
  return item;
}

async function startPlacing(add) {
  setBrush(null);
  cancelPlacing();
  const ticket = placingTicket = {};
  const item = await buildAdded(`add:${Date.now().toString(36)}`, add);
  // Something else was picked, or editing ended, while the model loaded.
  if (ticket !== placingTicket || !editing) return discard(item);
  placing = item;
  const at = pointerFloor ?? controls.target;
  applyState(item, { x: Math.round(at.x / SNAP) * SNAP, z: Math.round(at.z / SNAP) * SNAP, rot: 0, removed: false });
  select(item);
  $('prompt').textContent = '點地面放下 · R 旋轉 · Esc 或右鍵取消';
  $('prompt').hidden = false;
}

function putDown() {
  const item = placing;
  placing = null;
  $('prompt').hidden = true;
  undos.push([[item, { ...stateOf(item), removed: true }]]);
  saveLayout();
  settleTown();
  select(item);
}

function cancelPlacing() {
  placingTicket = null;
  if (!placing) return;
  discard(placing);
  placing = null;
  $('prompt').hidden = true;
  select(null);
}

// Gone for good: never placed, so nothing can bring it back.
function discard(item) {
  applyState(item, { ...stateOf(item), removed: true });
  scene.remove(item.pivot);
  editables.delete(item.id);
}

function chip(label, on, onclick) {
  const b = document.createElement('button');
  b.textContent = label;
  b.className = on ? 'on' : '';
  b.onclick = onclick;
  return b;
}

function renderAddPanel() {
  const t = ADD_TYPES.find(a => a.type === addChoice.type);
  const restyle = change => () => {
    Object.assign(addChoice, change);
    if (change.type && change.type !== 'paving') setBrush(null);
    renderAddPanel();
  };
  $('add-paving').hidden = t.type !== 'paving';
  $('add-model-box').hidden = t.type === 'paving';
  $('add-brushes').replaceChildren(...BRUSHES.map(([b, label]) => chip(label, brush === b, () => setBrush(brush === b ? null : b))));
  $('add-tabs').replaceChildren(...ADD_TYPES.map(a => chip(a.label, a === t, restyle({ type: a.type }))));
  $('add-walls').hidden = t.pack !== 'commercial';
  $('add-walls-row').replaceChildren(...WALLS.map(([label, w]) => chip(label, addChoice.wall === w, restyle({ wall: w }))));
  $('add-shop').hidden = t.type !== 'shop';
  $('add-themes').replaceChildren(...SHOP_THEMES.map((theme, i) => {
    const b = document.createElement('button');
    b.className = addChoice.theme === i ? 'on' : '';
    b.style.background = `#${theme.awning.toString(16).padStart(6, '0')}`;
    b.onclick = restyle({ theme: i });
    return b;
  }));
  $('add-models').replaceChildren(...t.models.map(model => {
    const b = document.createElement('button');
    b.title = model;
    b.innerHTML = `<img src="${ASSETS}/${t.pack}/Previews/${model}.png" alt="">`;
    b.onclick = () => {
      const add = { type: t.type, model };
      if (t.pack === 'commercial' && addChoice.wall >= 0) add.wall = addChoice.wall;
      if (t.type === 'shop') Object.assign(add, { name: $('add-name').value.trim() || '新商店', theme: addChoice.theme });
      startPlacing(add);
    };
    return b;
  }));
}

$('edit-add').addEventListener('click', () => {
  $('add-panel').hidden = !$('add-panel').hidden;
  if (!$('add-panel').hidden) renderAddPanel();
  else cancelPlacing();
});
$('add-close').addEventListener('click', () => {
  $('add-panel').hidden = true;
  cancelPlacing();
});
renderer.domElement.addEventListener('contextmenu', e => { if (placing) e.preventDefault(); });

// ---------- paving ----------

// Roads and pavements painted on a grid of road-wide cells lined up with the
// main street. A road cell picks the Kenney piece that joins its neighbours,
// the old streets included, and a road crossing a street's pavement cuts it.
// Cells inside a street can't be painted; the back street sits half a cell
// off the grid, so the cells beside it overlap it and stop at its edge.
// A street can be made longer, a column at a time, past either end.
const CELL = ROAD_HALF * 2;
const STREET_COLS = 12; // the streets run over columns −12…12, to x = ±20
const MAX_COL = 18; // and can be made longer up to here, inside the pavements
const tiles = new Map(); // "i,j" → 'road' | 'walk'; a street's extra columns "s<k>,<i>" → 'road'
const tileGroup = new THREE.Group();
const kerbs = new THREE.Group();
scene.add(tileGroup, kerbs);
const cellKey = (i, j) => `${i},${j}`;
const NORTH = 1;
const EAST = 2;
const SOUTH = 4;
const WEST = 8;
// A quarter turn (+y rotation) takes east to north, north to west, and so on.
const quarter = m => (m & EAST ? NORTH : 0) | (m & NORTH ? WEST : 0) | (m & WEST ? SOUTH : 0) | (m & SOUTH ? EAST : 0);
// Each piece and the sides it opens to, unturned.
const PIECES = [['road-square', 0], ['road-end', EAST], ['road-straight', EAST | WEST], ['road-bend', SOUTH | WEST],
  ['road-intersection', EAST | SOUTH | WEST], ['road-crossroad', NORTH | EAST | SOUTH | WEST]];
const pieceFor = new Map(); // sides → [piece, quarter turns]
for (const [piece, open] of PIECES) {
  for (let k = 0, m = open; k < 4; k++, m = quarter(m)) if (!pieceFor.has(m)) pieceFor.set(m, [piece, k]);
}
const streetGap = z => Math.min(...STREETS.map(s => Math.abs(z - s)));
const paveable = j => streetGap(j * CELL) > ROAD_HALF - 1e-6;
const halfCell = j => streetGap(j * CELL) < CELL - 1e-6;
// The painted grid cells as [i, j, kind], leaving out the street extensions.
const gridCells = () => [...tiles].filter(([key]) => key[0] !== 's').map(([key, kind]) => [...key.split(',').map(Number), kind]);

// The columns street k runs over, its extensions included.
function streetSpan(k) {
  let lo = -STREET_COLS;
  let hi = STREET_COLS;
  while (tiles.has(`s${k},${hi + 1}`)) hi++;
  while (tiles.has(`s${k},${lo - 1}`)) lo--;
  return [lo, hi];
}

// Does a street in column i lie on or across this line of z?
const streetAt = (z, i) => STREETS.some((s, k) => {
  const [lo, hi] = streetSpan(k);
  return Math.abs(z - s) <= ROAD_HALF + 1e-6 && i >= lo && i <= hi;
});

function roadSides(i, j) {
  const road = (a, b) => tiles.get(cellKey(a, b)) === 'road';
  const z = j * CELL;
  return (road(i, j - 1) || streetAt(z - ROAD_HALF, i) ? NORTH : 0) | (road(i + 1, j) ? EAST : 0)
    | (road(i, j + 1) || streetAt(z + ROAD_HALF, i) ? SOUTH : 0) | (road(i - 1, j) ? WEST : 0);
}

function roadPiece(gltf) {
  const obj = gltf.scene.clone(true);
  obj.traverse(o => {
    if (!o.isMesh) return;
    o.material = kit.roadMat;
    o.receiveShadow = true;
  });
  return obj;
}

let paveJob = 0;
async function drawTiles() {
  const job = ++paveJob;
  const gltfs = Object.fromEntries(await Promise.all(PIECES.map(async ([p]) => [p, await model('roads', p)])));
  if (job !== paveJob) return;
  tileGroup.clear();
  for (const [i, j, kind] of gridCells()) {
    const x = i * CELL;
    const z = j * CELL;
    if (kind === 'walk') {
      box(CELL, 0.05, CELL, kit.pavement, x, 0.025, z, false, tileGroup);
      continue;
    }
    let obj;
    if (halfCell(j)) {
      // Only the part outside the street: a straight stub running into it.
      const s = STREETS.reduce((a, b) => (Math.abs(z - b) < Math.abs(z - a) ? b : a));
      const near = s + Math.sign(z - s) * ROAD_HALF;
      const far = z + Math.sign(z - s) * ROAD_HALF;
      obj = roadPiece(gltfs['road-straight']);
      obj.position.set(x, 0, (near + far) / 2);
      obj.rotation.y = Math.PI / 2;
      obj.scale.set(Math.abs(far - near), 1, CELL);
    } else {
      const [piece, k] = pieceFor.get(roadSides(i, j));
      obj = roadPiece(gltfs[piece]);
      obj.position.set(x, 0, z);
      obj.rotation.y = k * Math.PI / 2;
      obj.scale.setScalar(CELL);
    }
    tileGroup.add(obj);
  }

  // The streets: straight between junctions, and a T (or a crossing, with
  // roads on both sides) where painted roads join them.
  STREETS.forEach((street, k) => {
    const [lo, hi] = streetSpan(k);
    const joins = new Map(); // cell column → sides with a road
    for (const [i, j, kind] of gridCells()) {
      if (kind !== 'road' || i < lo || i > hi) continue;
      const z = j * CELL;
      if (z < street && Math.abs(z + ROAD_HALF - street) <= ROAD_HALF + 1e-6) joins.set(i, (joins.get(i) ?? 0) | NORTH);
      if (z > street && Math.abs(z - ROAD_HALF - street) <= ROAD_HALF + 1e-6) joins.set(i, (joins.get(i) ?? 0) | SOUTH);
    }
    const straight = (a, b) => {
      const obj = roadPiece(gltfs['road-straight']);
      obj.position.set((a + b) / 2, 0, street);
      obj.scale.set(b - a, 1, CELL);
      tileGroup.add(obj);
    };
    const end = hi * CELL + ROAD_HALF;
    let from = lo * CELL - ROAD_HALF;
    for (const i of [...joins.keys()].sort((a, b) => a - b)) {
      const a = i * CELL - ROAD_HALF;
      if (a > from) straight(from, a);
      const [piece, k] = pieceFor.get(EAST | WEST | joins.get(i));
      const obj = roadPiece(gltfs[piece]);
      obj.position.set(i * CELL, 0, street);
      obj.rotation.y = k * Math.PI / 2;
      obj.scale.setScalar(CELL);
      tileGroup.add(obj);
      from = a + CELL;
    }
    if (from < end) straight(from, end);
  });
  buildRoads();
}

// The streets' pavements and curbs, with a gap wherever a road crosses.
function paveSidewalks() {
  kerbs.clear();
  for (const street of STREETS) {
    for (const side of [-1, 1]) {
      const inner = street + side * ROAD_HALF;
      const outer = street + side * FRONTAGE;
      const gaps = gridCells().filter(([, , kind]) => kind === 'road')
        .filter(([, j]) => Math.min(inner, outer) < j * CELL + ROAD_HALF && Math.max(inner, outer) > j * CELL - ROAD_HALF)
        .map(([i]) => [i * CELL - ROAD_HALF, i * CELL + ROAD_HALF]).sort((a, b) => a[0] - b[0]);
      let from = -30;
      for (const [a, b] of [...gaps, [30, 30]]) {
        if (a > from) {
          box(a - from, 0.05, SIDEWALK, kit.pavement, (a + from) / 2, 0.025, (inner + outer) / 2, false, kerbs);
          box(a - from, 0.06, 0.06, kit.curb, (a + from) / 2, 0.03, street + side * (ROAD_HALF + 0.03), false, kerbs);
        }
        from = Math.max(from, b);
      }
    }
  }
}

// Zebra crossings: across a street, or across a straight painted road (`ns`:
// a road running north–south), `w` wide along the road. The lanes and the
// hotel have theirs to begin with.
const DEFAULT_ZEBRAS = [
  ...ALLEYS.flatMap(x => STREETS.map(z => ({ x, z, w: ALLEY_HALF * 1.6, ns: false }))),
  { x: 0, z: STREETS[0], w: 0.6, ns: false },
];
const zebras = DEFAULT_ZEBRAS.map(zb => ({ ...zb }));
const zebraMat = std(0xe8e2cf, { roughness: 0.6 });
const zebraGroup = new THREE.Group();
scene.add(zebraGroup);

function drawZebras() {
  zebraGroup.clear();
  for (const { x, z, w, ns } of zebras) {
    for (let i = 0; i < 7; i++) {
      const t = -ROAD_HALF + 0.12 + i * 0.226;
      if (ns) box(0.11, 0.004, w, zebraMat, x + t, 0.022, z, false, zebraGroup);
      else box(w, 0.004, 0.11, zebraMat, x, 0.022, z + t, false, zebraGroup);
    }
  }
}

function setZebras(list) {
  zebras.splice(0, zebras.length, ...list.map(zb => ({ ...zb })));
  drawZebras();
}

// Someone on a crossing, or just stepping onto it.
function onZebra(zb, p) {
  const [along, across] = zb.ns ? [p.z - zb.z, p.x - zb.x] : [p.x - zb.x, p.z - zb.z];
  return Math.abs(along) < zb.w / 2 + 0.15 && Math.abs(across) < ROAD_HALF + 0.1;
}

// Where a crossing painted at this cell would go: across a street clear of
// its junctions, or across a straight road cell; nowhere else.
function zebraAt(at, i, j) {
  const street = STREETS.findIndex(s => Math.abs(at.z - s) <= ROAD_HALF);
  const node = roads.get(street >= 0 ? `s${street},${i}` : cellKey(i, j));
  if (!node || isJunction(node) || (street < 0 && halfCell(j))) return null;
  const sides = [...node.links.keys()];
  if (sides[0] !== opposite(sides[1])) return null;
  const zb = { x: node.x, z: node.z, w: ALLEY_HALF * 1.6, ns: sides.includes(NORTH) };
  return zebras.some(o => Math.hypot(o.x - zb.x, o.z - zb.z) < CELL - 1e-6) ? null : zb;
}

const inCell = (zb, i, j) => Math.abs(zb.x - i * CELL) <= CELL / 2 + 1e-6 && Math.abs(zb.z - j * CELL) <= CELL / 2 + 1e-6;

function setTiles(cells = {}) {
  tiles.clear();
  for (const [key, kind] of Object.entries(cells)) tiles.set(key, kind);
  drawTiles();
  paveSidewalks();
}

// The brush: 'road', 'walk', 'zebra' or 'erase', painting by dragging; one
// drag is one undo step. A cyan square shows the cell under the pointer, red where
// it can't be painted.
let brush = null;
let stroke = null;
const brushMark = new THREE.Mesh(new THREE.BoxGeometry(CELL, 0.02, CELL),
  new THREE.MeshBasicMaterial({ color: 0x3ec8ff, transparent: true, opacity: 0.35, depthWrite: false }));
brushMark.visible = false;
brushMark.raycast = () => {};
scene.add(brushMark);

function setBrush(b) {
  if (b) cancelPlacing();
  brush = b;
  brushMark.visible = false;
  $('prompt').hidden = !b;
  if (b) $('prompt').textContent = `拖曳${b === 'erase' ? '清除' : '鋪設'} · Esc 或右鍵結束`;
  if (!$('add-panel').hidden) renderAddPanel();
}

function paintAt(at) {
  const i = Math.round(at.x / CELL);
  const j = Math.round(at.z / CELL);
  const k = STREETS.findIndex(st => Math.abs(at.z - st) <= ROAD_HALF);
  if (k >= 0 && brush !== 'zebra') return paintStreet(k, i);
  const zebra = brush === 'zebra' ? zebraAt(at, i, j) : null;
  const ok = brush === 'erase' || (brush === 'zebra' ? !!zebra : paveable(j));
  brushMark.position.set(zebra ? zebra.x : i * CELL, 0.07, zebra ? zebra.z : j * CELL);
  brushMark.material.color.setHex(ok ? 0x3ec8ff : 0xff5a5a);
  brushMark.visible = true;
  if (!stroke || !ok) return;
  if (zebra) {
    zebras.push(zebra);
    return drawZebras();
  }
  if (brush === 'erase' && zebras.some(zb => inCell(zb, i, j))) setZebras(zebras.filter(zb => !inCell(zb, i, j)));
  const key = cellKey(i, j);
  const want = brush === 'erase' ? undefined : brush;
  if (tiles.get(key) === want) return;
  if (want) tiles.set(key, want);
  else tiles.delete(key);
  drawTiles();
  paveSidewalks();
}

// On a street the road brush adds a column just past its end, and the
// erase brush takes it back to the column before (and any crossings there).
function paintStreet(k, i) {
  const [lo, hi] = streetSpan(k);
  const out = i > hi ? i - hi : lo - i; // columns past the end
  const extra = Math.abs(i) > STREET_COLS && i >= lo && i <= hi;
  const ok = brush === 'road' ? out <= 1 && Math.abs(i) <= MAX_COL : brush === 'erase';
  brushMark.position.set(i * CELL, 0.07, STREETS[k]);
  brushMark.material.color.setHex(ok ? 0x3ec8ff : 0xff5a5a);
  brushMark.visible = true;
  if (!stroke || !ok) return;
  const near = zb => !zb.ns && zb.z === STREETS[k] && Math.abs(zb.x - i * CELL) <= CELL / 2 + 1e-6;
  if (brush === 'erase' && zebras.some(near)) setZebras(zebras.filter(zb => !near(zb)));
  if (brush === 'road' && out === 1) {
    tiles.set(`s${k},${i}`, 'road');
  } else if (brush === 'erase' && extra) {
    for (let c = i; c >= lo && c <= hi; c += Math.sign(i)) tiles.delete(`s${k},${c}`);
  } else {
    return;
  }
  drawTiles();
  paveSidewalks();
}

function endStroke() {
  const before = stroke;
  stroke = null;
  const sameTiles = before.tiles.size === tiles.size && [...before.tiles].every(([k, v]) => tiles.get(k) === v);
  const sameZebras = before.zebras === JSON.stringify(zebras);
  if (sameTiles && sameZebras) return;
  undos.push(Object.assign([], { tiles: before.tiles, zebras: JSON.parse(before.zebras) }));
  saveLayout();
  if (!sameZebras) settleTown();
}

// Three save slots in this browser, and layouts as .json files to keep or share.
const SLOTS_KEY = 'small-town:layout-slots';
const LAYOUT_FILE = { app: 'small-town', kind: 'layout', version: 1 };

function readSlots() {
  try { return JSON.parse(localStorage.getItem(SLOTS_KEY) || '[null,null,null]'); } catch { return [null, null, null]; }
}

function renderSlots() {
  const slots = readSlots();
  $('slot-list').replaceChildren(...slots.map((slot, i) => {
    const row = document.createElement('div');
    row.className = 'slot';
    const info = document.createElement('div');
    info.innerHTML = `<b>存檔 ${i + 1}</b><span></span>`;
    info.querySelector('span').textContent = slot
      ? `${new Date(slot.savedAt).toLocaleString('zh-TW', { hour12: false })} · ${Object.keys(slot.layout).length} 處變動`
      : '空';
    const save = document.createElement('button');
    save.textContent = '存到這裡';
    save.onclick = () => {
      if (slot && !confirm(`覆蓋存檔 ${i + 1}？`)) return;
      slots[i] = { savedAt: Date.now(), layout: currentLayout() };
      try { localStorage.setItem(SLOTS_KEY, JSON.stringify(slots)); } catch { /* storage unavailable */ }
      renderSlots();
    };
    const load = document.createElement('button');
    load.textContent = '讀取';
    load.disabled = !slot;
    load.onclick = () => loadLayout(slot.layout);
    row.append(info, save, load);
    return row;
  }));
}

$('edit-slots').addEventListener('click', () => {
  $('slots').hidden = !$('slots').hidden;
  if (!$('slots').hidden) renderSlots();
});
$('slots-close').addEventListener('click', () => { $('slots').hidden = true; });
$('layout-export').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ ...LAYOUT_FILE, layout: currentLayout() }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'small-town-layout.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
$('layout-import').addEventListener('click', () => $('layout-file').click());
$('layout-file').addEventListener('change', async e => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (data.app !== LAYOUT_FILE.app || data.kind !== LAYOUT_FILE.kind || typeof data.layout !== 'object') throw new Error();
    loadLayout(data.layout);
  } catch {
    alert('這不是小鎮的佈局檔。');
  }
});

$('edit').addEventListener('click', e => { setEditing(!editing); e.currentTarget.blur(); });
$('edit-undo').addEventListener('click', undo);
$('edit-reset').addEventListener('click', () => {
  if (!confirm('還原成預設的小鎮？所有搬動和刪除都會清除。')) return;
  try { localStorage.removeItem(LAYOUT_KEY); } catch { /* storage unavailable */ }
  location.reload();
});

// ---------- main loop ----------

const clock = new THREE.Clock();
function frame() {
  const dt = Math.min(clock.getDelta(), 0.1);
  time = (time + dt * speed / 3600) % 24;
  applyTime(time);
  const a = Math.min(1, activity(time) + crowdBoost);
  for (const w of walkers) w.update(dt, a);
  for (let i = walkers.length; i--;) if (walkers[i].done) walkers.splice(i, 1);
  updateTraffic(dt, a);
  updateCats(dt);
  wishes.update(dt);
  updatePlayer(dt);
  updateTalk(dt);
  controls.update();
  updateUI();
  composer.render();
  requestAnimationFrame(frame);
}

await Promise.all([buildTown(), addPeople(), addTraffic()]);
addCats();
await applyLayout();
addWishes();
await addWardrobe();
$('loading').classList.add('done');
frame();
