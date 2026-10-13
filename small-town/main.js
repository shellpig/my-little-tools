import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { PASSERBY_LINES } from './residents.js';
import { createWishes, patchSnow, BLESSINGS, RARITY } from './wishes.js';
import { createWardrobe, PARTS, ACCESSORIES } from './wardrobe.js';
import { LEVELS, levelById } from './levels/index.js';
import { HALF, buildWalkGrid, snapCandidates, astar } from './nav.js';
import { buildRail, RAIL_TOP } from './rail.js';
import { createMusicPlayer } from './music.js';
import {
  TRAIN_TYPES, isValidTrainType, DEFAULT_FLEET, DEFAULT_TIMETABLE,
  BUS_PRICE, BUS_MAX, BUS_COLORS, BUS_HEADWAY, FACILITIES,
  normalizeP2, validateTimetable, canAssignTrain, POP, settle,
  lotScore, GROWTH_SPEEDS, GROWTH_MIN_SCORE, SHOP_NAMES
} from './atrain.js';

const BUS_COLOR_LABELS = {
  green: '綠',
  red: '紅',
  blue: '藍',
  yellow: '黃',
  orange: '橘',
  purple: '紫',
  white: '白',
  gray: '灰',
};

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

// Street cross-section along z: two lanes, each as wide as a sidewalk.
const LANE = 0.8;
const ROAD_HALF = LANE;
const SIDEWALK = 0.8;
const FRONTAGE = ROAD_HALF + SIDEWALK; // where building fronts and the park start
const CELL = ROAD_HALF * 2;
const cellKey = (i, j) => `${i},${j}`;

// ---------- level and saved game ----------

const GAME_KEY = 'small-town:game';
const LAYOUT_KEY = 'small-town:layout';

// The level's straight road runs expanded to tiles, plus its paved walks.
function defaultTilesObj(lv) {
  const L = lv ?? levelById('town');
  const out = {};
  for (const [i0, j0, i1, j1] of L.roads) {
    const [di, dj] = [Math.sign(i1 - i0), Math.sign(j1 - j0)];
    for (let i = i0, j = j0; ; i += di, j += dj) {
      out[cellKey(i, j)] = 'road';
      if (i === i1 && j === j1) break;
    }
  }
  for (const [i0, j0, i1, j1] of L.walks) {
    const [di, dj] = [Math.sign(i1 - i0), Math.sign(j1 - j0)];
    for (let i = i0, j = j0; ; i += di, j += dj) {
      out[cellKey(i, j)] = 'walk';
      if (i === i1 && j === j1) break;
    }
  }
  return out;
}

// An old unversioned layout becomes '#v': 2: back-street states (z < -3.6)
// move north by 0.8, north/outside tiles and street extensions are dropped
// and merged into the default roads, north EW zebras move while NS ones go.
// Already-versioned layouts pass through untouched. Pure: no storage writes.
function migrateLayout(layout) {
  if (!layout || typeof layout !== 'object') return { '#v': 2 };
  if (layout['#v']) return layout;
  const lv = levelById('town');
  const [iMin, iMax, jMin, jMax] = lv.bounds;
  const out = {};
  for (const [id, s] of Object.entries(layout)) {
    if (id === '#tiles' || id === '#zebras') continue;
    out[id] = (s && typeof s === 'object' && typeof s.z === 'number' && s.z < -3.6) ? { ...s, z: s.z - 0.8 } : s;
  }
  const defaults = defaultTilesObj(levelById('town'));
  const retained = {};
  const raw = layout['#tiles'];
  if (raw && typeof raw === 'object') {
    for (const [key, kind] of Object.entries(raw)) {
      if (key[0] === 's') continue;
      const [i, j] = key.split(',').map(Number);
      if (!Number.isFinite(i) || !Number.isFinite(j)) continue;
      if (i < iMin || i > iMax || j < jMin || j > jMax) continue;
      if (j * CELL < -3.6) continue;
      retained[key] = kind;
    }
  }
  const merged = { ...defaults, ...retained };
  if (JSON.stringify(sortedTiles(merged)) !== JSON.stringify(sortedTiles(defaults))) out['#tiles'] = merged;
  if (Array.isArray(layout['#zebras'])) {
    const zs = [];
    for (const zb of layout['#zebras']) {
      if (!zb || typeof zb !== 'object' || zb.ns) continue;
      zs.push(typeof zb.z === 'number' && zb.z < -3.6 ? { ...zb, z: zb.z - 0.8 } : { ...zb });
    }
    if (JSON.stringify(zs) !== JSON.stringify(lv.zebras)) out['#zebras'] = zs;
  }
  out['#v'] = 2;
  return out;
}

// The current game is { level, layout } in one key, written at once. Without
// one, the old autosave counts as the town level: migrate it and persist the
// game, leaving the old key alone.
function readGame() {
  try {
    const g = JSON.parse(localStorage.getItem(GAME_KEY) || 'null');
    if (g && typeof g.layout === 'object' && g.layout) return { level: levelById(g.level).id, layout: g.layout };
  } catch { /* fall through to the old key */ }
  let old = null;
  try { old = JSON.parse(localStorage.getItem(LAYOUT_KEY) || 'null'); } catch { /* storage unavailable */ }
  const layout = migrateLayout(old && typeof old === 'object' ? old : {});
  try { localStorage.setItem(GAME_KEY, JSON.stringify({ level: 'town', layout })); } catch { /* storage unavailable */ }
  return { level: 'town', layout };
}

const sortedTiles = obj => Object.keys(obj).sort().map(k => [k, obj[k]]);

const game = readGame();
const LEVEL = levelById(game.level);

let p2State = null;
let calDay = 0;
let clockMinutes = 360;
let opsDay = 0;
let nextSettlementMinute = 1800;
let skipModeActive = false;
let updateFleetLiveStatus = null;
let refreshTownTab = null;
const dailyCounts = { stops: [], passes: 0, runs: 0, backhauls: 0 };

function recordTrainRun(kind, typeKey) {
  if (kind === 'stop') {
    dailyCounts.stops.push(typeKey);
    dailyCounts.runs++;
  } else if (kind === 'pass') {
    dailyCounts.passes++;
    dailyCounts.runs++;
  } else if (kind === 'backhaul') {
    dailyCounts.backhauls++;
  }
}

const initTime = +(new URLSearchParams(location.search).get('t') ?? 6);
if (LEVEL.atrain) {
  p2State = normalizeP2(game.layout?.['#p2']);
  opsDay = p2State.day || 0;
  calDay = opsDay + (initTime < 6 ? 1 : 0);
  clockMinutes = calDay * 1440 + initTime * 60;
  nextSettlementMinute = (opsDay + 1) * 1440 + 360;
  document.body.classList.add('has-ops');
}

// Town content comes from the level: buildings, park, gas, lamps, people,
// cat spots, wishes and the camera.
const HOMES = LEVEL.homes;
const SHOPS = LEVEL.shops;
const CIVIC = LEVEL.civic;
const HOTEL = LEVEL.hotel;
const STATION = LEVEL.station;
const PARK = LEVEL.park;
const GAS = LEVEL.gas;
const LOT = LEVEL.parking && LEVEL.gas ? { x: 8, z: LEVEL.gas.z } : null;
const PARKING_STALLS = LOT ? [-1, 1].flatMap(row =>
  [-1.2, -0.6, 0, 0.6, 1.2].map(dx => ({ x: LOT.x + dx, z: LOT.z + row * 0.65, rot: row > 0 ? Math.PI : 0 }))) : [];
const WALKERS = LEVEL.walkers;
const STROLLERS = LEVEL.strollers;

// P1-C railway: fixed cells from the level (town has none). The set marks
// cells no brush may cover; the live handle stays null without rail.
let rail = null;
const railCells = new Set((LEVEL.rail ? LEVEL.rail.cells : []).map(([i, j]) => cellKey(i, j)));

let seed = 11;
const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

// ---------- renderer, scene, camera ----------

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
let quality = 'high';
document.body.prepend(renderer.domElement);

// Rails, trains and cars are cut off at the map's edge, so nothing that
// runs on past it shows over the dark ground beyond.
renderer.localClippingEnabled = true;
const MAP_CLIP = (([i0, i1, j0, j1]) => [
  new THREE.Plane(new THREE.Vector3(1, 0, 0), -(i0 - 0.5) * CELL),
  new THREE.Plane(new THREE.Vector3(-1, 0, 0), (i1 + 0.5) * CELL),
  new THREE.Plane(new THREE.Vector3(0, 0, 1), -(j0 - 0.5) * CELL),
  new THREE.Plane(new THREE.Vector3(0, 0, -1), (j1 + 0.5) * CELL),
])(LEVEL.bounds);
const clipMat = m => Object.assign(m, { clippingPlanes: MAP_CLIP, clipShadows: true });
const clipToMap = root => root.traverse(o => { if (o.isMesh) [o.material].flat().forEach(clipMat); });

const scene = new THREE.Scene();
// How far the overview camera may pull back, the fog band and the sun's
// shadow reach all come from the level.
const VIEW = LEVEL.view;
scene.fog = new THREE.Fog(0x0b1020, ...VIEW.fog);

const camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 0.1, VIEW.fog[1] + 50);
camera.position.set(...LEVEL.camera.position);
const controls = new OrbitControls(camera, renderer.domElement);
controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
controls.target.set(...LEVEL.camera.target);
controls.enableDamping = true;
controls.maxPolarAngle = 1.32;
controls.minDistance = 3;
controls.maxDistance = VIEW.maxDistance;

const sun = new THREE.DirectionalLight(0xffffff, 2);
sun.castShadow = true;
sun.shadow.mapSize.set(4096, 4096);
Object.assign(sun.shadow.camera, { left: -VIEW.shadow, right: VIEW.shadow, top: VIEW.shadow, bottom: -VIEW.shadow, near: 1, far: 80 });
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
// Returns the entry so rail barriers can lift it again when edited away.
const post = (x, z, r) => posts[posts.push({ x, z, r }) - 1];
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
function swatchMask(x, y, w, h, color = '#ffbe73') {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 512, 512);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
  return paletteTexture(c);
}

// The commercial palette with its wall swatch in a pastel instead of white.
const PASTELS = [['#c2dcf4', '#a2bedb'], ['#c6e8bd', '#a5cb9b'], ['#f6e4a2', '#dbc781'],
  ['#f6ccd8', '#dba9b7'], ['#dccdf2', '#bcaad8'], ['#dcdcd8', '#bbbbb6'], ['#80848c', '#61656c'],
  ['#f6d5b4', '#dbb592'], ['#c0e6e2', '#9ccac5']];
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

// Villa walls and roofs as [label, top, bottom]; the first of each is the
// pack's own. Walls sample the swatch at x 192, roofs the one at x 0.
const VILLA_WALLS = [['蜜桃', '#f1be98', '#c9825b'], ['奶油', '#f4d892', '#cfa955'], ['薄荷', '#b2dec4', '#78b293'],
  ['天藍', '#b0cdee', '#7699c6'], ['磚紅', '#e3a08c', '#b56652']];
const VILLA_ROOFS = [['藍', '#6793d8', '#5755bc'], ['紅', '#d66a56', '#a83f38'], ['綠', '#5ea877', '#367352'],
  ['灰', '#727884', '#474b56'], ['咖啡', '#a8714f', '#714632']];
const villaPalettes = new Map();
function villaPalette(wall = 0, roof = 0) {
  if (!wall && !roof) return kit.suburban;
  const key = `${wall},${roof}`;
  if (!villaPalettes.has(key)) {
    const c = document.createElement('canvas');
    c.width = kit.suburban.map.image.width;
    c.height = kit.suburban.map.image.height;
    const ctx = c.getContext('2d');
    ctx.drawImage(kit.suburban.map.image, 0, 0);
    // Each swatch: a flat left half in the top colour, a shaded right half.
    for (const [x, y, [, top, bottom]] of [[192, 256, VILLA_WALLS[wall]], [0, 128, VILLA_ROOFS[roof]]]) {
      const g = ctx.createLinearGradient(0, y, 0, y + 128);
      g.addColorStop(0, top);
      g.addColorStop(1, bottom);
      ctx.fillStyle = top;
      ctx.fillRect(x, y, 32, 128);
      ctx.fillStyle = g;
      ctx.fillRect(x + 32, y, 32, 128);
    }
    villaPalettes.set(key, { ...kit.suburban, map: paletteTexture(c) });
  }
  return villaPalettes.get(key);
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
  url.endsWith('Textures/colormap.png') && !/mini-characters|car-kit|train-kit|industrial/.test(url) ? BLANK : url);
const loader = new GLTFLoader(manager);
const cache = new Map();

