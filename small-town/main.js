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
camera.position.set(6.5, 5.5, 8.5);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.3, -0.8);
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

  // Across the street: a strip of park with trees and planters.
  for (let i = 0; i < 26; i++) {
    const x = -9 + rand() * 18;
    const z = 1.8 + rand() * 5;
    jobs.push(place('suburban', rand() < 0.5 ? 'tree-large' : 'tree-small', { x, z, rot: rand() * 6, scale: 1 + rand() * 0.5, mat: houseMat }));
  }
  for (const x of [-3, -1, 1, 3]) jobs.push(place('suburban', 'planter', { x, z: 1.45, mat: houseMat }));

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

class Walker {
  constructor(gltf, rank) {
    this.obj = SkeletonUtils.clone(gltf.scene);
    this.obj.scale.setScalar(PERSON_SCALE);
    this.obj.traverse(o => { if (o.isMesh) o.castShadow = true; });
    this.mixer = new THREE.AnimationMixer(this.obj);
    this.walk = this.mixer.clipAction(THREE.AnimationClip.findByName(gltf.animations, 'walk'));
    this.idle = this.mixer.clipAction(THREE.AnimationClip.findByName(gltf.animations, 'idle'));
    this.walk.play();
    this.walk.time = rand() * this.walk.getClip().duration;
    this.rank = rank;
    this.speed = 0.32 + rand() * 0.12;
    this.walk.timeScale = this.speed / 0.38;
    this.pause = 0;
    this.spawn(-STREET_HALF + rand() * STREET_HALF * 2);
    scene.add(this.obj);
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

  face(angle) { this.obj.rotation.y = angle; }

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

async function addPeople() {
  const gltfs = await Promise.all(PEOPLE.map(n => model('mini-characters', n)));
  for (let i = 0; i < WALKERS; i++) {
    const w = new Walker(gltfs[i % gltfs.length], i / WALKERS);
    w.obj.visible = w.rank < activity(time);
    walkers.push(w);
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
addEventListener('keydown', e => {
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
