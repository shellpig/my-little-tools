import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { validateSpec } from './schema/validate.js';
import { createVehicle, VEHICLE_DEFAULTS } from './generators/vehicle.js';

const $ = id => document.getElementById(id);
const style = await (await fetch('styles/small-town.json')).json();

// ----- 3D preview -----
const view = $('view');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
view.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2b2e38);
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI * 0.495;

scene.add(new THREE.HemisphereLight(0xffffff, 0x555a6a, 1.5));
const sun = new THREE.DirectionalLight(0xffffff, 2.2);
sun.position.set(4, 7, 5);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 20 });
scene.add(sun);
const ground = new THREE.Mesh(new THREE.CircleGeometry(14, 48).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x3a3e4b, roughness: 1 }));
ground.receiveShadow = true;
ground.position.y = -0.001;
scene.add(ground);

function resize() {
  const w = view.clientWidth;
  const h = view.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / Math.max(h, 1);
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(view);
resize();
renderer.setAnimationLoop(() => { controls.update(); renderer.render(scene, camera); });

function frame(report) {
  const { length, height } = report.dimensions;
  const d = Math.max(length * 1.5, 4);
  camera.position.set(d * 0.85, height + d * 0.35, d * 0.75);
  controls.target.set(0, height * 0.4, 0);
  controls.update();
}

// ----- form <-> spec -----
const NUM_FIELDS = ['lengthToWidth', 'heightToWidth', 'hoodRatio', 'cabinRatio', 'rearRatio'];
const featureBoxes = [...document.querySelectorAll('#features input')];

function specFromForm() {
  const num = id => Number($(id).value);
  const spec = {
    category: 'vehicle',
    bodyType: $('bodyType').value,
    proportions: Object.fromEntries(NUM_FIELDS.map(k => [k, num(k)])),
    colors: {
      body: $('colorBody').value,
      secondary: $('secOn').checked ? $('colorSecondary').value : null,
      roof: $('roofOn').checked ? $('colorRoof').value : null
    },
    wheels: { axles: num('axles'), sizeClass: $('sizeClass').value },
    windows: { sidePanels: num('sidePanels'), rear: $('rearWindow').checked },
    features: featureBoxes.filter(b => b.checked).map(b => b.value)
  };
  const name = $('name').value.trim();
  if (name) spec.name = name;
  const unsupported = $('unsupported').value.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
    const [feature, ...rest] = l.split(/[｜|]/);
    return { feature: feature.trim(), note: rest.join('|').trim() || '沒有對應零件' };
  });
  if (unsupported.length) spec.unsupported = unsupported;
  return spec;
}

function fillDefaults(bodyType) {
  const d = VEHICLE_DEFAULTS[bodyType];
  for (const k of NUM_FIELDS) $(k).value = d.proportions[k];
  $('axles').value = d.wheels.axles;
  $('sizeClass').value = d.wheels.sizeClass;
  $('sidePanels').value = d.windows.sidePanels;
  $('rearWindow').checked = d.windows.rear;
}

function fillForm(spec) {
  $('bodyType').value = spec.bodyType;
  fillDefaults(spec.bodyType);
  $('name').value = spec.name || '';
  for (const [k, v] of Object.entries(spec.proportions || {})) $(k).value = v;
  $('colorBody').value = spec.colors.body.toLowerCase();
  for (const [key, on, input] of [['secondary', 'secOn', 'colorSecondary'], ['roof', 'roofOn', 'colorRoof']]) {
    const v = spec.colors[key];
    $(on).checked = !!v;
    if (v) $(input).value = v.toLowerCase();
  }
  if (spec.wheels?.axles) $('axles').value = spec.wheels.axles;
  if (spec.wheels?.sizeClass) $('sizeClass').value = spec.wheels.sizeClass;
  if (spec.windows?.sidePanels) $('sidePanels').value = spec.windows.sidePanels;
  if (spec.windows?.rear !== undefined) $('rearWindow').checked = spec.windows.rear;
  for (const b of featureBoxes) b.checked = (spec.features || []).includes(b.value);
  $('unsupported').value = (spec.unsupported || []).map(u => `${u.feature}｜${u.note || ''}`).join('\n');
}