function model(pack, name) {
  const folder = pack === 'nature' ? 'GLTF format' : 'GLB format';
  const url = `${ASSETS}/${pack}/Models/${folder}/${name}.glb`;
  // Car and train models share their materials with every copy, so they
  // are clipped once here.
  if (!cache.has(url)) {
    cache.set(url, loader.loadAsync(url).then(gltf => {
      if (pack === 'car-kit' || pack === 'train-kit') clipToMap(gltf.scene);
      if (pack === 'train-kit' && name.startsWith('train-')) lightCarriage(gltf.scene);
      return gltf;
    }));
  }
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
function alignFront(obj, front = -FRONTAGE, facing = 1) {
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
// are open all night. SHOPS, CIVIC and the other town content come from LEVEL
// (see the top of this file).

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

// Where people disappear inside: under the hotel canopy. HOTEL is null on
// levels without one; the door formula matches the town's hotel front.
const HOTEL_DOOR = new THREE.Vector3(0, 0.05, -FRONTAGE + 0.06);
const STATION_DOOR = STATION ? new THREE.Vector3(STATION.x, 0.05, STATION.front + STATION.facing * 0.1) : null;

// The bus stop and its shelter come from the level; both stay empty without a bus.
const STOP_X = LEVEL.bus ? LEVEL.busStop.x : 0;
const SHELTER_X = LEVEL.bus ? LEVEL.busStop.shelterX : 0;
const SHELTER_Z = LEVEL.bus ? LEVEL.busStop.shelterZ : 0;
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

function decorateStation(building, station) {
  const bounds = new THREE.Box3().setFromObject(building);
  const front = bounds.min.z;
  const back = bounds.max.z;
  const top = bounds.max.y;
  const width = bounds.max.x - bounds.min.x;

  const tex = signTexture(station.name, station.bg, station.fg);
  const signMat = new THREE.MeshStandardMaterial({ map: tex, emissive: 0xffffff, emissiveMap: tex, roughness: 0.6 });
  glowing.push([signMat, 0.6]);

  // Entrance sign over north facade and rooftop sign on two posts
  box(Math.min(width * 0.8, 1.4), 0.24, 0.02, signMat, station.x, 0.65, front - 0.012);
  const darkFrame = std(0x2c2f35, { roughness: 0.5, metalness: 0.5 });
  box(1.4, 0.32, 0.04, signMat, station.x, top + 0.26, (front + back) / 2, true);
  for (const dx of [-0.5, 0.5]) box(0.03, 0.12, 0.03, darkFrame, station.x + dx, top + 0.05, (front + back) / 2);

  const platWidth = 4.4;
  const downlight = std(0x222222, { emissive: 0xfff0d0, emissiveIntensity: 0 });
  glowing.push([downlight, 1.5]);
  const drawPlatform = (platZ, platDepth, outward, connectToStation, parent = scene) => {
    // The slab runs a cell past the canopy at each end so a whole train fits.
    box(platWidth + 2 * CELL, 0.12, platDepth, kit.pavement, station.x, 0.06, platZ, false, parent);
    if (connectToStation) {
      box(2.0, 0.04, platZ - platDepth / 2 - back, kit.pavement, station.x, 0.02,
        (back + platZ - platDepth / 2) / 2, false, parent);
    }

    // A matching canopy, warm downlight, sign and bench on each platform.
    for (const dx of [-1.5, 1.5]) {
      box(0.04, 0.46, 0.04, darkFrame, station.x + dx, 0.35, platZ, true, parent);
      post(station.x + dx, platZ, 0.04);
    }
    box(platWidth - 0.4, 0.025, platDepth - 0.3, std(0x3a3d44, { roughness: 0.7 }), station.x, 0.58, platZ, true, parent);
    box(platWidth - 1.0, 0.006, 0.15, downlight, station.x, 0.565, platZ, false, parent);

    const signZ = platZ + outward * 0.15;
    box(0.8, 0.18, 0.02, signMat, station.x, 0.42, signZ, false, parent);
    for (const dx of [-0.3, 0.3]) box(0.02, 0.28, 0.02, darkFrame, station.x + dx, 0.26, signZ, false, parent);

    const benchZ = platZ + outward * 0.25;
    box(0.5, 0.015, 0.12, std(0x8a5a3a, { roughness: 0.7 }), station.x + 1.0, 0.18, benchZ, true, parent);
    for (const dx of [-0.2, 0.2]) box(0.02, 0.06, 0.1, darkFrame, station.x + 1.0 + dx, 0.15, benchZ, false, parent);
  };
  // North edge stays at z=4.8; its south edge now stops at z=5.7.
  drawPlatform(5.25, 0.9, -1, true);
  // The south platform sits beyond the eastbound track and ends at z=8.0.
  const southPlatform = new THREE.Group();
  scene.add(southPlatform);
  drawPlatform(7.6, 0.8, 1, false, southPlatform);
  return southPlatform;
}

function buildStation(commercial) {
  const mat = paletteMaterial(commercial, 1.2);
  return building('commercial', STATION.model, STATION.x, STATION, mat).then(obj => {
    let southPlatform;
    const c = collect(() => { southPlatform = decorateStation(obj, STATION); });
    // Preserve the pivot used by existing station saves. The original north
    // slab ended at z=6.0; the new south platform stays attached but does not
    // change the station's saved origin.
    const pivotBounds = new THREE.Box3();
    for (const part of [obj, ...c.parts.filter(part => part !== southPlatform)]) pivotBounds.expandByObject(part);
    pivotBounds.max.z = Math.max(pivotBounds.max.z, 6.0);
    const item = editable('station', [obj, ...c.parts], {
      ...c,
      pivotBounds,
      solids: [obj.userData.solid, ...c.solids],
      places: [PLACES.get(STATION.name)],
      points: [STATION_DOOR],
    });
    if (LEVEL.atrain) {
      const b = new THREE.Box3().setFromObject(item.pivot);
      stationVoice = { obj: item.pivot, bubbleY: b.max.y - b.min.y + 0.1 };
    }
  });
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
// around a fountain, with cross paths out to the side gates. PARK is null on
// levels without one; every bench, seat and path below stays empty then.

// Benches sit outside the ring on the diagonals, facing the fountain.
const benchSeats = !PARK ? [] : [45, 135, 225, 315].flatMap(deg => {
  const a = THREE.MathUtils.degToRad(deg);
  const rotation = Math.atan2(-Math.cos(a), -Math.sin(a));
  const x = Math.cos(a) * (PARK.ring + 0.33);
  const z = PARK.cz + Math.sin(a) * (PARK.ring + 0.33);
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
  if (!PARK) return false;
  const r = Math.hypot(x, z - PARK.cz);
  return r < PARK.ring + 0.5 // fountain, ring and benches
    || (Math.abs(x) < 0.45 && z < PARK.cz) // entrance path
    || (Math.abs(z - PARK.cz) < 0.4); // cross paths
}

// Filled in by buildPark for the wishing fountain.
const fountain = {};

// A tree of either size, turned and scaled at random, that the editor can move.
let trees = 0;
function plantTree(x, z, plantMat) {
  const id = `tree:${trees++}`;
  const c = collect(() => post(x, z, 0.1));
  return place('suburban', rand() < 0.5 ? 'tree-large' : 'tree-small',
    { x, z, rot: rand() * 6, scale: 1 + rand() * 0.5, mat: plantMat }).then(obj => editable(id, [obj], c));
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
  const tree = (x, z) => jobs.push(plantTree(x, z, plantMat));
  for (let placed = 0; placed < 26;) {
    const x = (rand() * 2 - 1) * (xHalf - 0.25);
    const z = zMin + 0.25 + rand() * (zMax - zMin - 0.5);
    if (onPath(x, z)) continue;
    tree(x, z);
    placed++;
  }
  // Outside the park, but short of the map's south edge.
  const edgeZ = (LEVEL.bounds[3] + 0.5) * CELL;
  for (let placed = 0; placed < 22;) {
    const x = -11 + rand() * 22;
    const z = zMax + 0.4 + rand() * (edgeZ - 0.3 - zMax - 0.4);
    if (LEVEL.paths.some(([x0, z0, x1, z1]) => x > x0 - 0.2 && x < x1 + 0.2 && z > z0 - 0.2 && z < z1 + 0.2)) continue;
    tree(x, z);
    placed++;
  }
}

// ---------- town layout ----------

// P1-C: with rail data, lay the tracks, the train and the crossings after
// the town exists (so tiles and roads are real) but before the layout's
// painted roads land. Without rail data this is a no-op: nothing loads,
// nothing renders, rand() is untouched.
// Train windows (the Train Kit's light-blue glass swatch) light up at night
// in a warm white, on every carriage material.
let carriageGlow = null;
function lightCarriage(root) {
  carriageGlow ??= swatchMask(0, 384, 64, 128, '#ffe6bf');
  root.traverse(o => {
    if (!o.isMesh || o.material.emissiveMap) return;
    Object.assign(o.material, { emissive: new THREE.Color(0xffffff), emissiveMap: carriageGlow, emissiveIntensity: 0 });
    glowing.push([o.material, 1.1]);
  });
}

async function initRail() {
  if (!LEVEL.rail) return;
  const headlight = clipMat(std(0x333333, { emissive: 0xfff1d6, emissiveIntensity: 0 }));
  glowing.push([headlight, 4]);
  rail = await buildRail({
    LEVEL, CELL, scene, tiles, roads, posts,
    model, place, post, dirOf, headlight,
    onStationStop: burstCommuters,
    onTrainRun: recordTrainRun,
    fleet: p2State ? p2State.fleet : undefined,
    timetable: p2State ? p2State.timetable : undefined,
    clockMinutes,
    opsDay,
  });
}

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
  // Grass over the map's bounds; dark ground beyond, where nothing can be built.
  const [iMin, iMax, jMin, jMax] = LEVEL.bounds;
  box(400, 0.1, 400, std(0x3a3c40), 0, -0.08, 0);
  box((iMax - iMin + 1) * CELL, 0.1, (jMax - jMin + 1) * CELL, std(0x667a52),
    (iMin + iMax) / 2 * CELL, -0.049, (jMin + jMax) / 2 * CELL);
  Object.assign(kit, { pavement: std(0xb3ada3), curb: std(0xd2ccc0) });
  paveSidewalks();
  // The streets' road surface is drawn with the painted roads.
  const jobs = [drawTiles()];
  buildAlleys();

  // The hotel in the middle; the bus stop is outside the convenience store.
  if (HOTEL) {
    jobs.push(place('commercial', HOTEL.model, { x: 0, mat: paletteMaterial(commercial, 0.6, 0.5, 0.3) }).then(obj => {
      const c = collect(() => decorateHotel(solidOf(alignFront(obj))));
      editable('hotel', [obj, ...c.parts], { ...c, points: [HOTEL_DOOR] });
    }));
  }
  if (STATION) jobs.push(buildStation(commercial));
  if (LEVEL.bus) buildBusStop();

  // Shops and public buildings, each with a sign and the shops with awnings.
  const storeDoor = PLACES.get('便利商店')?.door;
  for (const shop of [...SHOPS, ...CIVIC]) {
    const mat = paletteMaterial(commercial, shop.glow, shop.closes);
    jobs.push(building('commercial', shop.model, shop.x, shop, mat).then(obj => {
      const c = collect(() => decorateShop(obj, shop));
      paintable(editable(`shop:${shop.name}`, [obj, ...c.parts], {
        solids: [obj.userData.solid], places: [PLACES.get(shop.name)], points: shop.name === '便利商店' && storeDoor ? [storeDoor] : [],
      }), mat, false);
    }));
  }

  // Homes fill the rest of the rows.
  const townHouses = ['building-b', 'building-d', 'building-f', 'building-g'];
  const villas = ['building-type-a', 'building-type-c', 'building-type-e', 'building-type-g'];
  HOMES.forEach((home, i) => {
    const mat = home.villa ? villaMat() : townHouseMat(i);
    const made = home.villa
      ? building('suburban', villas[i % villas.length], home.x, home, mat)
      : building('commercial', home.x === 0 ? 'building-e' : townHouses[i % 4], home.x, home, mat);
    jobs.push(made.then(obj => paintable(editable(`home:${i}`, [obj], { solids: [obj.userData.solid], places: [homeDoors[i]] }),
      mat, !!home.villa)));
  });

  // South of the main street: the park, with a gas station and a car park either side.
  if (PARK) buildPark(jobs, houseMat);
  for (const [x, z] of LEVEL.trees) jobs.push(plantTree(x, z, houseMat));
  if (GAS) buildGasStation();
  if (LOT) buildParkingLot();

  // Street lamps from the level, with a real light under each head.
  kit.bulbMat = std(0x222222, { emissive: 0xffd9a0, emissiveIntensity: 0 });
  glowing.push([kit.bulbMat, 6]);
  LEVEL.lamps.forEach((lamp, i) => jobs.push(streetLamp(`lamp:${i}`, lamp.x, lamp.z, lamp.side, lamp.model)));

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
  for (const [x0, z0, x1, z1] of LEVEL.paths) box(x1 - x0, 0.02, z1 - z0, paving, (x0 + x1) / 2, 0.01, (z0 + z1) / 2);
}

// ---------- gas station and car park ----------

// GAS, LOT and PARKING_STALLS come from LEVEL (see the top of this file).

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
  poleSign('加油站', '#d2352b', '#ffffff', x + 1.5, z - 1.25, 0.7);

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
  poleSign('停車場', '#1f5fae', '#ffffff', x - 1.55, z - 1.25, 0.6);
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

// ---------- pedestrian navigation (P1-A2) ----------

// The walk grid and the cached un-offset paths. Rebuilt in settleTown()
// whenever tiles, zebras or buildings change; never per frame.
let walkGrid = null;
const pathCache = new Map();
// Snapped doorways, and the nav blocks with their coarse buckets. Solids
// only move with settleTown/rebuildNav, so the snapshot and the index live
// as long as the walk grid does.
const snapCache = new Map();
let navSolids = [];
const blockBuckets = new Map();

// The sidewalk rules in one place: the walk grid and the drawn paving both
// read these. Each entry is a walkable rect plus what drawing needs: the
// road cell it rings and the strip side, or side 0 for a corner fill.
function sidewalkRects() {
  const out = [];
  const R = CELL / 2;
  const SW = SIDEWALK;
  const [iMin, iMax, jMin, jMax] = LEVEL.bounds;
  for (const [i, j, kind] of gridCells()) {
    if (kind !== 'road') continue;
    const x = i * CELL;
    const z = j * CELL;
    const road = (a, b) => tiles.get(cellKey(a, b)) === 'road';
    const hasN = road(i, j - 1);
    const hasE = road(i + 1, j);
    const hasS = road(i, j + 1);
    const hasW = road(i - 1, j);
    const openN = j === jMin;
    const openE = i === iMax;
    const openS = j === jMax;
    const openW = i === iMin;
    if (!hasN && !openN) out.push({ r: [x - R, z - R - SW, x + R, z - R], side: NORTH, x, z });
    if (!hasS && !openS) out.push({ r: [x - R, z + R, x + R, z + R + SW], side: SOUTH, x, z });
    if (!hasE && !openE) out.push({ r: [x + R, z - R, x + R + SW, z + R], side: EAST, x, z });
    if (!hasW && !openW) out.push({ r: [x - R - SW, z - R, x - R, z + R], side: WEST, x, z });
    const corner = (sx, sz, ha, hb, oa, ob) => {
      if (ha || hb || oa || ob) return;
      out.push({
        r: [x + sx * (R + SW / 2) - SW / 2, z + sz * (R + SW / 2) - SW / 2,
          x + sx * (R + SW / 2) + SW / 2, z + sz * (R + SW / 2) + SW / 2],
        side: 0, x, z,
      });
    };
    corner(1, -1, hasE, hasN, openE, openN);
    corner(-1, -1, hasW, hasN, openW, openN);
    corner(1, 1, hasE, hasS, openE, openS);
    corner(-1, 1, hasW, hasS, openW, openS);
    const inner = (di, dj) => {
      if (!road(i + di, j) || !road(i, j + dj) || road(i + di, j + dj)) return;
      out.push({
        r: [x + di * (R + SW / 2) - SW / 2, z + dj * (R + SW / 2) - SW / 2,
          x + di * (R + SW / 2) + SW / 2, z + dj * (R + SW / 2) + SW / 2],
        side: 0, x, z,
      });
    };
    inner(1, -1);
    inner(-1, -1);
    inner(1, 1);
    inner(-1, 1);
  }
  return out;
}

function rebuildNav() {
  const roads = [];
  const walks = [];
  for (const [key, kind] of tiles) {
    const [i, j] = key.split(',').map(Number);
    (kind === 'road' ? roads : walks).push([i, j]);
  }
  // The park entrance gap is a narrow connector like the alleys: its fence
  // band only fits through the sampled grid via the clear-corridor rule.
  const paths = PARK
    ? [...LEVEL.paths, [-0.45, FRONTAGE - 0.4, 0.45, PARK.cz - PARK.ring + 0.4]]
    : LEVEL.paths;
  // The fountain basin blocks like a solid so no path crosses the water.
  navSolids = PARK
    ? [...solids, { minX: -0.6, maxX: 0.6, minZ: PARK.cz - 0.6, maxZ: PARK.cz + 0.6 }]
    : [...solids];
  blockBuckets.clear();
  navSolids.forEach((s, k) => {
    for (let bx = Math.floor(s.minX / CELL); bx <= Math.floor(s.maxX / CELL); bx++) {
      for (let bz = Math.floor(s.minZ / CELL); bz <= Math.floor(s.maxZ / CELL); bz++) {
        const key = `${bx},${bz}`;
        let list = blockBuckets.get(key);
        if (!list) blockBuckets.set(key, list = []);
        list.push(k);
      }
    }
  });
  walkGrid = buildWalkGrid({
    bounds: LEVEL.bounds, roadCells: roads, walkCells: walks,
    sidewalkRects: sidewalkRects().map(e => e.r), paths, park: PARK, zebras, solids: navSolids,
  });
  pathCache.clear();
  snapCache.clear();
}

// Whether the segment cuts through a footprint interior. Only touched
// edges do not count, matching the strict comparisons of the old sampling.
function segHitsBlock(x0, z0, x1, z1, s) {
  let enter = 0;
  let exit = 1;
  const dx = x1 - x0;
  if (!dx) {
    if (x0 <= s.minX || x0 >= s.maxX) return false;
  } else {
    let t0 = (s.minX - x0) / dx;
    let t1 = (s.maxX - x0) / dx;
    if (t0 > t1) [t0, t1] = [t1, t0];
    enter = Math.max(enter, t0);
    exit = Math.min(exit, t1);
    if (enter >= exit) return false;
  }
  const dz = z1 - z0;
  if (!dz) {
    if (z0 <= s.minZ || z0 >= s.maxZ) return false;
  } else {
    let t0 = (s.minZ - z0) / dz;
    let t1 = (s.maxZ - z0) / dz;
    if (t0 > t1) [t0, t1] = [t1, t0];
    enter = Math.max(enter, t0);
    exit = Math.min(exit, t1);
  }
  return enter < exit;
}

// A segment stays clear of every solid footprint (and the fountain basin).
function segmentBlocked(x0, z0, x1, z1) {
  const seen = new Set();
  for (let bx = Math.floor(Math.min(x0, x1) / CELL); bx <= Math.floor(Math.max(x0, x1) / CELL); bx++) {
    for (let bz = Math.floor(Math.min(z0, z1) / CELL); bz <= Math.floor(Math.max(z0, z1) / CELL); bz++) {
      const list = blockBuckets.get(`${bx},${bz}`);
      if (!list) continue;
      for (const k of list) {
        if (seen.has(k)) continue;
        seen.add(k);
        if (segHitsBlock(x0, z0, x1, z1, navSolids[k])) return true;
      }
    }
  }
  return false;
}

// The nearest walkable cell to a doorway whose connector stays clear.
function snapDoor(x, z) {
  if (!walkGrid) return null;
  const key = `${x},${z}`;
  if (snapCache.has(key)) return snapCache.get(key);
  let found = null;
  for (const c of snapCandidates(walkGrid, x, z, 4).slice(0, 24)) {
    if (!segmentBlocked(x, z, c.x, c.z)) {
      found = c;
      break;
    }
  }
  snapCache.set(key, found);
  return found;
}

function stripCells(cells) {
  if (cells.length <= 2) return cells;
  const out = [cells[0]];
  for (let i = 1; i < cells.length - 1; i++) {
    const p = out[out.length - 1];
    const c = cells[i];
    const n = cells[i + 1];
    if (Math.sign(c.hi - p.hi) === Math.sign(n.hi - c.hi)
      && Math.sign(c.hj - p.hj) === Math.sign(n.hj - c.hj)) continue;
    out.push(c);
  }
  out.push(cells[cells.length - 1]);
  return out;
}

// The cached un-offset walk points between two snapped cells: zebra
// crossings first, a cost-25 road crossing only when nothing else
// connects. Null when the cells do not connect at all.
function cachedRawPath(a, b) {
  const key = `${a.hi},${a.hj}>${b.hi},${b.hj}`;
  let raw = pathCache.get(key);
  if (!raw) {
    const cells = stripCells(astar(walkGrid, a, b, false) ?? astar(walkGrid, a, b, true) ?? []);
    if (!cells.length) return null;
    const { cols, px, pz } = walkGrid;
    raw = cells.map(({ hi, hj }) => {
      const idx = (hj - walkGrid.hj0) * cols + (hi - walkGrid.hi0);
      return [px[idx], pz[idx]];
    });
    pathCache.set(key, raw);
  }
  return raw;
}

// Shifted to the path's right by lane (0..1).
function lanePoints(raw, lane) {
  const off = lane * 0.25;
  return raw.map(([x, z], i) => {
    const p = raw[Math.max(0, i - 1)];
    const n = raw[Math.min(raw.length - 1, i + 1)];
    const dx = n[0] - p[0];
    const dz = n[1] - p[1];
    const d = Math.hypot(dx, dz) || 1;
    return new THREE.Vector3(x - dz / d * off, 0.05, z + dx / d * off);
  });
}

// The shifted points between the endpoints, falling back to the un-offset
// points when the shifted line clips a solid.
function finishRoute(start, raw, lane, end) {
  const pts = lanePoints(raw, lane);
  const full = end ? [start.clone(), ...pts, end.clone()] : [start.clone(), ...pts];
  if (full.some((q, i) => i && segmentBlocked(full[i - 1].x, full[i - 1].z, q.x, q.z))) {
    full.splice(1, pts.length, ...raw.map(([x, z]) => new THREE.Vector3(x, 0.05, z)));
  }
  const lengths = full.slice(1).map((q, k) => q.distanceTo(full[k]));
  return { pts: full, lengths, length: lengths.reduce((x, y) => x + y, 0) };
}

// Door to door along the walk grid: zebra crossings first, a cost-25 road
// crossing only when nothing else connects. Cached un-offset by snapped
// endpoints, then cloned and shifted to the path's right by lane (0..1).
function findRoute(fromDoor, toDoor, lane = 0.5) {
  if (!walkGrid) return null;
  const a = snapDoor(fromDoor.x, fromDoor.z);
  const b = snapDoor(toDoor.x, toDoor.z);
  if (!a || !b) return null;
  const raw = cachedRawPath(a, b);
  if (!raw) return null;
  return finishRoute(fromDoor, raw, lane, toDoor);
}

// From an arbitrary spot (not a door) to a walk-grid point.
function findRoutePos(p, tx, tz, lane = 0.5) {
  if (!walkGrid) return null;
  const a = snapDoor(p.x, p.z);
  const hi = Math.floor(tx / HALF);
  const hj = Math.floor(tz / HALF);
  if (!a || hi < walkGrid.hi0 || hi > walkGrid.hi1 || hj < walkGrid.hj0 || hj > walkGrid.hj1) return null;
  const b = { hi, hj, x: (hi + 0.5) * HALF, z: (hj + 0.5) * HALF };
  if (!walkGrid.cost[(hj - walkGrid.hj0) * walkGrid.cols + (hi - walkGrid.hi0)]) return null;
  const raw = cachedRawPath(a, b);
  if (!raw) return null;
  return finishRoute(p, raw, lane, null);
}

function randomWalkCellNear(x, z, minD, maxD) {
  if (!walkGrid) return null;
  for (let k = 0; k < 20; k++) {
    const hi = walkGrid.hi0 + Math.floor(rand() * walkGrid.cols);
    const hj = walkGrid.hj0 + Math.floor(rand() * walkGrid.rows);
    const idx = (hj - walkGrid.hj0) * walkGrid.cols + (hi - walkGrid.hi0);
    if (walkGrid.cost[idx] !== 1) continue;
    const cx = walkGrid.px[idx];
    const cz = walkGrid.pz[idx];
    const d = Math.hypot(cx - x, cz - z);
    if (d >= minD && d <= maxD) return { x: cx, z: cz };
  }
  return null;
}

class Walker extends Person {
  constructor(gltf, rank) {
    super(gltf, rank);
    this.startWalking(0.32 + rand() * 0.12);
    this.idle = this.action('idle');
    this.pause = 0;
    this.state = 'walking';
    this.pts = null;
    this.seg = 1;
    const c = walkGrid ? randomWalkCellNear(0, 0, 0, 12) : null;
    this.obj.position.set(c ? c.x : 0, 0.05, c ? c.z : FRONTAGE);
    this.face(rand() * Math.PI * 2);
  }

  pickGoal() {
    const p = this.obj.position;
    for (let k = 0; k < 5; k++) {
      const c = randomWalkCellNear(p.x, p.z, 4, 12);
      if (!c) continue;
      const r = findRoutePos(p, c.x, c.z, 0.5);
      if (r && r.length > 0.5) {
        this.pts = r.pts;
        this.seg = 1;
        return true;
      }
    }
    return false;
  }

  rest() {
    this.pause = 2 + Math.random() * 4;
    this.walk.fadeOut(0.3);
    this.idle.reset().fadeIn(0.3).play();
  }

  stepAlong(dt) {
    const p = this.obj.position;
    const t = this.pts[this.seg];
    if (!t) return true;
    const dx = t.x - p.x;
    const dz = t.z - p.z;
    const d = Math.hypot(dx, dz);
    const step = this.speed * dt;
    if (d <= Math.max(step, 0.03)) {
      // A shut crossing holds back whoever is still outside it.
      if (rail && rail.shouldWait(p.x, p.z, t.x, t.z)) return false;
      p.set(t.x, 0.05, t.z);
      this.seg++;
      return this.seg >= this.pts.length;
    }
    const nx = p.x + dx / d * step;
    const nz = p.z + dz / d * step;
    if (rail && rail.shouldWait(p.x, p.z, nx, nz)) return false;
    p.x = nx;
    p.z = nz;
    p.y = 0.05;
    this.face(Math.atan2(dx, dz));
    return false;
  }

  update(dt, activity) {
    this.mixer.update(dt);
    const p = this.obj.position;
    const home = this.rank >= activity;
    if (this.state === 'away') {
      if (home) return;
      const doors = LEVEL.atrain ? destinations() : [...PLACES.values()];
      const door = doors[Math.floor(Math.random() * doors.length)]?.door;
      if (!door) return;
      p.set(door.x, 0.05, door.z);
      this.obj.visible = true;
      this.state = 'walking';
      this.pts = null;
      return;
    }
    if (home) {
      if (this.state !== 'leaving') {
        if (this.pause > 0) {
          this.pause = 0;
          this.idle.fadeOut(0.3);
          this.walk.reset().fadeIn(0.3).play();
        }
        let best = null;
        let bestD = Infinity;
        for (const pl of LEVEL.atrain ? destinations() : [...PLACES.values(), ...homeDoors]) {
          const d = Math.hypot(pl.door.x - p.x, pl.door.z - p.z);
          if (d < bestD) [best, bestD] = [pl.door, d];
        }
        const r = best && findRoutePos(p, best.x, best.z, 0.5);
        if (r && r.pts.length > 1) {
          this.pts = r.pts;
          this.seg = 1;
          this.state = 'leaving';
        } else {
          this.obj.visible = false;
          this.state = 'away';
          return;
        }
      }
      if (this.stepAlong(dt)) {
        this.obj.visible = false;
        this.state = 'away';
      }
      return;
    }
    if (this.pause > 0) {
      this.pause -= dt;
      if (this.pause <= 0) {
        this.idle.fadeOut(0.3);
        this.walk.reset().fadeIn(0.3).play();
      }
      return;
    }
    if (!this.pts) {
      if (!this.pickGoal()) {
        this.rest();
        return;
      }
    }
    const door = nearShopDoor(p);
    if (door && Math.random() < dt * 0.15) {
      // Window shopping: turn to the shop doorway.
      this.rest();
      this.face(Math.atan2(door.x - p.x, door.z - p.z));
      return;
    }
    if (this.stepAlong(dt)) this.pts = null;
  }
}

// Walks laps around the park's ring path, and leaves and returns straight
// across the lawn among the trees. Only built when the level has a park.
const STROLL_OUT = PARK ? PARK.ring + 0.6 : 0;

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
    const pa = this.angle;
    const pr = this.r;
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
    const nx = Math.cos(this.angle) * this.r;
    const nz = PARK.cz + Math.sin(this.angle) * this.r;
    // Whoever is already on a shut crossing walks off; the rest hold back.
    if (rail && rail.shouldWait(this.obj.position.x, this.obj.position.z, nx, nz)) {
      this.angle = pa;
      this.r = pr;
      return;
    }
    this.obj.position.set(nx, 0.03, nz);
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

// Walks once from one point to another along the walk grid, then goes
// inside (is removed): passengers getting off the bus, or out to catch it.
// Without a path the passenger never appears.
class Passenger extends Person {
  constructor(gltf, from, to, delay) {
    super(gltf, 0);
    this.startWalking(0.3);
    this.obj.position.copy(from);
    this.obj.visible = false;
    this.delay = delay;
    this.to = to;
    const r = findRoute(from, to, Math.random());
    if (!r) {
      this.done = true;
      scene.remove(this.obj);
      return;
    }
    this.pts = r.pts;
    this.seg = 1;
  }

  update(dt) {
    if (this.done) return;
    if ((this.delay -= dt) > 0) return;
    this.obj.visible = true;
    this.mixer.update(dt);
    const p = this.obj.position;
    const t = this.pts[this.seg];
    if (!t) {
      this.done = true;
      scene.remove(this.obj);
      return;
    }
    const dx = t.x - p.x;
    const dz = t.z - p.z;
    const d = Math.hypot(dx, dz);
    if (d < 0.03) {
      if (rail && rail.shouldWait(p.x, p.z, t.x, t.z)) return;
      this.seg++;
      return;
    }
    const step = Math.min(d, this.speed * dt);
    const nx = p.x + dx / d * step;
    const nz = p.z + dz / d * step;
    // A shut crossing holds back whoever is still outside it.
    if (rail && rail.shouldWait(p.x, p.z, nx, nz)) return;
    p.x = nx;
    p.z = nz;
    p.y = 0.05;
    this.face(Math.atan2(dx, dz));
  }
}

// ---------- residents ----------

// Residents walk a day plan in game time: where they are follows the clock,
// so scrubbing or speeding up time moves them like a time-lapse.
const WALK_SPEED = 22.8; // town units per game hour: 0.38 per second at 60×

const partOfDay = t => (t >= 5 && t < 11 ? 'morning' : t >= 11 && t < 17 ? 'day' : t >= 17 && t < 22 ? 'evening' : 'night');

// A place is a doorway: the door point itself, plus flags for the park and
// for removed buildings.
function doorOf(x, front, facing, extra = {}) {
  return { door: new THREE.Vector3(x, 0.05, front + facing * 0.05), ...extra };
}

const PLACES = new Map([
  ...[...SHOPS, ...CIVIC].map(s => [s.name, doorOf(s.x, s.front, s.facing)]),
  ...(HOTEL ? [[HOTEL.name, { door: HOTEL_DOOR }]] : []),
  ...(STATION ? [[STATION.name, { door: STATION_DOOR }]] : []),
  ...(LEVEL.bus ? [['公車站', { door: new THREE.Vector3(STOP_X - 0.43, 0.05, -ROAD_HALF - 0.06) }]] : []),
  ...(GAS ? [['加油站', { door: new THREE.Vector3(GAS.x - 1.1, 0.05, GAS.z + 0.35) }]] : []),
  ...(PARK ? [['公園', { door: new THREE.Vector3(0, 0.03, PARK.cz - PARK.ring), park: true }]] : []),
]);

// Hand out homes in order: upstairs from the workplace, or the next free
// town house or villa (villas are shared by families when they run out).
// A missing workplace counts as home.
const homeDoors = HOMES.map(h => doorOf(h.x, h.front, h.facing));
const townHouseDoors = homeDoors.filter((_, i) => !HOMES[i].villa);
const villaDoors = homeDoors.filter((_, i) => HOMES[i].villa);
let nextTownHouse = 0;
let nextVilla = 0;
function homeFor(info) {
  if (info.home === 'upstairs') return PLACES.get(info.work) ?? townHouseDoors[0] ?? villaDoors[0];
  if (info.home === 'villa') return villaDoors[nextVilla++ % villaDoors.length];
  return townHouseDoors[nextTownHouse++ % townHouseDoors.length];
}

// A shop doorway near a spot, for window shopping.
function nearShopDoor(p) {
  let best = null;
  let bestD = 0.6;
  for (const s of SHOPS) {
    const pl = PLACES.get(s.name);
    if (!pl) continue;
    const d = Math.hypot(pl.door.x - p.x, pl.door.z - p.z);
    if (d < bestD) [best, bestD] = [pl.door, d];
  }
  return best;
}

class Resident extends Person {
  constructor(gltf, info) {
    super(gltf, 0);
    this.info = info;
    this.walk = this.action('walk');
    this.walk.play();
    this.lane = rand();
    this.strollDir = rand() < 0.5 ? 1 : -1;
    this.home = homeFor(info) ?? [...PLACES.values()][0];
    this.plan();
  }

  // Each leg runs from the actual location the previous leg reached, found
  // with A*. A leg that cannot be walked stays where it is (stuck: true,
  // to = at, a single point) and the next leg starts there. The first leg
  // starts where yesterday ended: plan once from home to learn that spot,
  // then plan again from it. Going upstairs from the shop below is no walk
  // at all. A missing destination, or a stop whose building has been
  // removed, is spent at home instead.
  plan() {
    const stops = this.info.plan.map(([hour, key]) => {
      const dest = key === 'home' ? this.home : PLACES.get(key);
      return [hour, !dest || dest.removed ? this.home : dest];
    });
    const run = startAt => {
      let at = startAt;
      const legs = [];
      for (const [start, to] of stops) {
        if (to === at) {
          legs.push({ start, to, stuck: false, pts: [to.door.clone()], lengths: [0], length: 0 });
        } else {
          const r = findRoute(at.door, to.door, this.lane);
          if (!r) legs.push({ start, to: at, stuck: true, pts: [at.door.clone()], lengths: [0], length: 0 });
          else legs.push({ start, to, stuck: false, pts: r.pts, lengths: r.lengths, length: r.length });
        }
        at = legs.at(-1).to;
      }
      return { legs, end: at };
    };
    this.legs = run(run(this.home).end).legs;
    // Crossing waits delay the personal day plan, including later legs.
    this.waitH = 0;
  }

  speech() {
    return { name: this.info.name, role: this.info.job, line: this.info.say[partOfDay(time)] };
  }

  update(dt) {
    this.walk.timeScale = Math.min(speed / 60, 4);
    this.mixer.update(dt);
    const personalTime = rail ? ((time - this.waitH) % 24 + 24) % 24 : time;
    const leg = this.legs.findLast(l => l.start <= personalTime) ?? this.legs.at(-1);
    const gameDt = dt * speed / 3600;
    const locate = walked => {
      let k = 0;
      let rest = walked;
      while (rest > leg.lengths[k]) rest -= leg.lengths[k++];
      return { k, rest };
    };
    const walked = ((personalTime - leg.start + 24) % 24) * WALK_SPEED;
    const p = this.obj.position;
    if (rail && leg.length) {
      const previous = locate(Math.min(Math.max(0, walked - gameDt * WALK_SPEED), leg.length - 1e-9));
      const next = locate(Math.min(walked, leg.length - 1e-9));
      const a = leg.pts[next.k], b = leg.pts[next.k + 1];
      const f = next.rest / leg.lengths[next.k];
      const target = { x: a.x + (b.x - a.x) * f, z: a.z + (b.z - a.z) * f };
      let at = p;
      let blocked = false;
      for (let k = previous.k + 1; k <= next.k; k++) {
        const to = leg.pts[k];
        if (rail.shouldWait(at.x, at.z, to.x, to.z)) { blocked = true; break; }
        at = to;
      }
      if (blocked || rail.shouldWait(at.x, at.z, target.x, target.z)) {
        this.waitH += gameDt;
        return;
      }
    }
    if (walked < leg.length) {
      // On the way: find the segment and the point along it.
      const { k, rest } = locate(walked);
      const a = leg.pts[k];
      const b = leg.pts[k + 1];
      p.lerpVectors(a, b, leg.lengths[k] ? rest / leg.lengths[k] : 1);
      this.face(Math.atan2(b.x - a.x, b.z - a.z));
      this.obj.visible = true;
    } else if (leg.to.park && !leg.stuck) {
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

// ---------- commuters ----------

// Unnamed people between the station door and the buildings: a steady
// trickle through the day, thinner at night, and a burst off every train that
// stops. LEVEL.commuters caps how many are out at once.
const COMMUTER_GAP = 10; // seconds between trickle arrivals at full activity
let commuterT = 0;

class Commuter extends Passenger {
  // The walk grid changed: carry on from here to the same door.
  reroute() {
    const r = findRoute(this.obj.position, this.to, 0.5);
    if (!r) {
      this.done = true;
      scene.remove(this.obj);
      return;
    }
    this.pts = r.pts;
    this.seg = 1;
  }
}

// Doorways in the town that walkers and commuters can head to: shops, civic
// buildings, hotel and homes from the level, plus added houses, villas,
// shops and facilities. Excludes removed items and unreachable doors.
function destinations() {
  const list = [...SHOPS, ...CIVIC, ...(HOTEL ? [HOTEL] : [])].map(b => PLACES.get(b.name)).concat(homeDoors);
  for (const item of editables.values()) {
    if (!item.add || item === placing) continue;
    for (const { pl } of item.places) list.push(pl);
  }
  return list.filter(pl => !pl.removed && snapDoor(pl.door.x, pl.door.z) !== null);
}

// A random doorway picked from destinations, or null if none are reachable.
function commuterDoor() {
  const list = destinations();
  if (!list.length) return null;
  return list[Math.floor(Math.random() * list.length)].door;
}

function spawnCommuter(fromStation, delay) {
  if (walkers.filter(w => w instanceof Commuter && !w.done).length >= LEVEL.commuters) return;
  const station = PLACES.get(STATION.name);
  if (station.removed) return;
  const door = commuterDoor();
  if (!door) return;
  const gltf = peopleGltfs[Math.floor(Math.random() * peopleGltfs.length)];
  walkers.push(fromStation ? new Commuter(gltf, station.door, door, delay) : new Commuter(gltf, door, station.door, delay));
}

// A train has stopped: a few step off, more when the town is busy.
function burstCommuters() {
  const n = Math.ceil(6 * activity(time) * (0.5 + Math.random() / 2));
  for (let i = 0; i < n; i++) spawnCommuter(true, i * 0.7);
}

function updateCommuters(dt) {
  if ((commuterT -= dt) > 0) return;
  const a = activity(time);
  commuterT = COMMUTER_GAP / a * (0.5 + Math.random());
  spawnCommuter(Math.random() < 0.5, 0);
}

let peopleGltfs = [];

async function addPeople() {
  const gltfs = peopleGltfs = await Promise.all(PEOPLE.map(n => model('mini-characters', n)));
  const pick = i => gltfs[i % gltfs.length];
  for (let i = 0; i < WALKERS; i++) walkers.push(new Walker(pick(i), WALKERS ? i / WALKERS : 0));
  if (PARK) for (let i = 0; i < STROLLERS; i++) walkers.push(new Stroller(pick(i + 5), STROLLERS ? i / STROLLERS : 0));
  // Only some benches are taken, and people sit mostly in the daytime.
  benchSeats.filter((_, i) => i % 3 !== 2).forEach((seat, i) =>
    walkers.push(new Sitter(pick(i + 9), 0.3 + i * 0.12, seat)));
  if (LEVEL.bus) SHELTER_SEATS.forEach((seat, i) => walkers.push(new Sitter(pick(i + 3), 0.2 + i * 0.35, seat)));
  for (const info of LEVEL.residents) walkers.push(new Resident(gltfs[PEOPLE.indexOf(`character-${info.look}`)], info));
  for (const w of walkers) {
    w.obj.visible = w.rank < activity(time);
    if (!w.obj.visible && w.state) w.state = 'away';
  }
}

// ---------- traffic ----------

// Cars drive the road network: every road cell is a node, and a car crosses
// each node on a curve from the side it came in by to the side it leaves by,
// keeping right. At a junction it picks a way at random, mostly straight on,
// and turns back at a dead end. Only one car is in a junction at a time. Cars
// come in out of the fog at the map's edge cells and leave past them. The bus
// runs its level route, stopping at the stop cell.
const CARS = ['sedan', 'taxi', 'suv', 'van', 'hatchback-sports', 'delivery', 'sedan', 'taxi', 'suv',
  'van', 'hatchback-sports', 'sedan', 'truck'];
const PARKED = ['sedan', 'suv', 'van', 'taxi', 'hatchback-sports', 'sedan', 'suv'];
const CAR_SCALE = 0.2;
const BUS_LENGTH = 1.3;
const BUS_WIDTH = 0.32;
const BUS_DWELL = 7;
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
const FOG_R = 11; // cars appear at the fog edge, as far out as the old road ends
const CAM_HOME = { x: 0, z: -2.2 }; // where the camera looks by default
let edgeEntries = []; // [node key, side it is entered from] at the fog edge
let busRoute = null; // node keys from the bus entry to its exit, via the stop
let busStopKey = null; // node key of the bus stop cell

function buildRoads() {
  roads.clear();
  paths.clear();
  const node = (key, x, z) => roads.set(key, { key, x, z, hx: CELL / 2, hz: CELL / 2, links: new Map(), holder: null });
  const link = (a, side, b) => {
    roads.get(a).links.set(side, b);
    roads.get(b).links.set(opposite(side), a);
  };
  for (const [i, j, kind] of gridCells()) {
    if (kind !== 'road') continue;
    node(cellKey(i, j), i * CELL, j * CELL);
  }
  for (const [i, j, kind] of gridCells()) {
    if (kind !== 'road') continue;
    const key = cellKey(i, j);
    if (roads.has(cellKey(i + 1, j))) link(key, EAST, cellKey(i + 1, j));
    if (roads.has(cellKey(i, j + 1))) link(key, SOUTH, cellKey(i, j + 1));
  }
  // A road tile on the bounds edge opens outward; every such side is an exit.
  const [iMin, iMax, jMin, jMax] = LEVEL.bounds;
  for (const [i, j, kind] of gridCells()) {
    if (kind !== 'road') continue;
    const n = roads.get(cellKey(i, j));
    if (i === iMin) n.links.set(WEST, 'exit');
    if (i === iMax) n.links.set(EAST, 'exit');
    if (j === jMin) n.links.set(NORTH, 'exit');
    if (j === jMax) n.links.set(SOUTH, 'exit');
  }
  edgeEntries = [];
  for (const n of roads.values()) {
    for (const [side, to] of n.links) {
      if (to === 'exit') edgeEntries.push(entryFromEdge(n, side));
    }
  }
  computeBusRoute();
  if (rail) rail.refreshCrossings();
  for (const v of vehicles) if (v.onRoad) v.replan();
}

// From an exit, walk inward along the road to the cell before the first one
// within FOG_R of the camera home (or before a junction met on the way), so
// cars appear out of the fog instead of at the road's end.
function entryFromEdge(edge, exitSide) {
  let entry = edge;
  let entryFrom = exitSide;
  let cur = edge;
  let arrival = exitSide;
  for (let k = 0; k < 64 && cur; k++) {
    if (cur !== edge && (Math.hypot(cur.x - CAM_HOME.x, cur.z - CAM_HOME.z) <= FOG_R || isJunction(cur))) break;
    entry = cur;
    entryFrom = arrival;
    const ways = [...cur.links.entries()].filter(([s, to]) => to !== 'exit' && s !== arrival);
    if (!ways.length) break;
    const next = ways.find(([s]) => s === opposite(arrival)) ?? ways[0];
    arrival = opposite(next[0]);
    cur = roads.get(next[1]);
  }
  return [entry.key, entryFrom];
}

function bfsRoute(a, b) {
  if (!roads.has(a) || !roads.has(b)) return null;
  if (a === b) return [a];
  const prev = new Map([[a, null]]);
  const queue = [a];
  while (queue.length) {
    const cur = queue.shift();
    for (const to of roads.get(cur).links.values()) {
      if (to === 'exit' || prev.has(to)) continue;
      prev.set(to, cur);
      if (to === b) {
        const seq = [b];
        while (seq[0] !== a) seq.unshift(prev.get(seq[0]));
        return seq;
      }
      queue.push(to);
    }
  }
  return null;
}

// The bus route through the level's entry, stop and exit cells. When edits
// cut it, no new bus leaves until the road is whole again.
function computeBusRoute() {
  busRoute = null;
  busStopKey = null;
  const bus = LEVEL.bus;
  if (!bus) return;
  const key = ([i, j]) => cellKey(i, j);
  const first = bfsRoute(key(bus.from), key(bus.stop));
  const second = bfsRoute(key(bus.stop), key(bus.to));
  if (!first || !second) return;
  busRoute = [...first, ...second.slice(1)];
  busStopKey = key(bus.stop);
}

function busExitSide(key) {
  const n = roads.get(key);
  if (!n) return null;
  return [...n.links.entries()].find(([, to]) => to === 'exit')?.[0] ?? null;
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
  // a crossing someone is on, a shut level crossing, and a junction it
  // can't have yet.
  drive(dt, people, busy, shut = []) {
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
    // Stop before a shut crossing; vehicles already inside must leave it.
    if (this.path.length < 2) this.extend();
    const seg = this.path[0];
    const next = this.path[1];
    if (!next.exit && shut.some(c => c.key === next.node.key)) {
      const gap = seg.curve.len - this.s - this.length / 2;
      if (gap > 0) brake(Math.max(0, gap - 0.15) * 1.2);
    }
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
    super(obj, BUS_LENGTH, 0.9, 0);
    this.cooldown = 2;
    this.paintMat = obj.userData.paintMat;
  }

  // Along its route while the road is whole; straight on anywhere else, so a
  // bus kept driving by edits still finds its way like an ordinary car.
  // The route may repeat nodes (a stop in a spur is driven out and back),
  // so each planned segment carries its route index and the next one
  // continues the previously planned segment, not the first matching key.
  busNextAt(node) {
    if (!busRoute) return null;
    const prev = this.path.at(-1);
    if (!prev) return busRoute[0] === node.key ? 0 : null;
    if (prev.exit || prev.routeAt == null) return null;
    return busRoute[prev.routeAt] === prev.node.key && busRoute[prev.routeAt + 1] === node.key
      ? prev.routeAt + 1 : null;
  }

  step(node, from) {
    const seg = super.step(node, from);
    seg.routeAt = this.busNextAt(node);
    return seg;
  }

  chooseExit(node, from) {
    if (busRoute) {
      const at = this.busNextAt(node);
      if (at != null) {
        const next = busRoute[at + 1];
        if (next === undefined) return busExitSide(node.key) ?? opposite(from);
        return [...node.links.entries()].find(([, to]) => to === next)?.[0] ?? opposite(from);
      }
    }
    return opposite(from);
  }

  enter(key, from) {
    this.path = []; // step() below then sees the entry as the route start
    super.enter(key, from);
    this.state = 'arriving';
  }

  leave() {
    super.leave();
    this.cooldown = 12 + Math.random() * 8;
  }

  // The roads were redrawn: keep the curve it is on, then plan again from
  // the route occurrence it matches. Off the route it just drives on.
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
    this.path[0].routeAt = busRoute ? busLocate(this.path[0]) : null;
  }

  desiredSpeed(dt) {
    if (this.state === 'arriving') {
      // The route was cut while driving: carry on as an ordinary car.
      const left = busRoute ? busRemaining(this) : Infinity;
      if (!Number.isFinite(left)) {
        this.state = 'leaving';
        return this.cruise;
      }
      if (left < 0.03 && this.speed < 0.05) {
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

// How far the bus still has to drive to the middle of its stop cell,
// measured along its route; Infinity once it has left the route or passed
// the stop (edited roads), in which case it just drives on.
function busRemaining(bus) {
  const seg = bus.path[0];
  const at = seg.routeAt;
  const stop = busRoute.indexOf(busStopKey);
  if (at == null || at < 0 || stop < 0 || at > stop) return Infinity;
  if (busRoute[at] !== seg.node.key) return Infinity;
  if (at === stop) return seg.curve.len / 2 - bus.s;
  if (sideTo(seg.node.key, busRoute[at + 1]) !== seg.to) return Infinity;
  let left = seg.curve.len - bus.s;
  for (let k = at + 1; k <= stop; k++) {
    const node = roads.get(busRoute[k]);
    const from = sideTo(busRoute[k], busRoute[k - 1]);
    const to = sideTo(busRoute[k], busRoute[k + 1]);
    if (!node || from === undefined || to === undefined) return Infinity;
    const curve = pathThrough(node, from, to);
    left += k === stop ? curve.len / 2 : curve.len;
  }
  return left;
}

function sideTo(a, b) {
  const node = roads.get(a);
  if (!node) return undefined;
  return [...node.links].find(([, key]) => key === b)?.[0];
}

// The route occurrence a kept curve belongs to after the roads were
// redrawn: the one entered and left the same way. Null when the bus has
// left the route, so it just drives on like an ordinary car.
function busLocate(seg) {
  for (let i = 0; i < busRoute.length; i++) {
    if (busRoute[i] !== seg.node.key) continue;
    const prev = busRoute[i - 1];
    const next = busRoute[i + 1];
    const fromOk = prev === undefined
      ? seg.node.links.get(seg.from) === 'exit'
      : sideTo(seg.node.key, prev) === seg.from;
    if (!fromOk) continue;
    const toOk = next === undefined
      ? seg.node.links.get(seg.to) === 'exit'
      : sideTo(seg.node.key, next) === seg.to;
    if (toOk) return i;
  }
  return null;
}

// A few riders step off at the front door and walk into the hotel or the
// store, and a guest or two come out to board. Late at night it is quiet.
function unloadBus(bus) {
  if (!peopleGltfs.length) return;
  // The door sits ahead of the middle, on the travel-right curb side.
  const side = new THREE.Vector3(-bus.heading.z, 0, bus.heading.x);
  const door = bus.pos.clone().addScaledVector(bus.heading, BUS_LENGTH / 2 - 0.22).addScaledVector(side, ROAD_HALF + 0.06 - LANE / 2);
  door.y = 0.05;
  const pick = () => peopleGltfs[Math.floor(Math.random() * peopleGltfs.length)];
  const late = activity(time) < 0.15;
  const off = late ? Number(Math.random() < 0.4) : 1 + Math.floor(Math.random() * 3);
  const riderDoors = (LEVEL.bus.riders ?? []).map(n => PLACES.get(n)?.door).filter(Boolean);
  const fallback = [...PLACES.values()][0]?.door ?? door;
  const inside = () => riderDoors.length
    ? riderDoors[Math.floor(Math.random() * riderDoors.length)]
    : fallback;
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
function makeBus(wheel, headMat, tailMat, color = 'green') {
  const g = new THREE.Group();
  const L = BUS_LENGTH;
  const W = BUS_WIDTH;
  const paint = std(BUS_COLORS[color], { roughness: 0.5 });
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
  clipToMap(g);
  for (const z of [L / 2 - 0.25, -L / 2 + 0.25]) {
    for (const x of [-(W / 2 - 0.03), W / 2 - 0.03]) {
      const w = wheel.scene.clone(true);
      w.scale.setScalar(0.18);
      w.position.set(x, 0.055, z);
      w.traverse(o => { if (o.isMesh) o.castShadow = true; });
      g.add(w);
    }
  }
  g.userData.paintMat = paint;
  return g;
}

let busWheel, busHeadMat, busTailMat;
const stationBuses = [];
let busRoundRobinIndex = 0;
let nextBusSlotMinute = 360;

function findNextBusSlot(targetMinutes, count) {
  if (count <= 0) return Infinity;
  const step = BUS_HEADWAY / count;
  const dayBase = Math.floor(targetMinutes / 1440) * 1440;
  const m = targetMinutes - dayBase;
  if (m <= 360) return dayBase + 360;
  if (m <= 1380) {
    const k = Math.ceil((m - 360) / step);
    const slotM = 360 + k * step;
    if (slotM <= 1380) return dayBase + slotM;
  }
  return dayBase + 1440 + 360;
}

function initStationBuses() {
  stationBuses.length = 0;
  for (const bData of p2State.buses) {
    const bus = new Bus(makeBus(busWheel, busHeadMat, busTailMat, bData.color));
    stationBuses.push(bus);
    vehicles.push(bus);
  }
  busRoundRobinIndex = 0;
  nextBusSlotMinute = findNextBusSlot(clockMinutes, stationBuses.length);
}

async function addTraffic() {
  const headMat = std(0x222222, { emissive: 0xfff4d6, emissiveIntensity: 0 });
  const tailMat = std(0x441111, { emissive: 0xff3a2a, emissiveIntensity: 0 });
  glowing.push([headMat, 4], [tailMat, 2.5]);
  clipMat(headMat);
  clipMat(tailMat);
  const [wheel, ...cars] = await Promise.all(['wheel-default', ...CARS].map(n => model('car-kit', n)));
  busWheel = wheel;
  busHeadMat = headMat;
  busTailMat = tailMat;
  cars.forEach((gltf, i) => {
    const { group, length } = makeCar(gltf, headMat, tailMat);
    vehicles.push(new Vehicle(group, length, 0.9 + rand() * 0.35, i / cars.length));
  });
  if (LEVEL.bus) {
    if (LEVEL.atrain) {
      initStationBuses();
    } else {
      vehicles.push(new Bus(makeBus(wheel, headMat, tailMat)));
    }
  }

  // Parked cars in the car park, lights off.
  if (LOT) {
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
}

function updateBusDispatch() {
  const count = stationBuses.length;
  if (count <= 0 || !busRoute) return;
  const dayBase = Math.floor(clockMinutes / 1440) * 1440;
  const dayMin = clockMinutes - dayBase;

  if (dayMin > 1380) {
    nextBusSlotMinute = Math.max(nextBusSlotMinute, dayBase + 1440 + 360);
    return;
  }
  if (dayMin < 360) {
    nextBusSlotMinute = Math.max(nextBusSlotMinute, dayBase + 360);
    return;
  }
  if (clockMinutes < nextBusSlotMinute) return;

  const from = busExitSide(busRoute[0]);
  if (from === null) return;
  const way = [busRoute[0], from];
  const node = roads.get(way[0]);
  if (!node || node.holder) return;
  const start = pathThrough(node, from, opposite(from)).getPoint(0);
  const clear = vehicles.every(o => !o.onRoad || o.pos.distanceTo(start) > (o.length + BUS_LENGTH) / 2 + 0.6);
  if (!clear) return;

  let foundIndex = -1;
  for (let i = 0; i < count; i++) {
    const idx = (busRoundRobinIndex + i) % count;
    if (!stationBuses[idx].onRoad) {
      foundIndex = idx;
      break;
    }
  }
  if (foundIndex === -1) return;

  const bus = stationBuses[foundIndex];
  bus.enter(...way);
  busRoundRobinIndex = (foundIndex + 1) % count;
  nextBusSlotMinute = findNextBusSlot(clockMinutes + 0.001, count);
}

// Waiting vehicles come in at the fog edge once the way in is clear; the
// bus only while its route through the level is whole, at its entry cell.
function updateTraffic(dt, activity) {
  const people = walkers.filter(w => w.obj.visible).map(w => w.obj.position);
  if (player.active) people.push(player.pos);
  const busy = zebras.filter(zb => people.some(p => onZebra(zb, p)));
  const shut = rail ? rail.closedCells() : [];
  for (const v of vehicles) {
    if (v.onRoad) v.drive(dt, people, busy, shut);
    else v.cooldown -= dt;
  }
  for (const v of vehicles) {
    if (v.onRoad || v.cooldown > 0 || v.rank >= activity) continue;
    let ways;
    if (v instanceof Bus) {
      if (LEVEL.atrain) continue;
      if (!busRoute) continue;
      const from = busExitSide(busRoute[0]);
      if (from === null) continue;
      ways = [[busRoute[0], from]];
    } else {
      if (!edgeEntries.length) continue;
      ways = [...edgeEntries].sort(() => Math.random() - 0.5);
    }
    const way = ways.find(([key, from]) => {
      const node = roads.get(key);
      if (!node || node.holder) return false;
      const start = pathThrough(node, from, opposite(from)).getPoint(0);
      return vehicles.every(o => !o.onRoad || o.pos.distanceTo(start) > (o.length + v.length) / 2 + 0.6);
    });
    if (way) v.enter(...way);
  }
  if (LEVEL.atrain) updateBusDispatch();
}

// ---------- time of day ----------

let time = initTime;
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
  for (const l of lamps) {
    l.intensity = 2.2 * night;
    l.visible = quality === 'high';
  }
  bloom.strength = 0.2 + 0.6 * night;
}

// ---------- UI ----------

const $ = id => document.getElementById(id);
const slider = $('time');
let dragging = false;
slider.addEventListener('pointerdown', () => { dragging = true; });
addEventListener('pointerup', () => { dragging = false; });
slider.addEventListener('input', () => { setTime(+slider.value); });

function setSpeed(s) {
  if (s) lastSpeed = s;
  speed = s;
  document.querySelectorAll('[data-speed]').forEach(b => b.classList.toggle('on', +b.dataset.speed === s));
}
document.querySelectorAll('[data-speed]').forEach(b => b.addEventListener('click', () => { setSpeed(+b.dataset.speed); b.blur(); }));
document.querySelectorAll('[data-time]').forEach(b => b.addEventListener('click', () => { setTime(+b.dataset.time); b.blur(); }));
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

const leftMenu = $('left-menu');
const leftMenuToggle = $('left-menu-toggle');
function setLeftMenuCollapsed(collapsed) {
  leftMenu.classList.toggle('collapsed', collapsed);
  const label = collapsed ? '展開左側選單' : '收合左側選單';
  leftMenuToggle.setAttribute('aria-expanded', String(!collapsed));
  leftMenuToggle.setAttribute('aria-label', label);
  leftMenuToggle.title = label;
  leftMenuToggle.textContent = collapsed ? '›' : '‹';
  try { localStorage.setItem('small-town:left-menu-collapsed', collapsed ? '1' : '0'); } catch { /* storage unavailable */ }
}
try {
  if (localStorage.getItem('small-town:left-menu-collapsed') === '1') setLeftMenuCollapsed(true);
} catch { /* storage unavailable */ }
leftMenuToggle.addEventListener('click', () => {
  setLeftMenuCollapsed(!leftMenu.classList.contains('collapsed'));
  leftMenuToggle.blur();
});
leftMenu.addEventListener('keydown', e => {
  if (e.code === 'Enter' || e.code === 'Space') e.stopPropagation();
});

// Quality for weaker machines. High has everything. Medium keeps the glow
// around lit windows but drops tilt-shift, lamp lights (every pixel pays for
// each one, lit or not) and shadows; low drops the glow too. Below high it
// draws one pixel per CSS pixel. Remembered per browser.
function setQuality(q) {
  quality = q;
  const ratio = q === 'high' ? Math.min(devicePixelRatio, 2) : 1;
  renderer.setPixelRatio(ratio);
  composer.setPixelRatio(ratio);
  resize();
  tiltH.enabled = tiltV.enabled = q === 'high';
  renderer.shadowMap.enabled = q === 'high';
  scene.traverse(o => { if (o.material) [o.material].flat().forEach(m => { m.needsUpdate = true; }); });
  applyTime(time);
  document.querySelectorAll('[data-quality]').forEach(b => b.classList.toggle('on', b.dataset.quality === q));
  try { localStorage.setItem('small-town:quality', q); } catch { /* storage unavailable */ }
}
document.querySelectorAll('[data-quality]').forEach(b => b.addEventListener('click', () => {
  if (b.dataset.quality !== quality) setQuality(b.dataset.quality);
  b.blur();
}));
try {
  // The earlier on/off switch stored 'small-town:low-quality'.
  const saved = localStorage.getItem('small-town:quality') ?? (localStorage.getItem('small-town:low-quality') === '1' ? 'low' : 'high');
  if (saved !== 'high') setQuality(saved);
} catch { /* storage unavailable */ }

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

let toastTimer = 0;
let toastAction = null;
// A click on the toast runs `onclick` while it is showing.
function showToast(text, onclick = null) {
  const el = $('toast');
  if (!el) return;
  el.textContent = text;
  toastAction = onclick;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.hidden = true;
    toastAction = null;
  }, 2000);
}

function updateMoneyUI() {
  const el = $('money');
  if (!el || !LEVEL.atrain || !p2State) return;
  if (p2State.unlimited) {
    el.textContent = '資金 無限';
    el.classList.remove('negative');
    return;
  }
  const rounded = Math.round(p2State.money * 10) / 10;
  const formatted = rounded.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
  el.textContent = `資金 ${formatted} 萬`;
  el.classList.toggle('negative', rounded < 0);
}

function formatMan(n) {
  const rounded = Math.round(Math.abs(n) * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function applyMoney(delta, isUndo = false) {
  if (!LEVEL.atrain || !p2State || (p2State.unlimited && !isUndo)) return 0;
  p2State.money = Math.round((p2State.money + delta) * 10) / 10;
  updateMoneyUI();
  return delta;
}

function spend(amount) {
  if (!LEVEL.atrain || !p2State) return true;
  if (!p2State.unlimited && (p2State.money < 0 || p2State.money < amount)) {
    showToast('資金不足');
    return false;
  }
  applyMoney(-amount);
  return true;
}

function population() {
  let count = 0;
  for (const item of editables.values()) {
    if (item === placing || item.removed) continue;
    if (item.add) {
      if (item.add.type === 'house') count += POP.house;
      else if (item.add.type === 'villa') count += POP.villa;
      else if (item.add.type === 'facility' && facilityLinked(item)) {
        count += FACILITIES[item.add.kind].pop ?? 0;
      }
    } else if (item.id.startsWith('home:')) {
      const idx = Number(item.id.slice(5));
      const home = HOMES[idx];
      count += home?.villa ? POP.villa : POP.house;
    }
  }
  return count;
}

function linkedFacilityKinds() {
  const kinds = [];
  for (const item of editables.values()) {
    if (item === placing || item.removed) continue;
    if (item.add?.type === 'facility' && facilityLinked(item)) {
      kinds.push(item.add.kind);
    }
  }
  return kinds;
}

function advanceClock(deltaMinutes) {
  const prevCalDay = Math.floor(clockMinutes / 1440);
  clockMinutes += deltaMinutes;
  calDay = Math.floor(clockMinutes / 1440);
  if (calDay > prevCalDay) {
    startNewDay();
  }
  time = (clockMinutes % 1440) / 60;
  while (clockMinutes >= nextSettlementMinute) {
    opsDay++;
    if (p2State) p2State.day = opsDay;
    nextSettlementMinute += 1440;
    if (rail) rail.onSettlement(opsDay);
    if (p2State) {
      const entry = settle(p2State, dailyCounts, population(), linkedFacilityKinds());
      if (!p2State.unlimited) {
        p2State.money = entry.balance;
      }
      p2State.ledger.push(entry);
      if (p2State.ledger.length > 7) {
        p2State.ledger.splice(0, p2State.ledger.length - 7);
      }
      growTown(dailyCounts.stops.length);
      dailyCounts.stops = [];
      dailyCounts.passes = 0;
      dailyCounts.runs = 0;
      dailyCounts.backhauls = 0;
      saveLayout();
      updateMoneyUI();
      const net = (entry.income.rail + entry.income.bus + entry.income.facility) - entry.cost;
      showToast(net >= 0 ? `昨日 +${formatMan(net)} 萬` : `昨日 −${formatMan(net)} 萬`);
      if (refreshTownTab) refreshTownTab();
    }
  }
}

function jumpTime(nextHour) {
  const normHour = ((nextHour % 24) + 24) % 24;
  const targetMinutes = calDay * 1440 + normHour * 60;
  if (targetMinutes >= nextSettlementMinute) {
    while (nextSettlementMinute <= targetMinutes) nextSettlementMinute += 1440;
    opsDay = Math.max(opsDay, Math.floor((targetMinutes - 360) / 1440));
    if (p2State) p2State.day = opsDay;
  }
  if (rail) rail.seek(targetMinutes);
  if (LEVEL.atrain) {
    for (const b of stationBuses) {
      if (b.onRoad) b.leave();
    }
    nextBusSlotMinute = findNextBusSlot(targetMinutes, stationBuses.length);
  }
  clockMinutes = targetMinutes;
  time = normHour;
  applyTime(time);
  updateUI();
}

// Midnight wrapping in the main loop, or a jump backwards from a preset or
// the slider, turns the game day over: the found cats queue up to hide again.
function setTime(next, continuous = false) {
  if (LEVEL.atrain) {
    if (continuous) {
      // Natural clock flow handled in frame() via advanceClock
    } else {
      jumpTime(next);
    }
    return;
  }
  next %= 24;
  if (next < time) startNewDay();
  time = next;
  if (rail && !continuous) for (const w of walkers) if (w instanceof Resident) w.waitH = 0;
}

// ---------- cats ----------

// Eight cats, each with its own coat, hide around town. Click one to find
// it: it meows, hearts float up and it stays gone for the rest of the game
// day, hiding again somewhere new after midnight. Their eyes shine at
// night, which makes them easier to spot after dark.
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

// Hiding spots come from the level as x, z; the height is wherever a ray
// from above lands, so a spot can be a rooftop, an awning, a car roof or
// a tree.

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
    this.gone = false; // found today: hidden until the next game day
    scene.add(this.obj);
  }

  speech() {
    return { name: this.info.name, role: '貓咪', line: CAT_LINES[Math.floor(Math.random() * CAT_LINES.length)] };
  }

  // Claim a spot and sit on whatever is below it now; the height is measured
  // here, so moving a building only re-seats the cats on it. The cat hides
  // from its own ray so the ray lands on the roof, not on fur.
  hideAt(spot) {
    this.spot = spot;
    this.gone = false;
    this.obj.visible = false;
    spot.y = surfaceY(spot.x, spot.z);
    this.obj.visible = true;
    this.obj.position.copy(spot);
    this.obj.rotation.y = Math.random() * Math.PI * 2;
  }

  // Slip away to a free spot: shrink, move, pop up again.
  sneakOff(delay = 0) {
    if (this.poof || this.gone) return;
    this.wait = delay;
    this.poof = 0.35;
  }

  // Found by the player: shrink away like a sneak-off, then stay gone until
  // the next game day instead of popping up elsewhere.
  vanish(delay = 0) {
    if (this.gone || this.poof) return;
    this.farewell = true;
    this.sneakOff(delay);
  }

  update(dt) {
    if (this.gone) return;
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
        if (this.farewell) {
          this.farewell = false;
          this.spot = null;
          this.gone = true;
          this.obj.visible = false;
          this.obj.scale.setScalar(CAT_SCALE);
        } else {
          const free = freeSpots();
          if (!free.length) {
            this.poof = 0;
          } else {
            this.hideAt(free[Math.floor(Math.random() * free.length)]);
            this.poof = -0.35;
          }
        }
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

// Spots no cat sits on; a found cat holds none until it hides again.
function freeSpots() {
  const taken = new Set(cats.map(c => c.spot));
  return catSpots.filter(sp => !taken.has(sp));
}

// The town book: found cats, the number of finds, blessings seen and
// coins thrown, kept per level in this browser. The old shared key moves to
// the town level only when the town has no book of its own yet; the old key
// stays, and a newer per-level book is never overwritten by the stale one.
const CAT_KEY = `small-town:cats:${LEVEL.id}`;
let catBook = { found: [], finds: 0, blessings: [], coins: 0 };
try {
  const raw = localStorage.getItem(CAT_KEY);
  if (raw == null) {
    const old = JSON.parse(localStorage.getItem('small-town:cats') || 'null');
    if (old && typeof old === 'object') {
      catBook = { ...catBook, ...old };
      try { localStorage.setItem(CAT_KEY, JSON.stringify(catBook)); } catch { /* storage unavailable */ }
    }
  } else {
    catBook = { ...catBook, ...JSON.parse(raw) };
  }
} catch { /* storage unavailable */ }

const hex = c => `#${c.toString(16).padStart(6, '0')}`;
function saveBook() {
  try { localStorage.setItem(CAT_KEY, JSON.stringify(catBook)); } catch { /* storage unavailable */ }
}
const hasWishes = () => LEVEL.wishes !== false && !!PARK;
function drawCatBook(fresh) {
  const showCats = LEVEL.cats.length > 0;
  const showWishes = hasWishes();
  // The header only mentions what this level has.
  document.querySelector('.title p').textContent = ['點路上的人聽他說話',
    ...(showCats ? ['找出躲起來的貓'] : []), ...(showWishes ? ['點噴水池許願'] : [])].join('，')
    + '。左鍵拖曳平移，右鍵拖曳旋轉，滾輪縮放。';
  $('cat-count').parentElement.style.display = showCats ? '' : 'none';
  $('cat-row').style.display = showCats ? '' : 'none';
  $('wish-count').parentElement.style.display = showWishes ? '' : 'none';
  $('wish-row').style.display = showWishes ? '' : 'none';
  const breeds = cats.map(c => c.info);
  $('cat-count').textContent = `${catBook.found.filter(n => breeds.some(c => c.name === n)).length}/${breeds.length}`;
  $('cat-row').replaceChildren(...breeds.map(c => {
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
  if (showWishes && catBook.coins) parts.push(`許願 ${catBook.coins} 次`);
  $('cat-total').textContent = parts.length ? parts.join('・')
    : showCats && showWishes ? '貓咪躲在小鎮各處；點噴水池可以許願'
    : showCats ? '貓咪躲在小鎮各處'
    : showWishes ? '點噴水池可以許願' : '';
}

function findCat(cat) {
  const fresh = !catBook.found.includes(cat.info.name);
  if (fresh) catBook.found.push(cat.info.name);
  catBook.finds++;
  saveBook();
  drawCatBook(fresh ? cat.info.name : null);
  cat.vanish(1.6);
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
  for (const [x, z] of LEVEL.cats) catSpots.push(new THREE.Vector3(x, 0, z));
  const order = [...catSpots].sort(() => Math.random() - 0.5);
  CATS.slice(0, catSpots.length).forEach(info => {
    const cat = new Cat(info);
    cat.hideAt(order[cats.length]);
    cats.push(cat);
  });
  drawCatBook();
}

// Now and then a cat wanders off to somewhere new on its own. Cats found
// earlier come back one per frame after the day turns over, each measuring
// its new spot as it hides.
let wanderIn = 45;
const dayQueue = [];
function startNewDay() {
  for (const cat of cats) if (cat.gone && !dayQueue.includes(cat)) dayQueue.push(cat);
}
function updateCats(dt) {
  if (dayQueue.length) {
    const cat = dayQueue.shift();
    const free = freeSpots();
    if (free.length) {
      cat.hideAt(free[Math.floor(Math.random() * free.length)]);
      cat.poof = -0.35;
    } else dayQueue.push(cat);
  }
  for (const cat of cats) cat.update(dt);
  if (!cats.length) return;
  if ((wanderIn -= dt) > 0) return;
  wanderIn = 40 + Math.random() * 50;
  const awake = cats.filter(c => !c.gone);
  if (!awake.length) return;
  const cat = awake[Math.floor(Math.random() * awake.length)];
  if (cat !== talking) cat.sneakOff();
}

// ---------- wishing fountain ----------

let crowdBoost = 0;
let wishes;
const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.3);
let pointerOnGround = null;

// The fountain speaks for the coin: a plain wish, or the blessing it brought.
const fountainVoice = { obj: { position: new THREE.Vector3(0, 0.1, PARK ? PARK.cz : 0), visible: true }, bubbleY: 0.6 };
let stationVoice = null;

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
  if (LEVEL.wishes === false || !PARK) return;
  patchSnow(scene);
  // Lane metadata for the blessings, derived from this level's own paths and
  // roads, so wishes.js needs no fixed-street assumptions.
  const alleyXs = [...new Set(LEVEL.paths.map(([x0, , x1]) => (x0 + x1) / 2))];
  const back = Math.min(...LEVEL.roads.map(([, j0, , j1]) => Math.min(j0, j1) * CELL));
  wishes = createWishes({
    scene,
    camera,
    park: PARK,
    fountain,
    getTime: () => time,
    setCrowdBoost: v => { crowdBoost = v; },
    pointerGround: () => pointerOnGround,
    streets: { back, alleys: alleyXs.length ? alleyXs : [0] },
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

function talkStation() {
  const line = p2State.ledger.length
    ? `昨日乘客 ${p2State.ledger[p2State.ledger.length - 1].riders} 人`
    : '昨日乘客 —（還沒有結算）';
  talk(stationVoice, { name: STATION.name, role: '車站', line });
}

function aim(e) {
  pointer.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
}

renderer.domElement.addEventListener('pointermove', e => {
  aim(e);
  pointerOnGround = raycaster.ray.intersectPlane(groundPlane, new THREE.Vector3());
  // Hovering the station keeps its bubble up until the pointer has been off it a moment.
  if (stationVoice && !editing && !player.active && raycaster.intersectObject(stationVoice.obj, true)[0]) {
    const keep = talking === stationVoice ? talkUntil : 0;
    if (!keep) talkStation();
    talkUntil = Math.max(keep, performance.now() + 800);
  }
});
renderer.domElement.addEventListener('pointerdown', e => { downAt = [e.clientX, e.clientY]; });
renderer.domElement.addEventListener('pointerup', e => {
  if (editing || e.button !== 0 || !downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 5) return;
  aim(e);
  const targets = [
    ...(wishes ? wishes.clickables() : []),
    ...[...walkers.filter(w => w.obj.visible), ...cats.filter(c => !c.poof && !c.gone)].map(w => w.hit),
    ...(fountain.hit ? [fountain.hit] : []),
  ];
  const hit = raycaster.intersectObjects(targets, false)[0];
  if (!hit) {
    if (stationVoice && raycaster.intersectObject(stationVoice.obj, true)[0]) {
      talkStation();
      return;
    }
    if (LEVEL.atrain && rail && !player.active) {
      let closest = null;
      let targetUnits = null;
      for (const train of rail.fleet.values()) {
        const visible = train.consist.units.filter(u => u.obj.visible).map(u => u.obj);
        if (visible.length) {
          const hits = raycaster.intersectObjects(visible, true);
          if (hits.length && (!closest || hits[0].distance < closest.distance)) {
            closest = hits[0];
            targetUnits = train.consist.units;
          }
        }
      }
      if (targetUnits) {
        followTrain(targetUnits);
        return;
      }
    }
    return;
  }
  const data = hit.object.userData;
  if (data.onClick) return data.onClick();
  if (data.fountain) {
    // One coin in the air at a time; silent when this level has no wishes.
    if (wishes && !wishes.flying()) wishes.throwCoin(wishResult);
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
// The player stays inside the level's map extents.
const BOUNDS = (() => {
  const [iMin, iMax, jMin, jMax] = LEVEL.bounds;
  return {
    minX: (2 * iMin - 1) * HALF, maxX: (2 * iMax + 1) * HALF,
    minZ: (2 * jMin - 1) * HALF, maxZ: (2 * jMax + 1) * HALF,
  };
})();
const player = { active: false, look: 'male-f', name: '', outfit: {}, pos: new THREE.Vector3(0.6, 0, FRONTAGE - 0.35), obj: null, air: 0, vy: 0 };
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

// Road, sidewalks, paths and park paths sit a little above the grass.
function groundHeight(x, z) {
  if (railCells.has(cellKey(Math.round(x / CELL), Math.round(z / CELL)))) return RAIL_TOP;
  const tile = tiles.get(cellKey(Math.round(x / CELL), Math.round(z / CELL)));
  if (tile) return tile === 'walk' ? 0.05 : 0.02;
  // The automatic sidewalks ringing each road tile.
  for (const [key] of tiles) {
    if (tiles.get(key) !== 'road') continue;
    const [i, j] = key.split(',').map(Number);
    const dx = Math.abs(x - i * CELL);
    const dz = Math.abs(z - j * CELL);
    if (dx < CELL / 2 + SIDEWALK && dz < CELL / 2 + SIDEWALK && (dx > CELL / 2 || dz > CELL / 2)) return 0.05;
  }
  if (LEVEL.paths.some(([x0, z0, x1, z1]) => x >= x0 && x <= x1 && z >= z0 && z <= z1)) return 0.02;
  const P = PARK;
  if (P && Math.abs(x) < P.xHalf && z > P.zMin && z < P.zMax) return 0.02;
  return 0;
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
  stopFollow();
  if (editing) setEditing(false);
  player.active = !player.active;
  document.body.classList.toggle('playing', player.active);
  const playButton = $('play');
  const [ico, label] = playButton.children;
  [ico.textContent, label.textContent] = player.active ? ['🏙', '回到俯瞰（P）'] : ['🚶', '散步模式（P）'];
  playButton.title = label.textContent;
  playButton.setAttribute('aria-label', label.textContent);
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
    Object.assign(controls, { minDistance: 3, maxDistance: VIEW.maxDistance, maxPolarAngle: 1.32 });
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
    if (c.gone || c.poof || Math.abs(c.obj.position.y - p.y) > 0.3) continue;
    const d = Math.hypot(c.obj.position.x - p.x, c.obj.position.z - p.z);
    if (d < bestD) [best, bestD] = [{ kind: 'cat', it: c }, d];
  }
  if (!best && PARK && wishes && fountain.hit
    && Math.hypot(p.x, p.z - PARK.cz) < 0.62 + 0.35) best = { kind: 'fountain' };
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
    if (wishes && !wishes.flying()) wishes.throwCoin(wishResult);
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
  if (e.code === 'Escape') {
    if (stopFollow()) {
      e.stopImmediatePropagation();
      return;
    }
    openCloset(false);
  }
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

function editable(id, parts, { solids: ss = [], posts: ps = [], places = [], points = [], pivotBounds = null } = {}) {
  const box3 = pivotBounds ?? new THREE.Box3();
  if (!pivotBounds) for (const part of parts) box3.expandByObject(part);
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

const stateOf = item => ({ x: item.pivot.position.x, z: item.pivot.position.z, rot: item.pivot.rotation.y, removed: item.removed,
  ...(item.paint && { paint: item.paint }) });

// Houses, shops and villas can be repainted: `paint` is { wall } on the
// commercial palette or { wall, roof } on a villa's; none is how it was built.
function paintable(item, mat, villa) {
  item.paintable = { mat, villa, original: mat.map };
  return item;
}

function applyPaint(item, paint) {
  const { mat, villa, original } = item.paintable;
  item.paint = paint;
  mat.map = !paint ? original
    : villa ? villaPalette(paint.wall, paint.roof).map
    : (paint.wall >= 0 ? kit.pastels[paint.wall] : kit.commercial).map;
}

// Put an item where `state` says and bring everything that hangs off it along.
function applyState(item, { x, z, rot, removed, paint }) {
  if (item.paintable) applyPaint(item, paint);
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
  for (const { pl, at } of item.places) [pl.door.x, pl.door.z] = [world(at).x, world(at).z];
  if (removed !== item.removed) {
    item.removed = removed;
    item.pivot.visible = !removed;
    for (const { s } of item.solids) removed ? solids.splice(solids.indexOf(s), 1) : solids.push(s);
    for (const { p } of item.posts) removed ? posts.splice(posts.indexOf(p), 1) : posts.push(p);
    for (const { pl } of item.places) pl.removed = removed;
  }
}

// The walk grid is rebuilt and cached paths cleared, and residents re-plan
// their walks. Cats keep their spots: a hiding spot's height is measured
// when a cat hides there, and only cats on a changed building are re-seated.
function settleTown() {
  rebuildNav();
  for (const w of walkers) {
    if (w instanceof Resident) w.plan();
    else if (w instanceof Commuter && !w.done) w.reroute();
  }
}

// A building's footprint for the cats: its solids and posts in world space,
// padded a touch so a cat perched on an edge still counts as on it.
const SEAT_PAD = 0.03;
function footprintOf(item) {
  const rects = item.solids.map(({ s }) => ({ minX: s.minX, maxX: s.maxX, minZ: s.minZ, maxZ: s.maxZ }));
  for (const { p } of item.posts) rects.push({ minX: p.x, maxX: p.x, minZ: p.z, maxZ: p.z });
  return rects;
}

function facilityBounds(item) {
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  if (item.solids && item.solids.length > 0) {
    for (const { a, b } of item.solids) {
      minX = Math.min(minX, a.x, b.x);
      maxX = Math.max(maxX, a.x, b.x);
      minZ = Math.min(minZ, a.z, b.z);
      maxZ = Math.max(maxZ, a.z, b.z);
    }
  } else {
    const inv = new THREE.Matrix4().copy(item.pivot.matrixWorld).invert();
    const rel = new THREE.Matrix4();
    const v = new THREE.Vector3();
    item.pivot.traverse(o => {
      if (o.isMesh && o.geometry) {
        if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
        const gb = o.geometry.boundingBox;
        rel.multiplyMatrices(inv, o.matrixWorld);
        for (let ix = 0; ix < 2; ix++) {
          for (let iy = 0; iy < 2; iy++) {
            for (let iz = 0; iz < 2; iz++) {
              v.set(ix ? gb.max.x : gb.min.x, iy ? gb.max.y : gb.min.y, iz ? gb.max.z : gb.min.z);
              v.applyMatrix4(rel);
              minX = Math.min(minX, v.x);
              maxX = Math.max(maxX, v.x);
              minZ = Math.min(minZ, v.z);
              maxZ = Math.max(maxZ, v.z);
            }
          }
        }
      }
    });
  }
  return { minX, maxX, minZ, maxZ };
}

// Front edge = the pivot's +z side of the footprint, distance to any sidewalkRects() <= 0.3.
function facilityLinked(item) {
  item.pivot.updateMatrixWorld(true);
  const bounds = facilityBounds(item);
  const p1 = item.pivot.localToWorld(new THREE.Vector3(bounds.minX, 0, bounds.maxZ));
  const p2 = item.pivot.localToWorld(new THREE.Vector3(bounds.maxX, 0, bounds.maxZ));
  // Turns are quarter turns, so the front edge is axis-aligned: its distance
  // to a sidewalk is the gap between the two boxes.
  const [x0, x1, z0, z1] = [Math.min(p1.x, p2.x), Math.max(p1.x, p2.x), Math.min(p1.z, p2.z), Math.max(p1.z, p2.z)];
  return sidewalkRects().some(({ r }) => {
    const dx = Math.max(0, Math.min(r[0], r[2]) - x1, x0 - Math.max(r[0], r[2]));
    const dz = Math.max(0, Math.min(r[1], r[3]) - z1, z0 - Math.max(r[1], r[3]));
    return Math.hypot(dx, dz) <= 0.3;
  });
}

const radiusGeo = new THREE.CircleGeometry(1, 48);
radiusGeo.rotateX(-Math.PI / 2);
const radiusMark = new THREE.Mesh(radiusGeo,
  new THREE.MeshBasicMaterial({ color: 0x2ec866, transparent: true, opacity: 0.3, depthWrite: false, side: THREE.DoubleSide }));
radiusMark.position.y = 0.06;
radiusMark.visible = false;
radiusMark.raycast = () => {};
scene.add(radiusMark);

function updateFacilityRadius() {
  const item = (placing && !placing.removed) ? placing : (selected && !selected.removed) ? selected : null;
  const fac = item?.add?.type === 'facility' ? FACILITIES[item.add.kind] : null;
  if (!item || !fac || !fac.radius) {
    radiusMark.visible = false;
    return;
  }
  const rWorld = fac.radius * CELL;
  radiusMark.scale.set(rWorld, 1, rWorld);
  radiusMark.position.set(item.pivot.position.x, 0.06, item.pivot.position.z);
  const linked = facilityLinked(item);
  radiusMark.material.color.setHex(linked ? 0x2ec866 : 0xff5a5a);
  radiusMark.visible = true;
}

// After a building moves, only the cats sitting on its old or new footprint
// need a new height: a cat on a moved-away roof drops to what is below, and
// a building put down over a cat lifts it onto the roof. Paving never comes
// through here.
function reseatCats(before, after) {
  for (const cat of cats) {
    if (cat.gone || !cat.spot) continue;
    const on = r => cat.spot.x >= r.minX - SEAT_PAD && cat.spot.x <= r.maxX + SEAT_PAD
      && cat.spot.z >= r.minZ - SEAT_PAD && cat.spot.z <= r.maxZ + SEAT_PAD;
    if (before.some(on) || after.some(on)) cat.hideAt(cat.spot);
  }
}

// Only what differs from the default town, versioned for migration.
function currentLayout() {
  const layout = { '#v': 2 };
  const current = Object.fromEntries(tiles);
  if (JSON.stringify(sortedTiles(current)) !== JSON.stringify(sortedTiles(defaultTilesObj(LEVEL)))) layout['#tiles'] = current;
  if (JSON.stringify(zebras) !== JSON.stringify(DEFAULT_ZEBRAS)) layout['#zebras'] = zebras;
  for (const item of editables.values()) {
    const s = stateOf(item);
    // Added things are kept with how to build them again, unless removed.
    if (item.add) {
      if (!s.removed && item !== placing) layout[item.id] = { ...s, add: item.add };
    } else if (s.removed || s.paint || s.x !== item.base.x || s.z !== item.base.z || s.rot !== item.base.rot) {
      layout[item.id] = s;
    }
  }
  if (LEVEL.atrain && p2State) {
    layout['#p2'] = p2State;
  }
  return layout;
}

function saveLayout() {
  try { localStorage.setItem(GAME_KEY, JSON.stringify({ level: LEVEL.id, layout: currentLayout() })); } catch { /* storage unavailable */ }
}

async function applyLayout() {
  const layout = migrateLayout(game.layout ?? {});
  for (const [id, s] of Object.entries(layout)) {
    if (id[0] === '#') continue;
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
  const before = footprintOf(item);
  undos.push([[item, stateOf(item)]]);
  applyState(item, next);
  saveLayout();
  settleTown();
  reseatCats(before, footprintOf(item));
  select(item.removed ? null : item);
}

// A step may also carry the painted cells and crossings from before it.
function undo() {
  const last = undos.pop();
  if (!last) return;
  if (last.tiles) setTiles(Object.fromEntries(last.tiles));
  if (last.zebras) setZebras(last.zebras);
  const moved = last.map(([item]) => [item, footprintOf(item)]);
  for (const [item, state] of last) applyState(item, state);
  if (last.money) applyMoney(-last.money, true);
  saveLayout();
  settleTown();
  for (const [item, before] of moved) reseatCats(before, footprintOf(item));
  select(last.length === 1 && !last[0][0].removed ? last[0][0] : null);
}

function select(item) {
  selected = item;
  outline.visible = !!item;
  if (item) hug(item);
  renderPaintPanel();
  updateFacilityRadius();
  if (item && item !== placing && !item.removed && item.add?.type === 'facility' && !facilityLinked(item)) {
    showToast('沒有接到道路');
  }
}

// The colours of the selected house, shop or villa, in a panel of its own
// (not while the add panel is open).
function renderPaintPanel() {
  const item = selected;
  const show = !!item?.paintable && editing && !placing && $('add-panel').hidden;
  $('paint-panel').hidden = !show;
  if (!show) return;
  const { villa } = item.paintable;
  const now = currentPaint(item);
  const paint = next => () => change(item, { ...stateOf(item), paint: { ...now, ...next } });
  $('paint-walls').replaceChildren(...(villa
    ? VILLA_WALLS.map(([label], i) => chip(label, now.wall === i, paint({ wall: i })))
    : WALLS.map(([label, w]) => chip(label, now.wall === w, paint({ wall: w })))));
  $('paint-roof-box').hidden = !villa;
  $('paint-roofs').replaceChildren(...VILLA_ROOFS.map(([label], i) => chip(label, now.roof === i, paint({ roof: i }))));
}

// The colours a building shows now, read back from its palette.
function currentPaint(item) {
  const { mat, villa } = item.paintable;
  if (!villa) return { wall: kit.pastels.findIndex(p => p.map === mat.map) };
  for (const [key, pal] of villaPalettes) {
    if (pal.map === mat.map) {
      const [wall, roof] = key.split(',').map(Number);
      return { wall, roof };
    }
  }
  return { wall: 0, roof: 0 };
}

function setEditing(on) {
  if (on) stopFollow();
  if (on && player.active) togglePlay();
  editing = on;
  document.body.classList.toggle('editing', on);
  const editButton = $('edit');
  const [ico, label] = editButton.children;
  [ico.textContent, label.textContent] = on ? ['✅', '完成編輯（B）'] : ['🛠', '編輯（B）'];
  editButton.title = label.textContent;
  editButton.setAttribute('aria-label', label.textContent);
  if (!on) {
    setBrush(null);
    cancelPlacing();
    select(null);
    $('add-panel').hidden = true;
  }
  renderPaintPanel();
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
  // Picking a paintable building swaps the add panel for its colours.
  if (item.paintable) $('add-panel').hidden = true;
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
    updateFacilityRadius();
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
  updateFacilityRadius();
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
      updateFacilityRadius();
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
  if (e.code === 'Delete' || e.code === 'Backspace') {
    let refund = 0;
    if (selected.add?.type === 'facility') {
      refund = applyMoney(FACILITIES[selected.add.kind].price / 2);
    }
    // A grown building's lot rests for a week.
    if (selected.add?.auto) p2State.growth.cooldown[selected.add.lot] = p2State.day + 7;
    change(selected, { ...stateOf(selected), removed: true });
    if (refund) undos.at(-1).money = refund;
  }
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
  { type: 'facility', label: '公共設施', atrainOnly: true },
  { type: 'tree', label: '樹', pack: 'suburban', models: ['tree-large', 'tree-small'] },
  { type: 'lamp', label: '路燈', pack: 'roads', models: ['light-square', 'light-curved'] },
  { type: 'paving', label: '道路', models: [] },
];
const BRUSHES = [['road', '馬路'], ['walk', '人行道'], ['zebra', '斑馬線'], ['erase', '清除']];
// Wall colours: white, or one of the pastels.
const WALLS = [['白色', -1], ['淡藍', 0], ['淡綠', 1], ['淡黃', 2], ['粉紅', 3], ['粉紫', 4], ['淺灰', 5], ['深灰', 6],
  ['杏色', 7], ['湖綠', 8]];
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
const addChoice = { type: 'house', wall: -1, villaWall: 0, roof: 0, theme: 0, facilityKind: 'apartment' };

// A door just outside the middle of the front (+z) face, while still at the origin.
function frontDoor(parts) {
  const box = new THREE.Box3();
  for (const part of parts) box.expandByObject(part);
  return { door: new THREE.Vector3(0, 0.05, box.max.z + 0.05) };
}

// Built at the origin facing +z; its pivot then carries it into place.
async function buildAdded(id, add) {
  let item;
  if (add.type === 'facility') {
    const fac = FACILITIES[add.kind];
    let parts, itemSolids = [], isCommercialEarn = false, mat;
    if (fac.compose === 'park') {
      parts = [
        await place('nature', 'path_stoneCircle', { scale: 1.3 }),
        await place('nature', 'tree_default', { x: -0.42, z: -0.42, scale: 0.6 }),
        await place('nature', 'tree_default', { x: 0.42, z: -0.40, scale: 0.55, rot: 1.5 }),
        await place('nature', 'tree_default', { x: 0.05, z: 0.45, scale: 0.65, rot: 3.0 }),
      ];
    } else if (fac.compose === 'camp') {
      parts = [
        await place('nature', 'campfire_stones', { scale: 0.75 }),
        await place('nature', 'tent_detailedOpen', { x: -0.3, z: 0.35, rot: -0.4, scale: 0.8 }),
        await place('nature', 'tent_smallOpen', { x: 0.35, z: -0.35, rot: 2.5, scale: 0.85 }),
      ];
    } else if (fac.compose === 'farm') {
      const cropModel = add.model || 'crops_cornStageD';
      parts = [
        await place('nature', 'crops_dirtDoubleRow', { scale: 1.35 }),
        await place('nature', cropModel, { x: -0.35, z: -0.25 }),
        await place('nature', cropModel, { x: 0, z: -0.25 }),
        await place('nature', cropModel, { x: 0.35, z: -0.25 }),
        await place('nature', cropModel, { x: -0.35, z: 0.25 }),
        await place('nature', cropModel, { x: 0, z: 0.25 }),
        await place('nature', cropModel, { x: 0.35, z: 0.25 }),
      ];
    } else {
      isCommercialEarn = fac.group === 'earn' && fac.pack === 'commercial';
      if (isCommercialEarn) {
        const walls = add.wall >= 0 ? kit.pastels[add.wall] : kit.commercial;
        mat = paletteMaterial(walls, [1.4, 0.7, 2.2][Math.floor(Math.random() * 3)],
          (21.5 + Math.random() * 5) % 24, Math.random() * 0.15);
      }
      const obj = solidOf(await place(fac.pack, add.model, { scale: fac.scale, mat }));
      parts = [obj];
      itemSolids = [obj.userData.solid];
    }
    if (fac.compose) {
      const bounds = new THREE.Box3();
      for (const part of parts) bounds.expandByObject(part);
      const footprint = { minX: bounds.min.x + 0.02, maxX: bounds.max.x - 0.02, minZ: bounds.min.z + 0.02, maxZ: bounds.max.z - 0.02 };
      solids.push(footprint);
      itemSolids = [footprint];
    }
    item = editable(id, parts, { solids: itemSolids, places: [frontDoor(parts)] });
    if (isCommercialEarn) paintable(item, mat, false);
  } else if (add.type === 'tree') {
    const c = collect(() => post(0, 0, 0.1));
    const obj = await place('suburban', add.model, { scale: 1.25, mat: kit.plantMat });
    item = editable(id, [obj], c);
  } else if (add.type === 'lamp') {
    item = await streetLamp(id, 0, 0, 1, add.model);
  } else {
    const villa = add.type === 'villa';
    const walls = add.wall >= 0 ? kit.pastels[add.wall] : kit.commercial;
    const mat = villa
      ? paletteMaterial(villaPalette(add.wall, add.roof), 0.9 + Math.random() * 0.6, 21 + Math.random(), Math.random() * 0.1)
      : paletteMaterial(walls, add.type === 'shop' ? 1.3 : [1.4, 0.7, 2.2][Math.floor(Math.random() * 3)],
        add.type === 'shop' ? 22 : (21.5 + Math.random() * 5) % 24, add.type === 'shop' ? 0 : Math.random() * 0.15);
    const obj = solidOf(await place(villa ? 'suburban' : 'commercial', add.model, { mat }));
    const c = add.type === 'shop'
      ? collect(() => decorateShop(obj, { x: 0, facing: 1, name: add.name, ...SHOP_THEMES[add.theme], closes: 22 }))
      : { parts: [] };
    const parts = [obj, ...c.parts];
    item = editable(id, parts, { solids: [obj.userData.solid], places: [frontDoor(parts)] });
    paintable(item, mat, villa);
  }
  item.add = add;
  return item;
}

async function startPlacing(add, rot = 0) {
  setBrush(null);
  cancelPlacing();
  const ticket = placingTicket = {};
  const item = await buildAdded(`add:${Date.now().toString(36)}`, add);
  // Something else was picked, or editing ended, while the model loaded.
  if (ticket !== placingTicket || !editing) return discard(item);
  placing = item;
  const at = pointerFloor ?? controls.target;
  applyState(item, { x: Math.round(at.x / SNAP) * SNAP, z: Math.round(at.z / SNAP) * SNAP, rot, removed: false });
  select(item);
  $('prompt').textContent = '點地面放下 · R 旋轉 · Esc 或右鍵取消';
  $('prompt').hidden = false;
  renderAddPanel();
}

function putDown() {
  const item = placing;
  let moneyDelta = 0;
  if (item.add?.type === 'facility') {
    const { price } = FACILITIES[item.add.kind];
    if (!spend(price)) {
      cancelPlacing();
      return;
    }
    moneyDelta = p2State.unlimited ? 0 : -price;
  }
  placing = null;
  $('prompt').hidden = true;
  const step = [[item, { ...stateOf(item), removed: true }]];
  if (moneyDelta) step.money = moneyDelta;
  undos.push(step);
  saveLayout();
  settleTown();
  reseatCats([], footprintOf(item));
  select(item);
  renderAddPanel();
}

function cancelPlacing() {
  placingTicket = null;
  if (!placing) return;
  discard(placing);
  placing = null;
  $('prompt').hidden = true;
  select(null);
  renderAddPanel();
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

function startFacilityPlacing(kind, rot = 0, keepModel = null) {
  addChoice.facilityKind = kind;
  const fac = FACILITIES[kind];
  let model = keepModel;
  if (!model && fac.models) {
    model = fac.models[Math.floor(Math.random() * fac.models.length)];
  }
  const add = { type: 'facility', kind, model };
  if (fac.group === 'earn' && fac.pack === 'commercial' && addChoice.wall >= 0) {
    add.wall = addChoice.wall;
  }
  startPlacing(add, rot);
}

// What to build for a model, with the colours picked in the panel.
function addFor(t, model) {
  const add = { type: t.type, model };
  if (t.pack === 'commercial' && addChoice.wall >= 0) add.wall = addChoice.wall;
  if (t.type === 'villa') Object.assign(add, { wall: addChoice.villaWall, roof: addChoice.roof });
  if (t.type === 'shop') Object.assign(add, { name: $('add-name').value.trim() || '新商店', theme: addChoice.theme });
  return add;
}

function renderAddPanel() {
  const types = ADD_TYPES.filter(a => !a.atrainOnly || LEVEL.atrain);
  let t = types.find(a => a.type === addChoice.type);
  if (!t) {
    addChoice.type = 'house';
    t = types[0];
  }
  const restyle = pick => () => {
    Object.assign(addChoice, pick);
    if (pick.type && pick.type !== 'paving') setBrush(null);
    renderAddPanel();
    if (pick.type) return;
    // A new colour repaints the building still in hand, keeping its turn.
    if (placing?.add.type === t.type) {
      if (t.type === 'facility') {
        startFacilityPlacing(placing.add.kind, placing.pivot.rotation.y, placing.add.model);
      } else {
        startPlacing(addFor(t, placing.add.model), placing.pivot.rotation.y);
      }
    }
  };
  $('add-paving').hidden = t.type !== 'paving';
  $('add-model-box').hidden = t.type === 'paving';
  $('add-brushes').replaceChildren(...BRUSHES.map(([b, label]) => chip(label, brush === b, () => setBrush(brush === b ? null : b))));
  $('add-tabs').replaceChildren(...types.map(a => chip(a.label, a === t, restyle({ type: a.type }))));
  const villa = t.type === 'villa';
  const currentKind = placing?.add?.type === 'facility' ? placing.add.kind : addChoice.facilityKind;
  const isCommEarn = t.type === 'facility' && currentKind && FACILITIES[currentKind]?.group === 'earn' && FACILITIES[currentKind]?.pack === 'commercial';
  $('add-walls').hidden = !isCommEarn && (t.pack !== 'commercial' && !villa);
  $('add-walls-row').replaceChildren(...(villa
    ? VILLA_WALLS.map(([label], i) => chip(label, addChoice.villaWall === i, restyle({ villaWall: i })))
    : WALLS.map(([label, w]) => chip(label, addChoice.wall === w, restyle({ wall: w })))));
  $('add-roofs').hidden = !villa;
  $('add-roofs-row').replaceChildren(...VILLA_ROOFS.map(([label], i) => chip(label, addChoice.roof === i, restyle({ roof: i }))));
  $('add-shop').hidden = t.type !== 'shop';
  $('add-themes').replaceChildren(...SHOP_THEMES.map((theme, i) => {
    const b = document.createElement('button');
    b.className = addChoice.theme === i ? 'on' : '';
    b.style.background = `#${theme.awning.toString(16).padStart(6, '0')}`;
    b.onclick = restyle({ theme: i });
    return b;
  }));
  if (t.type === 'facility') {
    $('add-models').className = '';
    const earnChips = Object.entries(FACILITIES)
      .filter(([, f]) => f.group === 'earn' && f.buyable !== false)
      .map(([k, f]) => chip(`${f.name} ${f.price}萬`, placing?.add?.kind === k, () => startFacilityPlacing(k)));
    const decoChips = Object.entries(FACILITIES)
      .filter(([, f]) => f.group === 'deco' && f.buyable !== false)
      .map(([k, f]) => chip(`${f.name} ${f.price}萬`, placing?.add?.kind === k, () => startFacilityPlacing(k)));

    const l1 = document.createElement('div');
    l1.className = 'opt-label';
    l1.textContent = '賺錢';
    const r1 = document.createElement('div');
    r1.className = 'chips';
    r1.replaceChildren(...earnChips);

    const l2 = document.createElement('div');
    l2.className = 'opt-label';
    l2.textContent = '裝飾公益';
    const r2 = document.createElement('div');
    r2.className = 'chips';
    r2.replaceChildren(...decoChips);

    $('add-models').replaceChildren(l1, r1, l2, r2);
  } else {
    $('add-models').className = 'add-models';
    $('add-models').replaceChildren(...t.models.map(model => {
      const b = document.createElement('button');
      b.title = model;
      b.innerHTML = `<img src="${ASSETS}/${t.pack}/Previews/${model}.png" alt="">`;
      b.onclick = () => startPlacing(addFor(t, model));
      return b;
    }));
  }
}

$('edit-add').addEventListener('click', () => {
  $('add-panel').hidden = !$('add-panel').hidden;
  renderPaintPanel();
  if (!$('add-panel').hidden) renderAddPanel();
  else cancelPlacing();
});
$('add-close').addEventListener('click', () => {
  $('add-panel').hidden = true;
  cancelPlacing();
  renderPaintPanel();
});
$('paint-close').addEventListener('click', () => select(null));
renderer.domElement.addEventListener('contextmenu', e => { if (placing) e.preventDefault(); });

// ---------- paving ----------

// ---------- paving ----------

// All roads live on one integer grid of road-wide cells lined up with the
// main street. A road cell picks the Kenney piece that joins its neighbours,
// and every side with no road gets an automatic sidewalk with a curb.
// (CELL is defined with the other dimensions at the top of this file.)
const tiles = new Map(); // "i,j" → 'road' | 'walk'
const tileGroup = new THREE.Group();
const kerbs = new THREE.Group();
scene.add(tileGroup, kerbs);

// One unit box shared by all instanced paving. A repaint only refills
// instance matrices, so the geometry count stays flat; only the
// InstancedMeshes are disposed, never this geometry or the road kit's.
const paveBox = new THREE.BoxGeometry(1, 1, 1);
const paveDummy = new THREE.Object3D();
const paveCell = new THREE.Matrix4();
const paveMesh = new THREE.Matrix4();
const paveScale = new THREE.Vector3(CELL, CELL, CELL);

// [x, y, z, w, h, d] boxes as one InstancedMesh sharing paveBox.
function paveBoxes(list, mat, parent) {
  if (!list.length) return;
  const m = new THREE.InstancedMesh(paveBox, mat, list.length);
  list.forEach(([x, y, z, w, h, d], k) => {
    paveDummy.position.set(x, y, z);
    paveDummy.scale.set(w, h, d);
    paveDummy.rotation.set(0, 0, 0);
    paveDummy.updateMatrix();
    m.setMatrixAt(k, paveDummy.matrix);
  });
  m.receiveShadow = true;
  m.computeBoundingSphere();
  parent.add(m);
}

// Drop a repaint's InstancedMeshes (their instance buffers) but no geometry.
function clearPaving(group) {
  for (const c of group.children) if (c.isInstancedMesh) c.dispose();
  group.clear();
}
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
// The painted grid cells as [i, j, kind].
const gridCells = () => [...tiles].map(([key, kind]) => [...key.split(',').map(Number), kind]);

const inBounds = (i, j) => {
  const [iMin, iMax, jMin, jMax] = LEVEL.bounds;
  return i >= iMin && i <= iMax && j >= jMin && j <= jMax;
};

function roadSides(i, j) {
  const road = (a, b) => tiles.get(cellKey(a, b)) === 'road';
  const [iMin, iMax, jMin, jMax] = LEVEL.bounds;
  // Sides with a neighbouring road stay open; a road reaching the bounds
  // edge opens outward, drawn as running straight through.
  return (road(i, j - 1) || j === jMin ? NORTH : 0) | (road(i + 1, j) || i === iMax ? EAST : 0)
    | (road(i, j + 1) || j === jMax ? SOUTH : 0) | (road(i - 1, j) || i === iMin ? WEST : 0);
}

let paveJob = 0;
async function drawTiles() {
  const job = ++paveJob;
  const gltfs = Object.fromEntries(await Promise.all(PIECES.map(async ([p]) => [p, await model('roads', p)])));
  if (job !== paveJob) return;
  clearPaving(tileGroup);
  const walks = [];
  const cellsByPiece = new Map();
  for (const [i, j, kind] of gridCells()) {
    const x = i * CELL;
    const z = j * CELL;
    if (kind === 'walk') {
      walks.push([x, 0.025, z, CELL, 0.05, CELL]);
      continue;
    }
    const [piece, k] = pieceFor.get(roadSides(i, j));
    if (!cellsByPiece.has(piece)) cellsByPiece.set(piece, []);
    cellsByPiece.get(piece).push([x, z, k]);
  }
  paveBoxes(walks, kit.pavement, tileGroup);
  for (const [piece, cells] of cellsByPiece) {
    // Each mesh inside the piece's glTF, drawn once per road cell using it:
    // the cell transform (position, quarter turn, CELL scale) times the
    // mesh's own transform inside the glTF.
    gltfs[piece].scene.updateMatrixWorld(true);
    const parts = [];
    gltfs[piece].scene.traverse(o => {
      if (o.isMesh) parts.push({ geo: o.geometry, mat: o.matrixWorld.clone() });
    });
    for (const { geo, mat } of parts) {
      const m = new THREE.InstancedMesh(geo, kit.roadMat, cells.length);
      cells.forEach(([x, z, k], n) => {
        paveCell.makeRotationY(k * Math.PI / 2).scale(paveScale).setPosition(x, 0, z);
        m.setMatrixAt(n, paveMesh.multiplyMatrices(paveCell, mat));
      });
      m.receiveShadow = true;
      m.computeBoundingSphere();
      tileGroup.add(m);
    }
  }
  buildRoads();
}

// Sidewalks draw from the same rules as the walk grid (see sidewalkRects):
// each entry is a strip (side set, slab plus curb) or a corner fill (side
// 0, slab only). Walk tiles underneath keep their own slabs.
function paveSidewalks() {
  clearPaving(kerbs);
  const R = CELL / 2;
  const slabs = [];
  const curbs = [];
  for (const { r, side, x, z } of sidewalkRects()) {
    const [x0, z0, x1, z1] = r;
    slabs.push([(x0 + x1) / 2, 0.024, (z0 + z1) / 2, x1 - x0, 0.05, z1 - z0]);
    if (!side) continue;
    if (side === NORTH) curbs.push([x, 0.03, z - R - 0.03, CELL, 0.06, 0.06]);
    else if (side === SOUTH) curbs.push([x, 0.03, z + R + 0.03, CELL, 0.06, 0.06]);
    else if (side === EAST) curbs.push([x + R + 0.03, 0.03, z, 0.06, 0.06, CELL]);
    else curbs.push([x - R - 0.03, 0.03, z, 0.06, 0.06, CELL]);
  }
  paveBoxes(slabs, kit.pavement, kerbs);
  paveBoxes(curbs, kit.curb, kerbs);
}

// Zebra crossings: across a road running east–west, or across a straight
// north–south road (`ns`), `w` wide along the road.
const DEFAULT_ZEBRAS = LEVEL.zebras.map(zb => ({ ...zb }));
const zebras = DEFAULT_ZEBRAS.map(zb => ({ ...zb }));
const zebraMat = std(0xe8e2cf, { roughness: 0.6 });
const zebraGroup = new THREE.Group();
scene.add(zebraGroup);

function drawZebras() {
  clearPaving(zebraGroup);
  const stripes = [];
  for (const { x, z, w, ns } of zebras) {
    for (let i = 0; i < 7; i++) {
      const t = -ROAD_HALF + 0.12 + i * 0.226;
      if (ns) stripes.push([x + t, 0.022, z, 0.11, 0.004, w]);
      else stripes.push([x, 0.022, z + t, w, 0.004, 0.11]);
    }
  }
  paveBoxes(stripes, zebraMat, zebraGroup);
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

// Where a crossing painted at this cell would go: across a straight road
// cell; nowhere else.
function zebraAt(at, i, j) {
  const node = roads.get(cellKey(i, j));
  if (!node || isJunction(node)) return null;
  const sides = [...node.links.keys()];
  if (sides.length !== 2 || sides[0] !== opposite(sides[1])) return null;
  const zb = { x: node.x, z: node.z, w: 0.72, ns: sides.includes(NORTH) };
  return zebras.some(o => Math.hypot(o.x - zb.x, o.z - zb.z) < CELL - 1e-6) ? null : zb;
}

const inCell = (zb, i, j) => Math.abs(zb.x - i * CELL) <= CELL / 2 + 1e-6 && Math.abs(zb.z - j * CELL) <= CELL / 2 + 1e-6;

// Without tiles the level defaults apply; a layout owning #tiles (even an
// empty one, an intentionally cleared map) replaces them entirely.
function setTiles(cells) {
  tiles.clear();
  const src = cells === undefined ? defaultTilesObj(LEVEL) : cells;
  for (const [key, kind] of Object.entries(src)) {
    if (kind === 'walk' && railCells.has(key)) continue;
    tiles.set(key, kind);
  }
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

// A drag paints many cells per second; coalesce a stroke's repaints so at
// most one runs per frame.
let paveQueued = false;
function queuePave() {
  if (paveQueued) return;
  paveQueued = true;
  requestAnimationFrame(() => {
    paveQueued = false;
    drawTiles();
    paveSidewalks();
  });
}

function paintAt(at) {
  const i = Math.round(at.x / CELL);
  const j = Math.round(at.z / CELL);
  // The brush stops at the map edge.
  if (!inBounds(i, j)) {
    brushMark.position.set(i * CELL, 0.07, j * CELL);
    brushMark.material.color.setHex(0xff5a5a);
    brushMark.visible = true;
    return;
  }
  const zebra = brush === 'zebra' ? zebraAt(at, i, j) : null;
  // Rails are fixed: no brush paints over them, but a road may cross them
  // (a new crossing) and erase may lift a crossing road again.
  const onRail = railCells.has(cellKey(i, j));
  const ok = brush === 'erase' || (brush === 'zebra' ? !!zebra && !onRail : brush === 'road' ? true : !onRail);
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
  queuePave();
}

function endStroke() {
  const before = stroke;
  stroke = null;
  const sameTiles = before.tiles.size === tiles.size && [...before.tiles].every(([k, v]) => tiles.get(k) === v);
  const sameZebras = before.zebras === JSON.stringify(zebras);
  if (sameTiles && sameZebras) return;

  const beforeZebras = JSON.parse(before.zebras);
  if (!LEVEL.atrain || !p2State) {
    undos.push(Object.assign([], { tiles: before.tiles, zebras: beforeZebras }));
    saveLayout();
    settleTown();
    return;
  }

  let net = 0;
  const allTileKeys = new Set([...before.tiles.keys(), ...tiles.keys()]);
  for (const k of allTileKeys) {
    const prev = before.tiles.get(k);
    const next = tiles.get(k);
    if (prev !== next) {
      if (prev === 'road') net += 1;
      else if (prev === 'walk') net += 0.5;
      if (next === 'road') net -= 2;
      else if (next === 'walk') net -= 1;
    }
  }

  const zbKey = zb => JSON.stringify(zb);
  const beforeZSet = new Set(beforeZebras.map(zbKey));
  const afterZSet = new Set(zebras.map(zbKey));
  for (const zStr of afterZSet) {
    if (!beforeZSet.has(zStr)) net -= 1;
  }
  for (const zStr of beforeZSet) {
    if (!afterZSet.has(zStr)) net += 0.5;
  }
  net = Math.round(net * 10) / 10;

  let delta = 0;
  if (net < 0) {
    if (!spend(-net)) {
      setTiles(Object.fromEntries(before.tiles));
      setZebras(beforeZebras);
      settleTown();
      return;
    }
    delta = p2State.unlimited ? 0 : net;
  } else if (net > 0) {
    delta = applyMoney(net);
  }

  undos.push(Object.assign([], { tiles: before.tiles, zebras: beforeZebras, money: delta }));
  saveLayout();
  settleTown();
}

// Ten save slots in this browser, and layouts as .json files to keep or share.
const SLOTS_KEY = 'small-town:slots';
const OLD_SLOTS_KEY = 'small-town:layout-slots';
const LAYOUT_FILE = { app: 'small-town', kind: 'layout', version: 2 };

// Every game switch writes the level and layout at once, then reloads. A
// failed write keeps the current level and progress: no reload, and the
// scene and storage stay as they were.
function switchGame(level, layout) {
  try {
    localStorage.setItem(GAME_KEY, JSON.stringify({ level, layout }));
  } catch {
    alert('無法切換：瀏覽器儲存空間不足或無法使用。');
    return;
  }
  location.reload();
}

// A fixed top-down shot of the map centre, without editing helpers. Renders
// offscreen without post-processing, flips the pixels upright and returns a
// JPEG data URL.
function takeShot() {
  const W = 320, H = 180;
  const prev = renderer.getRenderTarget();
  const outlineWas = outline.visible;
  const brushWas = brushMark.visible;
  const radiusWas = radiusMark.visible;
  const placingWas = placing ? placing.pivot.visible : false;
  const snap = new THREE.PerspectiveCamera(45, W / H, 0.1, 200);
  const [tx, ty, tz] = LEVEL.camera.target;
  snap.position.set(tx, ty + 30, tz + 0.01);
  snap.lookAt(tx, ty, tz);
  const rt = new THREE.WebGLRenderTarget(W, H);
  rt.texture.colorSpace = THREE.SRGBColorSpace;
  try {
    outline.visible = false;
    brushMark.visible = false;
    radiusMark.visible = false;
    if (placing) placing.pivot.visible = false;
    renderer.setRenderTarget(rt);
    renderer.render(scene, snap);
    const pixels = new Uint8Array(W * H * 4);
    renderer.readRenderTargetPixels(rt, 0, 0, W, H, pixels);
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    const img = ctx.createImageData(W, H);
    for (let y = 0; y < H; y++) img.data.set(pixels.subarray((H - 1 - y) * W * 4, (H - y) * W * 4), y * W * 4);
    ctx.putImageData(img, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.7);
  } finally {
    outline.visible = outlineWas;
    brushMark.visible = brushWas;
    radiusMark.visible = radiusWas;
    if (placing) placing.pivot.visible = placingWas;
    renderer.setRenderTarget(prev);
    rt.dispose();
  }
}

function readSlots() {
  try {
    const cur = JSON.parse(localStorage.getItem(SLOTS_KEY) || 'null');
    if (Array.isArray(cur)) return Array.from({ length: 10 }, (_, i) => cur[i] ?? null);
  } catch { /* fall through to the old slots */ }
  // No new slots yet: move the old three into the first three (town level,
  // no shot, A1 migration), leaving the old key and the game untouched.
  // Only persist when old data actually moves; an empty panel reads
  // without writing so a full storage never alerts here.
  let moved = null;
  try {
    const old = JSON.parse(localStorage.getItem(OLD_SLOTS_KEY) || 'null');
    if (Array.isArray(old) && old.some(s => s && typeof s.layout === 'object' && s.layout)) {
      moved = Array.from({ length: 10 }, (_, i) => {
        const s = old[i];
        if (i > 2 || !s || typeof s.layout !== 'object' || !s.layout) return null;
        return { savedAt: s.savedAt ?? Date.now(), level: 'town', layout: migrateLayout(s.layout), shot: null };
      });
    }
  } catch { /* storage unavailable: treat as no old data */ }
  if (!moved) return Array(10).fill(null);
  try { localStorage.setItem(SLOTS_KEY, JSON.stringify(moved)); }
  catch { alert('存檔失敗：瀏覽器儲存空間不足或無法使用。'); }
  return moved;
}

function renderSlots() {
  const slots = readSlots();
  $('slot-list').replaceChildren(...slots.map((slot, i) => {
    const row = document.createElement('div');
    row.className = 'slot';
    if (slot && slot.shot) {
      const img = document.createElement('img');
      img.src = slot.shot;
      img.alt = '';
      img.width = 160;
      img.height = 90;
      row.append(img);
    } else {
      const ph = document.createElement('div');
      ph.className = 'shot-empty';
      ph.textContent = slot ? '無快照' : '空';
      row.append(ph);
    }
    const info = document.createElement('div');
    const title = document.createElement('b');
    title.textContent = `存檔 ${i + 1}`;
    const sub = document.createElement('span');
    sub.textContent = slot
      ? `${levelById(slot.level).name} · ${new Date(slot.savedAt).toLocaleString('zh-TW', { hour12: false })}`
      : '空';
    info.append(title, sub);
    const save = document.createElement('button');
    save.textContent = '存到這裡';
    save.onclick = () => {
      if (slot && !confirm(`覆蓋存檔 ${i + 1}？`)) return;
      const next = slots.slice();
      next[i] = { savedAt: Date.now(), level: LEVEL.id, layout: currentLayout(), shot: takeShot() };
      try {
        localStorage.setItem(SLOTS_KEY, JSON.stringify(next));
      } catch {
        alert('存檔失敗：瀏覽器儲存空間不足或無法使用。');
        return;
      }
      renderSlots();
    };
    const load = document.createElement('button');
    load.textContent = '讀取';
    load.disabled = !slot;
    load.onclick = () => {
      if (!confirm(`讀取存檔 ${i + 1}？目前未存檔的變動會消失。`)) return;
      switchGame(levelById(slot.level).id, slot.layout);
    };
    row.append(info, save, load);
    return row;
  }));
}

function renderLevels() {
  $('level-cards').replaceChildren(...LEVELS.map(lv => {
    const card = document.createElement('div');
    card.className = 'level-card';
    const img = document.createElement('img');
    img.src = lv.preview;
    img.alt = lv.name;
    const body = document.createElement('div');
    body.className = 'level-body';
    const name = document.createElement('b');
    name.textContent = lv.name;
    const blurb = document.createElement('p');
    blurb.textContent = lv.blurb;
    const go = document.createElement('button');
    go.textContent = '開始';
    go.onclick = () => {
      if (!confirm(`開始新的「${lv.name}」？目前未存檔的變動會消失。`)) return;
      switchGame(lv.id, {});
    };
    body.append(name, blurb, go);
    card.append(img, body);
    return card;
  }));
}

function setMenuTab(saves) {
  $('level-cards').hidden = saves;
  $('slots').hidden = !saves;
  $('levels-tab').classList.toggle('on', !saves);
  $('slots-tab').classList.toggle('on', saves);
  if (saves) renderSlots();
}

$('new-town').addEventListener('click', e => {
  renderLevels();
  setMenuTab(false);
  $('levels').hidden = false;
  e.currentTarget.blur();
});
$('levels-close').addEventListener('click', () => { $('levels').hidden = true; });

$('levels-tab').addEventListener('click', () => setMenuTab(false));
$('slots-tab').addEventListener('click', () => setMenuTab(true));
$('layout-export').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ ...LAYOUT_FILE, level: LEVEL.id, layout: currentLayout() }, null, 2)], { type: 'application/json' });
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
    if (data.app !== LAYOUT_FILE.app || data.kind !== LAYOUT_FILE.kind || !data.layout || typeof data.layout !== 'object' || Array.isArray(data.layout)) throw new Error();
    const level = (data.version === 1 || data.level === undefined) ? 'town' : data.level;
    if (!LEVELS.some(lv => lv.id === level)) {
      alert('這個佈局檔的關卡不存在');
      return;
    }
    if (!confirm(`匯入這個佈局檔？將切換到「${levelById(level).name}」並取代目前進度。`)) return;
    switchGame(level, migrateLayout(data.layout));
  } catch {
    alert('這不是小鎮的佈局檔。');
  }
});

$('edit').addEventListener('click', e => { setEditing(!editing); e.currentTarget.blur(); });
$('edit-undo').addEventListener('click', undo);
$('edit-reset').addEventListener('click', () => {
  if (!confirm(`還原成預設的「${LEVEL.name}」？所有搬動和刪除都會清除。`)) return;
  switchGame(LEVEL.id, {});
});

// ---------- town growth (P2-D) ----------

// Each morning a few houses go up along the roads. Lots sit behind every
// sidewalk edge, one per whole world unit along the street, the front on the
// sidewalk's outer edge. The level's own trees are cleared; anything else in
// the way blocks the lot.
const HOUSE_LOT = [1.0, 1.2]; // width along the street, depth
const VILLA_LOT = [1.5, 1.3];
const GROW_HOUSES = ['building-b', 'building-d', 'building-f', 'building-g'];
const GROW_VILLAS = ['building-type-a', 'building-type-c', 'building-type-e', 'building-type-g'];
const GROW_SHOPS = ['building-a', 'building-c', 'building-h'];
const LOT_NORMALS = { [NORTH]: [0, -1], [SOUTH]: [0, 1], [EAST]: [1, 0], [WEST]: [-1, 0] };
const growing = []; // { pivot, t } rising out of the ground
let growBusy = false;
const levelShopIds = new Set(SHOPS.map(s => `shop:${s.name}`));

const overlaps = (a, b) => a.minX < b.maxX && a.maxX > b.minX && a.minZ < b.maxZ && a.maxZ > b.minZ;
const postBox = p => ({ minX: p.x - p.r, maxX: p.x + p.r, minZ: p.z - p.r, maxZ: p.z + p.r });
const randomOf = list => list[Math.floor(Math.random() * list.length)];

// Every lot along the current roads: the middle of its front edge and the
// way out from the road.
function allLots(rects) {
  const lots = [];
  for (const { side, x, z } of rects) {
    if (!side) continue;
    const [i, j] = [Math.round(x / CELL), Math.round(z / CELL)];
    const along = LOT_NORMALS[side][0] ? z : x;
    for (let k = Math.ceil(along - CELL / 2); k < along + CELL / 2; k++) lots.push(lotAt(i, j, side, k));
  }
  return lots;
}

function lotAt(i, j, side, k) {
  const [nx, nz] = LOT_NORMALS[side];
  return {
    key: `${i},${j},${side},${k}`, cell: cellKey(i, j),
    nx, nz, fx: nx ? i * CELL + nx * FRONTAGE : k, fz: nx ? k : j * CELL + nz * FRONTAGE,
  };
}

function lotBox({ nx, nz, fx, fz }, [w, d]) {
  const [cx, cz] = [fx + nx * d / 2, fz + nz * d / 2];
  const [hx, hz] = nx ? [d / 2, w / 2] : [w / 2, d / 2];
  return { minX: cx - hx, maxX: cx + hx, minZ: cz - hz, maxZ: cz + hz };
}

// On a road, sidewalk, walk or rail cell.
function onStreet(b, rects) {
  for (let i = Math.round(b.minX / CELL); i <= Math.round(b.maxX / CELL); i++) {
    for (let j = Math.round(b.minZ / CELL); j <= Math.round(b.maxZ / CELL); j++) {
      if (tiles.has(cellKey(i, j)) || railCells.has(cellKey(i, j))) return true;
    }
  }
  return rects.some(({ r }) => overlaps(b, { minX: r[0], minZ: r[1], maxX: r[2], maxZ: r[3] }));
}

// Nothing in the way but the level's trees, and at least a cell inside the map.
function lotFree(box, rects, trees, ignoreSolids = null) {
  const b = { minX: box.minX + 0.02, maxX: box.maxX - 0.02, minZ: box.minZ + 0.02, maxZ: box.maxZ - 0.02 };
  const [iMin, iMax, jMin, jMax] = LEVEL.bounds;
  if (b.minX < (iMin + 0.5) * CELL || b.maxX > (iMax - 0.5) * CELL || b.minZ < (jMin + 0.5) * CELL || b.maxZ > (jMax - 0.5) * CELL) return false;
  if (onStreet(b, rects) || solids.some(s => !ignoreSolids?.has(s) && overlaps(b, s))) return false;
  return !posts.some(p => !trees.has(p) && overlaps(b, postBox(p)));
}

// Posts of the level's own trees, which growth may clear.
function levelTreePosts() {
  const set = new Set();
  for (const item of editables.values()) {
    if (!item.removed && item.id.startsWith('tree:')) for (const { p } of item.posts) set.add(p);
  }
  return set;
}

function homeCount() {
  let n = 0;
  for (const item of editables.values()) {
    if (item === placing || item.removed) continue;
    if (item.id.startsWith('home:') || item.add?.type === 'house' || item.add?.type === 'villa' || item.add?.kind === 'smallApartment') n++;
  }
  return n;
}

// Every standing shop: the level's, added, facility and grown ones.
function shopPositions() {
  const out = [];
  for (const item of editables.values()) {
    if (item === placing || item.removed) continue;
    if (levelShopIds.has(item.id) || item.add?.type === 'shop' || item.add?.kind === 'shop') out.push(item.pivot.position);
  }
  return out;
}

const shopCount = () => shopPositions().length;

function growthContext(stops) {
  const facilities = [];
  for (const item of editables.values()) {
    if (item === placing || item.removed || item.add?.type !== 'facility') continue;
    const { radius, growth } = FACILITIES[item.add.kind];
    if (growth && facilityLinked(item)) facilities.push({ x: item.pivot.position.x, z: item.pivot.position.z, radius, growth });
  }
  return {
    cell: CELL, station: editables.get('station').pivot.position, stops,
    busCells: p2State.buses.length && busRoute ? new Set(busRoute) : null, facilities,
  };
}

// Up to 50 free lots, scored; only those good enough to build on.
function scoredLots(ctx, rects, trees) {
  const lots = allLots(rects);
  for (let i = lots.length; i-- > 1;) {
    const j = Math.floor(Math.random() * (i + 1));
    [lots[i], lots[j]] = [lots[j], lots[i]];
  }
  const out = [];
  for (const lot of lots) {
    if (out.length === 50) break;
    if (p2State.day <= p2State.growth.cooldown[lot.key]) continue;
    const box = lotBox(lot, HOUSE_LOT);
    if (!lotFree(box, rects, trees)) continue;
    const beside = lot.nx ? { ...box, minZ: box.minZ - 1, maxZ: box.maxZ + 1 } : { ...box, minX: box.minX - 1, maxX: box.maxX + 1 };
    const x = (box.minX + box.maxX) / 2;
    const z = (box.minZ + box.maxZ) / 2;
    out.push({ ...lot, x, z, score: lotScore({ x, z, cell: lot.cell, neighbour: solids.some(s => overlaps(beside, s)) }, ctx) });
  }
  return out.filter(lot => lot.score >= GROWTH_MIN_SCORE);
}

// Draws one lot weighted by score and takes it out of the pool.
function drawLot(pool) {
  let r = Math.random() * pool.reduce((sum, lot) => sum + lot.score, 0);
  const i = pool.findIndex(lot => (r -= lot.score) < 0);
  return pool.splice(i < 0 ? pool.length - 1 : i, 1)[0];
}

// Puts an added building on a lot, front on the lot's front edge, facing the road.
// Puts an added building on a lot, front on the lot's front edge, facing the
// road; null if it would touch the street or another building.
async function buildOnLot(id, lot, add, rects) {
  const item = await buildAdded(id, add);
  const depth = item.places[0].at.z - 0.05; // pivot to front face
  applyState(item, { x: lot.fx + lot.nx * depth, z: lot.fz + lot.nz * depth, rot: Math.atan2(-lot.nx, -lot.nz), removed: false });
  const own = new Set(item.solids.map(({ s }) => s));
  if (item.solids.some(({ s }) => onStreet(s, rects) || solids.some(o => !own.has(o) && overlaps(s, o)))) {
    discard(item);
    return null;
  }
  return item;
}

// One grown town house a day becomes a small apartment once it is five days
// old and near the station or among shops.
async function upgradeHouse(ctx, rects) {
  const shops = shopPositions();
  const near = (p, q, cells) => Math.hypot(p.x - q.x, p.z - q.z) <= cells * CELL;
  const houses = [...editables.values()].filter(item => !item.removed && item.add?.auto && item.add.type === 'house'
    && p2State.day - item.add.born >= 5
    && (near(item.pivot.position, ctx.station, 12) || shops.filter(q => near(item.pivot.position, q, 6)).length >= 3));
  if (!houses.length) return false;
  const house = randomOf(houses);
  const { lot, born } = house.add;
  const apt = await buildAdded(`${house.id}-up`,
    { type: 'facility', kind: 'smallApartment', model: 'building-m', auto: true, lot, born });
  const state = stateOf(house);
  applyState(apt, { x: state.x, z: state.z, rot: state.rot, removed: false });
  const ignored = new Set([...house.solids, ...apt.solids].map(({ s }) => s));
  if (!lotFree(apt.solids[0].s, rects, new Set(), ignored)) {
    discard(apt);
    return false;
  }
  applyState(house, { ...stateOf(house), removed: true });
  return true;
}

// Today's buildings: first a shop when there are too few for the homes, then
// houses near the station and villas further out.
function planGrowth(quota, ctx, rects) {
  const trees = levelTreePosts();
  const pool = scoredLots(ctx, rects, trees);
  const taken = [];
  const plans = [];
  const shops = shopPositions();
  if (homeCount() > 12 * shops.length) {
    const spaced = pool.filter(lot => lot.score >= 7 && !shops.some(p =>
      Math.abs(lot.nx ? p.z - lot.z : p.x - lot.x) <= 3 && Math.abs(lot.nx ? p.x - lot.x : p.z - lot.z) <= 1));
    if (spaced.length) {
      const lot = drawLot(spaced);
      pool.splice(pool.indexOf(lot), 1);
      taken.push(lotBox(lot, HOUSE_LOT));
      plans.push({ lot, add: { type: 'shop', model: randomOf(GROW_SHOPS), name: randomOf(SHOP_NAMES),
        theme: Math.floor(Math.random() * SHOP_THEMES.length), wall: -1 } });
    }
  }
  while (plans.length < quota && pool.length) {
    const lot = drawLot(pool);
    const near = Math.hypot(lot.x - ctx.station.x, lot.z - ctx.station.z) <= 15 * CELL;
    const box = lotBox(lot, near ? HOUSE_LOT : VILLA_LOT);
    if (taken.some(b => overlaps(b, box)) || (!near && !lotFree(box, rects, trees))) continue;
    taken.push(box);
    plans.push({ lot, add: near
      ? { type: 'house', model: randomOf(GROW_HOUSES), wall: Math.floor(Math.random() * WALLS.length) - 1 }
      : { type: 'villa', model: randomOf(GROW_VILLAS), wall: Math.floor(Math.random() * VILLA_WALLS.length), roof: Math.floor(Math.random() * VILLA_ROOFS.length) } });
  }
  return plans;
}

async function growTown(stops) {
  if (!LEVEL.atrain || !p2State.growth.on || growBusy) return;
  growBusy = true;
  const day = p2State.day;
  const rects = sidewalkRects();
  const ctx = growthContext(stops);
  const upgraded = await upgradeHouse(ctx, rects);
  const quota = Math.min(GROWTH_SPEEDS[p2State.growth.speed], 300 - homeCount());
  const plans = quota > 0 ? planGrowth(quota, ctx, rects) : [];
  const built = (await Promise.all(plans.map(({ lot, add }, n) =>
    buildOnLot(`grow:${day}-${n + 1}`, lot, { ...add, auto: true, lot: lot.key, born: day }, rects)))).filter(Boolean);
  for (const item of built) {
    const box = item.solids[0].s;
    for (const tree of editables.values()) {
      if (!tree.removed && tree.id.startsWith('tree:') && tree.posts.some(({ p }) => overlaps(box, postBox(p)))) {
        applyState(tree, { ...stateOf(tree), removed: true });
      }
    }
    item.pivot.scale.y = 0;
    growing.push({ pivot: item.pivot, t: 0 });
  }
  growBusy = false;
  if (!built.length && !upgraded) return;
  settleTown();
  saveLayout();
  if (refreshTownTab) refreshTownTab();
  if (built.length) {
    showToast(`新住宅落成 ×${built.length}`, () => {
      const p = built[0].pivot.position;
      camera.position.add(new THREE.Vector3(p.x - controls.target.x, 0, p.z - controls.target.z));
      controls.target.set(p.x, controls.target.y, p.z);
    });
  }
}

// New houses rise out of the ground over 0.6 s; at once when skipping time.
function updateGrowing(dt) {
  for (let i = growing.length; i--;) {
    const g = growing[i];
    g.t = skipModeActive ? 0.6 : g.t + dt;
    g.pivot.scale.y = Math.min(1, g.t / 0.6);
    if (g.t >= 0.6) growing.splice(i, 1);
  }
}

// ---------- crossing bell (P2-E) ----------

let audioCtx = null;
let tones = [];
let bellT = 0;
let bellTone = -1;
let muted = false;
const muteBtn = $('mute');

// Two square waves that take turns, run through a quiet master gain. Browsers
// only allow audio after a user gesture, so this waits for the first one.
function initAudio() {
  audioCtx = new AudioContext();
  const master = audioCtx.createGain();
  master.gain.value = 0.04;
  master.connect(audioCtx.destination);
  tones = [750, 600].map(hz => {
    const osc = audioCtx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = hz;
    const gain = audioCtx.createGain();
    gain.gain.value = 0;
    osc.connect(gain).connect(master);
    osc.start();
    return gain;
  });
}

function setMuted(val) {
  muted = val;
  muteBtn.textContent = muted ? '🔕' : '🔔';
  try { localStorage.setItem('small-town:muted', muted ? '1' : '0'); } catch { /* storage unavailable */ }
}
try { setMuted(localStorage.getItem('small-town:muted') === '1'); } catch { /* storage unavailable */ }
muteBtn.addEventListener('click', () => { setMuted(!muted); muteBtn.blur(); });

// Ding-dong while a nearby crossing is closed; real time, not game speed.
function updateBell(dt) {
  if (!audioCtx) return;
  const ringing = !muted && speed > 0 && rail.crossings.some(c =>
    c.closed && Math.hypot(camera.position.x - c.x, camera.position.y, camera.position.z - c.z) < 40);
  bellT = ringing ? bellT + dt : 0;
  const tone = ringing ? Math.floor(bellT / 0.35) % 2 : -1;
  if (tone === bellTone) return;
  bellTone = tone;
  tones.forEach((gain, k) => gain.gain.setTargetAtTime(k === tone ? 1 : 0, audioCtx.currentTime, 0.01));
}

// ---------- train camera (P2-E) ----------

let followingTrain = null;

function followTrain(units) {
  if (!followingTrain) {
    followingTrain = {
      units,
      pos: camera.position.clone(),
      target: controls.target.clone(),
      ideal: new THREE.Vector3(),
      lookAt: new THREE.Vector3(),
    };
    controls.enabled = false;
  } else {
    followingTrain.units = units;
  }
}

function stopFollow() {
  if (!followingTrain) return false;
  camera.position.copy(followingTrain.pos);
  controls.target.copy(followingTrain.target);
  camera.lookAt(controls.target);
  controls.enabled = true;
  followingTrain = null;
  return true;
}

function updateFollow(dt) {
  if (!followingTrain) return;
  const head = followingTrain.units[0].obj;
  if (!head.visible) {
    stopFollow();
    return;
  }
  const ry = head.rotation.y;
  followingTrain.ideal.set(
    head.position.x - Math.sin(ry) * 2.6,
    head.position.y + 1.4,
    head.position.z - Math.cos(ry) * 2.6
  );
  followingTrain.lookAt.set(
    head.position.x,
    head.position.y + 0.3,
    head.position.z
  );
  const t = 1 - Math.exp(-4 * dt);
  camera.position.lerp(followingTrain.ideal, t);
  controls.target.lerp(followingTrain.lookAt, t);
  camera.lookAt(controls.target);
}

// ---------- main loop ----------

const clock = new THREE.Clock();
function frame() {
  const dt = Math.min(clock.getDelta(), 0.1);
  const a = Math.min(1, activity(time) + crowdBoost);

  if (LEVEL.atrain) {
    const rate = speed === 0 ? 0 : speed / 60;
    if (rate === 60) {
      if (!skipModeActive) {
        skipModeActive = true;
        for (const v of vehicles) v.leave();
        roads.forEach(node => { node.holder = null; });
        for (const w of walkers) w.obj.visible = false;
        for (const c of cats) if (c.obj) c.obj.visible = false;
      }
      if (rate > 0) {
        const totalMins = dt * 60;
        const steps = Math.max(1, Math.ceil(totalMins / 0.1));
        const stepMins = totalMins / steps;
        for (let s = 0; s < steps; s++) {
          advanceClock(stepMins);
          if (rail) rail.update(stepMins, player.active ? player.pos : null, clockMinutes, opsDay);
        }
      }
    } else {
      if (skipModeActive) {
        skipModeActive = false;
        for (const v of vehicles) {
          v.leave();
          v.cooldown = rand() * 4;
        }
        roads.forEach(node => { node.holder = null; });
        for (const w of walkers) {
          w.obj.visible = w.rank < activity(time);
        }
        for (const c of cats) if (c.obj) c.obj.visible = !c.gone;
      }
      if (rate > 0) {
        const simDt = dt * rate;
        const steps = Math.max(1, Math.ceil(simDt / 0.1));
        const stepDt = simDt / steps;
        for (let s = 0; s < steps; s++) {
          advanceClock(stepDt);
          if (rail) rail.update(stepDt, player.active ? player.pos : null, clockMinutes, opsDay);
          updateTraffic(stepDt, a);
          for (const w of walkers) w.update(stepDt, a);
          for (let i = walkers.length; i--;) if (walkers[i].done) walkers.splice(i, 1);
          updateCats(stepDt);
        }
      }
    }
    applyTime(time);
    if (updateFleetLiveStatus) updateFleetLiveStatus();
  } else {
    setTime(time + dt * speed / 3600, true);
    applyTime(time);
    if (rail) rail.update(dt, dt * speed, activity(time), player.active ? player.pos : null);
    if (LEVEL.commuters) updateCommuters(dt);
    for (const w of walkers) w.update(dt, a);
    for (let i = walkers.length; i--;) if (walkers[i].done) walkers.splice(i, 1);
    updateTraffic(dt, a);
    updateCats(dt);
  }

  if (rail) updateBell(dt);
  if (wishes) wishes.update(dt);
  updatePlayer(dt);
  updateTalk(dt);
  updateGrowing(dt);
  updateFollow(dt);
  controls.update();
  updateUI();
  music.tick(time, speed);
  if (quality === 'low') renderer.render(scene, camera);
  else composer.render();
  requestAnimationFrame(frame);
}

// The layout (tiles, zebras, editables) lands before any people plan their
// walks, so the first plans already see the real walk grid.
await buildTown();
await initRail();
if (rail) {
  muteBtn.hidden = false;
  const once = () => {
    removeEventListener('pointerdown', once);
    removeEventListener('keydown', once, true);
    initAudio();
  };
  addEventListener('pointerdown', once);
  addEventListener('keydown', once, true);
}
await applyLayout();
await Promise.all([addPeople(), addTraffic()]);
addCats();
addWishes();
// ---------- operations panel (P2-A) ----------

function setupOpsPanel() {
  if (!LEVEL.atrain || !p2State) return;

  updateMoneyUI();
  $('toast')?.addEventListener('click', () => {
    clearTimeout(toastTimer);
    $('toast').hidden = true;
    toastAction?.();
    toastAction = null;
  });

  const opsBtn = $('ops');
  const opsPanel = $('ops-panel');
  const opsClose = $('ops-close');
  const unlimitedBox = $('ops-unlimited');
  const growthOnBox = $('ops-growth-on');
  if (!opsBtn || !opsPanel) return;

  unlimitedBox.checked = p2State.unlimited;
  unlimitedBox.addEventListener('change', () => {
    p2State.unlimited = unlimitedBox.checked;
    saveLayout();
    updateMoneyUI();
  });
  growthOnBox.addEventListener('change', () => {
    p2State.growth.on = growthOnBox.checked;
    saveLayout();
  });

  opsBtn.hidden = false;

  const opsSize = { w: 760, h: 720 };
  try {
    const saved = JSON.parse(localStorage.getItem('small-town:ops-size'));
    if (saved && Number.isFinite(saved.w) && Number.isFinite(saved.h)) {
      opsSize.w = Math.round(saved.w);
      opsSize.h = Math.round(saved.h);
    }
  } catch { /* storage unavailable */ }

  function applyOpsSize() {
    if (window.innerWidth <= 600) {
      opsPanel.style.width = '';
      opsPanel.style.height = '';
      return;
    }
    const maxW = Math.max(420, window.innerWidth - 32);
    const maxH = Math.max(320, window.innerHeight - 32);
    opsSize.w = Math.min(Math.max(opsSize.w, 420), maxW);
    opsSize.h = Math.min(Math.max(opsSize.h, 320), maxH);
    opsPanel.style.width = `${opsSize.w}px`;
    opsPanel.style.height = `${opsSize.h}px`;
  }
  applyOpsSize();
  window.addEventListener('resize', applyOpsSize);

  let dragAxis = null;
  let dragPointerId = null;
  for (const handle of opsPanel.querySelectorAll('.ops-handle')) {
    handle.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      handle.setPointerCapture(e.pointerId);
      dragAxis = handle.dataset.axis;
      dragPointerId = e.pointerId;
      e.preventDefault();
    });
  }
  window.addEventListener('pointermove', e => {
    if (!dragAxis || dragPointerId !== e.pointerId) return;
    if (dragAxis === 'x' || dragAxis === 'xy') {
      opsSize.w = Math.round(2 * Math.abs(e.clientX - window.innerWidth / 2));
    }
    if (dragAxis === 'y' || dragAxis === 'xy') {
      opsSize.h = Math.round(2 * Math.abs(e.clientY - window.innerHeight / 2));
    }
    applyOpsSize();
  });
  function finishDrag(e) {
    if (!dragAxis || dragPointerId !== e.pointerId) return;
    dragAxis = null;
    dragPointerId = null;
    try {
      localStorage.setItem('small-town:ops-size', JSON.stringify({ w: opsSize.w, h: opsSize.h }));
    } catch { /* storage unavailable */ }
  }
  window.addEventListener('pointerup', finishDrag);
  window.addEventListener('pointercancel', finishDrag);

  function toggleOps(show) {
    const willShow = show !== undefined ? show : opsPanel.hidden;
    opsPanel.hidden = !willShow;
    opsBtn.classList.toggle('on', willShow);
    if (willShow) {
      if (typeof setEditing === 'function' && editing) setEditing(false);
      renderOpsPanel();
    }
  }

  opsBtn.addEventListener('click', e => {
    toggleOps();
    e.currentTarget.blur();
  });
  opsClose.addEventListener('click', () => toggleOps(false));

  let currentOpsTab = 'train';
  const opsTabs = $('ops-tabs');
  if (opsTabs) {
    for (const btn of opsTabs.querySelectorAll('button[data-tab]')) {
      btn.addEventListener('click', () => {
        currentOpsTab = btn.dataset.tab;
        for (const b of opsTabs.querySelectorAll('button[data-tab]')) {
          b.classList.toggle('on', b === btn);
        }
        if ($('ops-train-tab')) $('ops-train-tab').hidden = currentOpsTab !== 'train';
        if ($('ops-bus-tab')) $('ops-bus-tab').hidden = currentOpsTab !== 'bus';
        $('ops-town-tab').hidden = currentOpsTab !== 'town';
        renderOpsPanel();
      });
    }
  }

  function renderOpsPanel() {
    unlimitedBox.checked = p2State.unlimited;
    if (currentOpsTab === 'train') {
      renderFleetList();
      renderBuyButtons();
      renderTimetable();
    } else if (currentOpsTab === 'bus') {
      renderBusList();
      renderBusBuyButton();
    } else if (currentOpsTab === 'town') {
      renderTownTab();
    }
  }

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const GROWTH_SPEED_LABELS = { slow: '慢', normal: '一般', fast: '快' };

  function renderTownYesterday() {
    const yEl = $('ops-town-yesterday');
    if (p2State.ledger.length === 0) {
      yEl.innerHTML = '<div style="color:var(--dim);font-size:13px;margin:12px 0 6px;">還沒有結算，每天 06:00 結算</div>';
      return;
    }
    const last = p2State.ledger[p2State.ledger.length - 1];
    const net = (last.income.rail + last.income.bus + last.income.facility) - last.cost;
    const netSign = net >= 0 ? '+' : '−';
    const netColor = net < 0 ? '#ff6b6b' : 'inherit';
    yEl.innerHTML = `
      <div class="opt-label" style="font-weight:700;margin-top:12px;">昨日（第 ${last.day} 天）</div>
      <div class="fleet-card" style="margin-bottom:0;padding:8px 10px;line-height:1.6;">
        <div style="display:flex;justify-content:space-between;font-size:13px;"><span>火車</span><span>+${formatMan(last.income.rail)} 萬</span></div>
        <div style="display:flex;justify-content:space-between;font-size:13px;"><span>公車</span><span>+${formatMan(last.income.bus)} 萬</span></div>
        <div style="display:flex;justify-content:space-between;font-size:13px;"><span>設施</span><span>+${formatMan(last.income.facility)} 萬</span></div>
        <div style="display:flex;justify-content:space-between;font-size:13px;"><span>營運費</span><span>−${formatMan(last.cost)} 萬</span></div>
        <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:700;margin-top:4px;padding-top:4px;border-top:1px solid var(--line);color:${netColor};"><span>淨額</span><span>${netSign}${formatMan(net)} 萬</span></div>
      </div>
    `;
  }

  function svgEl(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
  }

  // Balance after each of the last 7 settlements, scaled between their min and max.
  function renderTownChart() {
    const wrap = $('ops-town-chart');
    const balances = p2State.ledger.map(e => e.balance);
    if (balances.length === 0) return wrap.replaceChildren();
    const W = 240, H = 90, PAD = 24;
    const minVal = Math.min(...balances);
    const maxVal = Math.max(...balances);
    const label = v => `${v < 0 ? '−' : ''}${formatMan(v)}萬`;
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, class: 'ops-chart' });
    svg.append(
      svgEl('text', { x: 8, y: 15, fill: 'var(--dim)', 'font-size': 10 }),
      svgEl('text', { x: 8, y: 82, fill: 'var(--dim)', 'font-size': 10 }),
    );
    svg.children[0].textContent = label(maxVal);
    svg.children[1].textContent = label(minVal);
    const points = balances.map((b, i) => [
      balances.length === 1 ? W / 2 : PAD + i / (balances.length - 1) * (W - 2 * PAD),
      maxVal === minVal ? H / 2 : PAD + (maxVal - b) / (maxVal - minVal) * (H - 2 * PAD),
    ]);
    if (points.length > 1) {
      svg.append(svgEl('polyline', { points: points.map(p => p.join(',')).join(' '), fill: 'none',
        stroke: 'var(--accent)', 'stroke-width': 2, 'stroke-linejoin': 'round' }));
    }
    for (const [cx, cy] of points) svg.append(svgEl('circle', { cx, cy, r: 3, fill: 'var(--accent)' }));
    wrap.replaceChildren(svg);
  }

  function renderTownTab() {
    $('ops-town-pop').textContent = population();
    $('ops-town-homes').textContent = homeCount();
    $('ops-town-shops').textContent = shopCount();
    renderTownYesterday();
    renderTownChart();
    growthOnBox.checked = p2State.growth.on;
    $('ops-growth-speeds').replaceChildren(...Object.entries(GROWTH_SPEED_LABELS).map(([key, label]) =>
      chip(label, p2State.growth.speed === key, () => {
        p2State.growth.speed = key;
        saveLayout();
        renderTownTab();
      })));
  }

  refreshTownTab = function() {
    if (!opsPanel.hidden && currentOpsTab === 'town') {
      renderTownTab();
    }
  };

  function renderBusList() {
    const listEl = $('ops-bus-list');
    if (!listEl) return;
    listEl.textContent = '';

    p2State.buses.forEach((bData, i) => {
      const card = document.createElement('div');
      card.className = 'fleet-card';

      const head = document.createElement('div');
      head.className = 'fleet-card-head';

      const title = document.createElement('span');
      title.style.fontWeight = '700';
      title.textContent = `公車 ${i + 1}`;
      head.appendChild(title);

      const sellBtn = document.createElement('button');
      sellBtn.className = 'fleet-sell-btn';
      sellBtn.textContent = '出售';
      sellBtn.title = `出售這輛公車（退回 ${BUS_PRICE / 2} 萬）`;
      sellBtn.addEventListener('click', () => {
        if (!confirm(`確定要出售「公車 ${i + 1}」？`)) return;
        applyMoney(BUS_PRICE / 2);
        const b = stationBuses[i];
        if (b) {
          if (b.onRoad) b.leave();
          scene.remove(b.obj);
          const vIdx = vehicles.indexOf(b);
          if (vIdx >= 0) vehicles.splice(vIdx, 1);
        }
        stationBuses.splice(i, 1);
        p2State.buses.splice(i, 1);
        if (stationBuses.length > 0) {
          busRoundRobinIndex %= stationBuses.length;
          nextBusSlotMinute = findNextBusSlot(clockMinutes, stationBuses.length);
        } else {
          busRoundRobinIndex = 0;
          nextBusSlotMinute = Infinity;
        }
        saveLayout();
        renderOpsPanel();
      });
      head.appendChild(sellBtn);
      card.appendChild(head);

      const info = document.createElement('div');
      info.className = 'fleet-card-info';
      info.style.alignItems = 'center';

      const chipsWrap = document.createElement('div');
      chipsWrap.className = 'chips';
      for (const [cKey, hex] of Object.entries(BUS_COLORS)) {
        const cBtn = chip(BUS_COLOR_LABELS[cKey], bData.color === cKey, () => {
          bData.color = cKey;
          stationBuses[i].paintMat.color.setHex(hex);
          saveLayout();
          renderBusList();
        });
        cBtn.style.padding = '3px 8px';
        cBtn.style.fontSize = '12px';
        chipsWrap.appendChild(cBtn);
      }
      info.appendChild(chipsWrap);
      card.appendChild(info);
      listEl.appendChild(card);
    });
  }

  function renderBusBuyButton() {
    const buyBox = $('ops-bus-buy');
    if (!buyBox) return;
    buyBox.textContent = '';

    const buyBtn = document.createElement('button');
    if (p2State.buses.length >= BUS_MAX) {
      buyBtn.disabled = true;
      buyBtn.textContent = '+ 購買公車';
      buyBtn.title = `已達公車數量上限（${BUS_MAX} 台）`;
    } else {
      buyBtn.disabled = false;
      buyBtn.textContent = `+ 購買公車（${BUS_PRICE} 萬）`;
      buyBtn.title = `購買新公車（${BUS_PRICE} 萬）`;
      buyBtn.addEventListener('click', () => {
        if (p2State.buses.length >= BUS_MAX) return;
        if (!spend(BUS_PRICE)) return;
        const newBusData = { color: 'green' };
        p2State.buses.push(newBusData);
        const bus = new Bus(makeBus(busWheel, busHeadMat, busTailMat, newBusData.color));
        stationBuses.push(bus);
        vehicles.push(bus);
        nextBusSlotMinute = findNextBusSlot(clockMinutes, stationBuses.length);
        saveLayout();
        renderOpsPanel();
      });
    }
    buyBox.appendChild(buyBtn);
  }

  let dragSource = null;

  function commitTimetable(next) {
    p2State.timetable = next;
    if (rail) rail.setTimetable(p2State.timetable);
    saveLayout();
    renderTimetable();
  }

  function clearDropClasses() {
    const list = document.querySelectorAll('.tt-cell.drop-ok, .tt-cell.drop-bad');
    for (const el of list) {
      el.classList.remove('drop-ok', 'drop-bad');
    }
  }

  function checkCanDrop(targetHour, targetDir) {
    const base = p2State.timetable.filter(t => {
      if (t.hour === targetHour && t.dir === targetDir) return false;
      if (dragSource.type === 'cell' && t.hour === dragSource.sourceHour && t.dir === dragSource.sourceDir) return false;
      return true;
    });
    const check = canAssignTrain(p2State.fleet, base, targetHour, targetDir, dragSource.trainId, dragSource.stop);
    return { ...check, base };
  }

  function handleDrop(targetHour, targetDir) {
    if (!dragSource) return;
    if (dragSource.type === 'cell' && dragSource.sourceHour === targetHour && dragSource.sourceDir === targetDir) {
      return;
    }
    const check = checkCanDrop(targetHour, targetDir);
    if (!check.valid) {
      showToast(`無法排班：${check.reason}`);
      return;
    }
    commitTimetable([...check.base, {
      train: dragSource.trainId,
      dir: targetDir,
      hour: targetHour,
      stop: dragSource.stop,
    }]);
  }

  function renderFleetList() {
    const listEl = $('ops-fleet-list');
    if (!listEl) return;
    listEl.innerHTML = '';
    const snap = rail ? rail.snapshot() : null;
    const snapFleet = snap?.fleet || [];

    for (const train of p2State.fleet) {
      const card = document.createElement('div');
      card.className = 'fleet-card';
      card.draggable = true;
      card.title = '拖到班表格子排班';
      card.addEventListener('dragstart', e => {
        dragSource = {
          type: 'card',
          trainId: train.id,
          stop: true,
        };
        card.classList.add('dragging');
        e.dataTransfer.setData('text/plain', train.id);
        e.dataTransfer.effectAllowed = 'copyMove';
      });
      card.addEventListener('dragend', () => {
        dragSource = null;
        card.classList.remove('dragging');
        clearDropClasses();
      });

      const head = document.createElement('div');
      head.className = 'fleet-card-head';

      const grip = document.createElement('span');
      grip.className = 'fleet-grip';
      grip.textContent = '⠿';
      grip.title = '拖到班表格子排班';
      head.appendChild(grip);

      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.maxLength = 12;
      nameInput.value = train.name;
      nameInput.draggable = false;
      nameInput.title = '點擊修改車名';
      nameInput.addEventListener('keydown', e => e.stopPropagation());
      nameInput.addEventListener('change', () => {
        const val = nameInput.value.trim();
        if (val) {
          train.name = val;
          if (rail) rail.renameTrain(train.id, val);
          saveLayout();
          renderTimetable();
        } else {
          nameInput.value = train.name;
        }
      });
      head.appendChild(nameInput);

      const snapInfo = snapFleet.find(f => f.id === train.id);
      const isBusy = snapInfo && (snapInfo.run !== null || snapInfo.isWaiting);

      const sellBtn = document.createElement('button');
      sellBtn.className = 'fleet-sell-btn';
      sellBtn.textContent = '出售';
      sellBtn.disabled = !!isBusy;
      sellBtn.title = isBusy ? '行駛中或等待中的列車不可出售' : '出售這輛列車（清除其所有班次）';
      sellBtn.addEventListener('click', () => {
        const liveSnap = rail ? rail.snapshot() : null;
        const liveInfo = liveSnap?.fleet?.find(f => f.id === train.id);
        if (liveInfo && (liveInfo.run !== null || liveInfo.isWaiting)) {
          alert('行駛中或等待中的列車不可出售');
          return;
        }
        if (!confirm(`確定要出售「${train.name}」？已排班次將一併清除。`)) return;
        applyMoney(TRAIN_TYPES[train.type].price / 2);
        p2State.fleet = p2State.fleet.filter(t => t.id !== train.id);
        p2State.timetable = p2State.timetable.filter(t => t.train !== train.id);
        if (rail) {
          rail.removeTrain(train.id);
          rail.setTimetable(p2State.timetable);
        }
        saveLayout();
        renderOpsPanel();
      });
      head.appendChild(sellBtn);
      card.appendChild(head);

      const info = document.createElement('div');
      info.className = 'fleet-card-info';

      const typeSpan = document.createElement('span');
      const tdef = isValidTrainType(train?.type) ? TRAIN_TYPES[train.type] : TRAIN_TYPES.local;
      typeSpan.textContent = `${tdef.name} · 速 ${tdef.speed}× · 限 ${tdef.seats}人`;
      info.appendChild(typeSpan);

      const statusSpan = document.createElement('span');
      statusSpan.className = 'fleet-status';
      if (snapInfo) {
        if (snapInfo.isWaiting) {
          statusSpan.textContent = `等待進入軌道（${snapInfo.run ? snapInfo.run.hour + ':00' : ''}）`;
          statusSpan.style.color = '#ff9999';
        } else if (snapInfo.run) {
          statusSpan.textContent = `行駛中（${snapInfo.run.hour}:00 往${snapInfo.run.dir === 'east' ? '東' : '西'}）`;
          statusSpan.style.color = '#ffd27a';
        } else {
          statusSpan.textContent = `待命（${snapInfo.at === 'west' ? '西端' : '東端'}）`;
        }
      } else {
        statusSpan.textContent = '待命中';
      }
      info.appendChild(statusSpan);
      card.appendChild(info);
      listEl.appendChild(card);
    }
  }

  updateFleetLiveStatus = function() {
    if (!opsPanel || opsPanel.hidden) return;
    const snap = rail ? rail.snapshot() : null;
    const snapFleet = snap?.fleet || [];
    const listEl = $('ops-fleet-list');
    if (!listEl) return;
    const cards = listEl.children;
    for (let i = 0; i < p2State.fleet.length; i++) {
      const train = p2State.fleet[i];
      const card = cards[i];
      if (!card) continue;
      const snapInfo = snapFleet.find(f => f.id === train.id);
      const isBusy = snapInfo && (snapInfo.run !== null || snapInfo.isWaiting);
      const sellBtn = card.querySelector('.fleet-sell-btn');
      if (sellBtn) {
        sellBtn.disabled = !!isBusy;
        sellBtn.title = isBusy ? '行駛中或等待中的列車不可出售' : '出售這輛列車（清除其所有班次）';
      }
      const statusSpan = card.querySelector('.fleet-status');
      if (statusSpan && snapInfo) {
        if (snapInfo.isWaiting) {
          statusSpan.textContent = `等待進入軌道（${snapInfo.run ? snapInfo.run.hour + ':00' : ''}）`;
          statusSpan.style.color = '#ff9999';
        } else if (snapInfo.run) {
          statusSpan.textContent = `行駛中（${snapInfo.run.hour}:00 往${snapInfo.run.dir === 'east' ? '東' : '西'}）`;
          statusSpan.style.color = '#ffd27a';
        } else {
          statusSpan.textContent = `待命（${snapInfo.at === 'west' ? '西端' : '東端'}）`;
          statusSpan.style.color = '';
        }
      }
    }
  };

  function renderBuyButtons() {
    const buyBox = $('ops-buy-buttons');
    if (!buyBox) return;
    buyBox.textContent = '';
    for (const [typeKey, tdef] of Object.entries(TRAIN_TYPES)) {
      const row = document.createElement('button');
      row.className = 'ops-buy-row';
      row.type = 'button';

      const img = document.createElement('img');
      img.className = 'ops-buy-thumb';
      img.src = `assets/train-kit/Previews/${tdef.units[0]}.png`;
      img.alt = '';
      row.appendChild(img);

      const info = document.createElement('div');
      info.className = 'ops-buy-info';

      const nameEl = document.createElement('div');
      nameEl.className = 'ops-buy-name';
      nameEl.textContent = tdef.name;
      info.appendChild(nameEl);

      const subEl = document.createElement('div');
      subEl.className = 'ops-buy-sub';
      const tourismText = tdef.tourism ? ` · 觀光 ×${tdef.tourism}` : '';
      subEl.textContent = `速 ${tdef.speed}× · 限 ${tdef.seats} 人 · ${tdef.price.toLocaleString('en-US')} 萬${tourismText}`;
      info.appendChild(subEl);

      row.appendChild(info);

      const action = document.createElement('span');
      action.className = 'ops-buy-action';
      action.textContent = '＋購買';
      row.appendChild(action);

      row.addEventListener('click', async () => {
        if (!spend(tdef.price)) return;
        const count = p2State.fleet.filter(t => t.type === typeKey).length + 1;
        const newTrain = {
          id: 't_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          name: `${tdef.name} ${count} 號`,
          type: typeKey,
        };
        p2State.fleet.push(newTrain);
        if (rail) await rail.addTrain(newTrain);
        saveLayout();
        renderOpsPanel();
      });
      buyBox.appendChild(row);
    }
  }

  function renderTimetable() {
    const wrap = $('ops-timetable');
    if (!wrap) return;
    wrap.innerHTML = '';

    const validation = validateTimetable(p2State.fleet, p2State.timetable);
    const table = document.createElement('table');
    table.className = 'tt-table';

    const thead = document.createElement('thead');
    thead.innerHTML = '<tr><th style="width:55px;">時間</th><th>往東（南線）</th><th>往西（北線）</th></tr>';
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const fleetMap = new Map(p2State.fleet.map(t => [t.id, t]));

    for (let h = 0; h < 24; h++) {
      const tr = document.createElement('tr');

      const th = document.createElement('th');
      th.textContent = `${h < 10 ? '0' : ''}${h}:00`;
      tr.appendChild(th);

      for (const dir of ['east', 'west']) {
        const td = document.createElement('td');
        const cell = document.createElement('div');
        cell.className = 'tt-cell';
        cell.dataset.hour = h;
        cell.dataset.dir = dir;

        const tripKey = `${h}_${dir}`;
        const trip = p2State.timetable.find(t => t.hour === h && t.dir === dir);
        const err = validation.errors.get(tripKey);

        if (trip) {
          const train = fleetMap.get(trip.train);
          const trainName = train ? train.name : '未知列車';
          cell.textContent = `${trainName} · ${trip.stop ? '停' : '過'}`;
          cell.classList.add('assigned');
          cell.draggable = true;
          if (err) {
            cell.classList.add('error');
            cell.title = `⚠️ ${err}`;
          } else {
            cell.title = `${trainName}（${trip.stop ? '停靠晴川站' : '通過不停'}）`;
          }
          cell.addEventListener('dragstart', e => {
            dragSource = {
              type: 'cell',
              trainId: trip.train,
              stop: trip.stop,
              sourceHour: h,
              sourceDir: dir,
            };
            cell.classList.add('dragging');
            e.dataTransfer.setData('text/plain', trip.train);
            e.dataTransfer.effectAllowed = 'move';
          });
          cell.addEventListener('dragend', () => {
            dragSource = null;
            cell.classList.remove('dragging');
            clearDropClasses();
          });
        } else {
          cell.textContent = '—';
          cell.title = '點擊排定班次';
        }

        cell.addEventListener('dragover', e => {
          if (!dragSource) return;
          e.preventDefault();
          const check = checkCanDrop(h, dir);
          cell.classList.toggle('drop-ok', check.valid);
          cell.classList.toggle('drop-bad', !check.valid);
        });
        cell.addEventListener('dragleave', () => {
          cell.classList.remove('drop-ok', 'drop-bad');
        });
        cell.addEventListener('drop', e => {
          if (!dragSource) return;
          e.preventDefault();
          cell.classList.remove('drop-ok', 'drop-bad');
          handleDrop(h, dir);
        });

        cell.addEventListener('click', () => openCellModal(h, dir));
        td.appendChild(cell);
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    wrap.appendChild(table);
  }

  let modalHour = 0;
  let modalDir = 'east';
  let modalSelectedTrain = null;
  let modalStop = true;

  function timetableWithoutModalCell() {
    return p2State.timetable.filter(t => !(t.hour === modalHour && t.dir === modalDir));
  }

  function openCellModal(hour, dir) {
    modalHour = hour;
    modalDir = dir;
    const modal = $('ops-cell-modal');
    if (!modal) return;

    $('ops-modal-title').textContent = `設定 ${hour < 10 ? '0' : ''}${hour}:00 往${dir === 'east' ? '東' : '西'} 班次`;

    const existing = p2State.timetable.find(t => t.hour === hour && t.dir === dir);
    modalStop = existing ? !!existing.stop : true;
    modalSelectedTrain = existing ? existing.train : (p2State.fleet[0]?.id || null);

    updateModalStopUI();
    renderModalTrains();
    modal.hidden = false;
  }

  function updateModalStopUI() {
    $('ops-modal-stop-true').classList.toggle('on', modalStop);
    $('ops-modal-stop-false').classList.toggle('on', !modalStop);
  }

  $('ops-modal-stop-true')?.addEventListener('click', () => {
    modalStop = true;
    updateModalStopUI();
    renderModalTrains();
  });
  $('ops-modal-stop-false')?.addEventListener('click', () => {
    modalStop = false;
    updateModalStopUI();
    renderModalTrains();
  });

  function renderModalTrains() {
    const container = $('ops-modal-trains');
    if (!container) return;
    container.innerHTML = '';

    if (!p2State.fleet.length) {
      container.innerHTML = '<span style="color:var(--dim);font-size:13px;">目前車隊無列車，請先購買車輛。</span>';
      return;
    }

    const timetable = timetableWithoutModalCell();
    for (const train of p2State.fleet) {
      const btn = document.createElement('button');
      btn.style.textAlign = 'left';
      btn.style.padding = '8px 12px';

      const check = canAssignTrain(p2State.fleet, timetable, modalHour, modalDir, train.id, modalStop);
      const isCurrentSelected = modalSelectedTrain === train.id;

      if (isCurrentSelected) btn.classList.add('on');

      const nameSpan = document.createElement('div');
      nameSpan.style.fontWeight = '700';
      nameSpan.textContent = train.name;
      btn.appendChild(nameSpan);

      const descSpan = document.createElement('div');
      descSpan.style.fontSize = '12px';
      const tdef = isValidTrainType(train?.type) ? TRAIN_TYPES[train.type] : TRAIN_TYPES.local;

      if (!check.valid) {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        descSpan.textContent = `不可選：${check.reason}`;
        descSpan.style.color = '#ff9999';
      } else {
        descSpan.textContent = `${tdef.name} · 可排班`;
        descSpan.style.color = 'var(--dim)';
        btn.addEventListener('click', () => {
          modalSelectedTrain = train.id;
          renderModalTrains();
        });
      }
      btn.appendChild(descSpan);
      container.appendChild(btn);
    }
  }

  $('ops-modal-close')?.addEventListener('click', () => {
    $('ops-cell-modal').hidden = true;
  });

  $('ops-modal-clear')?.addEventListener('click', () => {
    commitTimetable(p2State.timetable.filter(t => !(t.hour === modalHour && t.dir === modalDir)));
    $('ops-cell-modal').hidden = true;
  });

  $('ops-modal-confirm')?.addEventListener('click', () => {
    if (!modalSelectedTrain) {
      $('ops-cell-modal').hidden = true;
      return;
    }
    const remaining = timetableWithoutModalCell();
    const check = canAssignTrain(p2State.fleet, remaining, modalHour, modalDir, modalSelectedTrain, modalStop);
    if (!check.valid) {
      alert(`無法指派此列車：${check.reason}`);
      return;
    }
    remaining.push({
      train: modalSelectedTrain,
      dir: modalDir,
      hour: modalHour,
      stop: modalStop,
    });
    commitTimetable(remaining);
    $('ops-cell-modal').hidden = true;
  });
}

await addWardrobe();
setupOpsPanel();
const music = createMusicPlayer();
$('loading').classList.add('done');
frame();