// ----- generate -----
let current = null; // { spec, group, report }
let lastType = null;

function esc(s) {
  return String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

function showReport(report) {
  const list = (items, fmt) => items.length ? `<ul>${items.map(i => `<li>${fmt(i)}</li>`).join('')}</ul>` : '<div class="none">（無）</div>';
  const d = report.dimensions;
  $('report').innerHTML = `
    <h2>報告</h2>
    <div class="dims">尺寸 ${d.width} × ${d.height} × ${d.length}　三角形 ${report.triangles}</div>
    <h3>已套用</h3>${list(report.applied, esc)}
    <h3>近似</h3>${list(report.approximated, a => `<b>${esc(a.feature)}</b>：${esc(a.note)}`)}
    <h3>略過</h3>${list(report.skipped, s => `<b>${esc(s.feature)}</b>：${esc(s.note)}`)}
    <h3>顏色</h3>${list(Object.entries(report.colors), ([k, v]) => `${esc(k)}：${v.requested} → ${v.used}`)}`;
}

function setErrors(errors) {
  $('errors').textContent = errors.length ? errors.map(e => `• ${e}`).join('\n') : '';
}

function generate(spec, { syncPaste = true } = {}) {
  const v = validateSpec(spec);
  setErrors(v.errors);
  if (!v.ok) return false;
  const { group, report } = createVehicle(spec, style);
  if (current) scene.remove(current.group);
  scene.add(group);
  current = { spec, group, report };
  showReport(report);
  if (syncPaste) $('paste').value = JSON.stringify(spec, null, 2);
  if (lastType !== spec.bodyType) { frame(report); lastType = spec.bodyType; }
  return true;
}

function fromForm() { generate(specFromForm()); }

for (const el of document.querySelectorAll('aside input, aside select, aside textarea')) {
  if (el.id === 'bodyType') continue;
  el.addEventListener('input', fromForm);
}
$('bodyType').addEventListener('change', () => { fillDefaults($('bodyType').value); fromForm(); });

$('apply').addEventListener('click', () => {
  let spec;
  try {
    spec = JSON.parse($('paste').value);
  } catch (e) {
    setErrors([`不是合法的 JSON：${e.message}`]);
    return;
  }
  const v = validateSpec(spec);
  setErrors(v.errors);
  if (!v.ok) return;
  fillForm(spec);
  generate(spec);
  $('msg').textContent = '已套用。';
});

// ----- downloads / prompt -----
function save(blob, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
const fileBase = () => (current.spec.name || current.spec.bodyType).replace(/[\\/:*?"<>|\s]+/g, '-');

$('dlSpec').addEventListener('click', () => {
  if (!current) return;
  save(new Blob([JSON.stringify(current.spec, null, 2)], { type: 'application/json' }), `${fileBase()}.spec.json`);
});

$('dlGlb').addEventListener('click', async () => {
  if (!current) return;
  const g = current.group;
  const saved = g.userData;
  g.userData = {}; // functions and materials must not leak into glTF extras
  try {
    const glb = await new GLTFExporter().parseAsync(g, { binary: true });
    save(new Blob([glb], { type: 'model/gltf-binary' }), `${fileBase()}.glb`);
  } catch (e) {
    $('msg').textContent = `匯出失敗：${e.message}`;
  } finally {
    g.userData = saved;
  }
});

$('copyPrompt').addEventListener('click', async () => {
  try {
    const text = await (await fetch('prompts/vehicle.md')).text();
    await navigator.clipboard.writeText(text);
    $('msg').textContent = '提示詞已複製。把它和圖片一起貼給視覺模型，再把回傳的 JSON 貼回來。';
  } catch (e) {
    $('msg').textContent = `複製失敗：${e.message}`;
  }
});

// ----- start -----
fillDefaults('sedan');
$('colorBody').value = '#c0392b';
fromForm();
