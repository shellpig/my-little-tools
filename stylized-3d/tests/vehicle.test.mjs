import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { validateSpec, BODY_TYPES, FEATURES } from '../schema/validate.js';
import { createVehicle } from '../generators/vehicle.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const style = JSON.parse(fs.readFileSync(path.join(root, 'styles', 'small-town.json'), 'utf8'));
const exampleDir = path.join(root, 'examples');
const examples = fs.readdirSync(exampleDir).filter(f => f.endsWith('.json')).map(f => ({
  file: f,
  spec: JSON.parse(fs.readFileSync(path.join(exampleDir, f), 'utf8'))
}));

const hexOf = m => `#${m.color.getHexString()}`;
const materialsOf = group => {
  const set = new Set();
  group.traverse(o => { if (o.isMesh) set.add(o.material); });
  return [...set];
};

test('examples cover all seven body types', () => {
  const types = new Set(examples.map(e => e.spec.bodyType));
  for (const t of BODY_TYPES) assert.ok(types.has(t), `missing example for ${t}`);
});

test('1. every example validates and generates', () => {
  for (const { file, spec } of examples) {
    const v = validateSpec(spec);
    assert.ok(v.ok, `${file}: ${v.errors.join('; ')}`);
    const { group, report } = createVehicle(spec, style);
    assert.ok(group.isGroup, file);
    assert.ok(report.triangles > 0, file);
  }
});

test('2. size within envelope, triangles within budget, colours within palette', () => {
  const env = style.envelope;
  const allowed = new Set([...style.palette.body, style.palette.window, style.palette.skirt,
    style.palette.tire, style.palette.hub, style.palette.headlight, style.palette.taillight]);
  for (const { file, spec } of examples) {
    const { group, report } = createVehicle(spec, style);
    const bus = spec.bodyType === 'bus';
    const d = report.dimensions;
    const [l0, l1] = bus ? env.busLength : env.length;
    const [h0, h1] = bus ? env.busHeight : env.height;
    const w = bus ? env.busWidth : env.width;
    assert.ok(Math.abs(d.width - w) < 0.01, `${file} width ${d.width}`);
    assert.ok(d.length >= l0 - 0.01 && d.length <= l1 + 0.01, `${file} length ${d.length}`);
    assert.ok(d.height >= h0 - 0.01 && d.height <= h1 + 0.01, `${file} height ${d.height}`);
    assert.ok(report.triangles <= style.detail.maxTriangles, `${file} triangles ${report.triangles}`);
    for (const m of materialsOf(group)) assert.ok(allowed.has(hexOf(m)), `${file}: ${hexOf(m)} not in palette`);
  }
});

test('2b. same-colour meshes share one material (lamps excepted)', () => {
  for (const { file, spec } of examples) {
    const { group } = createVehicle(spec, style);
    const lamps = new Set([group.userData.headlightMaterial, group.userData.taillightMaterial]);
    const seen = new Map();
    for (const m of materialsOf(group)) {
      if (lamps.has(m)) continue;
      const key = `${hexOf(m)}|${m.side}|${m.vertexColors}`;
      assert.ok(!seen.has(key), `${file}: duplicate material for ${key}`);
      seen.set(key, m);
    }
  }
});

test('3. node names follow Kenney and wheels touch the ground', () => {
  for (const axles of [2, 3]) {
    for (const { file, spec } of examples) {
      const s = { ...spec, wheels: { ...spec.wheels, axles } };
      const { group } = createVehicle(s, style);
      const names = group.children.map(c => c.name).sort();
      const expected = ['body', 'wheel-front-left', 'wheel-front-right', 'wheel-back-left', 'wheel-back-right'];
      if (axles === 3) expected.push('wheel-mid-left', 'wheel-mid-right');
      assert.deepEqual(names, expected.sort(), file);
      assert.equal(group.children.filter(c => c.name === 'body').length, 1);
      const box = new THREE.Box3().setFromObject(group);
      assert.ok(Math.abs(box.min.y) < 1e-3, `${file} min.y ${box.min.y}`);
      const fl = group.getObjectByName('wheel-front-left');
      assert.ok(fl.position.x > 0 && fl.position.y > 0.29);
      group.traverse(o => { if (o.isMesh) for (const v of o.geometry.attributes.position.array) assert.ok(Number.isFinite(v), file + ' NaN vertex'); });
    }
  }
});

test('userData interface', () => {
  const { group } = createVehicle(examples[0].spec, style);
  assert.equal(typeof group.userData.rollWheels, 'function');
  assert.ok(group.userData.headlightMaterial.isMaterial);
  assert.ok(group.userData.taillightMaterial.isMaterial);
  group.userData.rollWheels(1);
  assert.ok(group.getObjectByName('wheel-front-left').rotation.x !== 0);
});

test('body types differ in silhouette', () => {
  const sizes = {};
  for (const { spec } of examples) {
    if (sizes[spec.bodyType]) continue;
    const { report } = createVehicle(spec, style);
    sizes[spec.bodyType] = report.dimensions;
  }
  const keys = Object.keys(sizes).map(k => `${sizes[k].length}x${sizes[k].height}`);
  assert.equal(new Set(keys).size, keys.length, JSON.stringify(sizes));
  assert.ok(sizes.bus.length > sizes.sedan.length * 1.7);
});

test('4. bad specs are rejected', () => {
  const good = examples[0].spec;
  const bad = [
    { ...good, bodyType: 'tank' },
    { ...good, colors: { body: 'red' } },
    { ...good, colors: { body: '#c0392b', secondary: '#12345' } },
    { ...good, features: ['roof-rack', 'laser'] },
    { ...good, category: 'building' },
    { ...good, extra: 1 },
    { ...good, wheels: { axles: 4 } },
    { ...good, windows: { sidePanels: 9 } },
    { ...good, proportions: { lengthToWidth: 20 } },
    { ...good, proportions: { hoodRatio: 0.1, cabinRatio: 0.1, rearRatio: 0.1 } },
    { ...good, unsupported: [{ note: 'no feature' }] }
  ];
  for (const b of bad) {
    const v = validateSpec(b);
    assert.equal(v.ok, false, JSON.stringify(b));
    assert.ok(v.errors.length > 0);
  }
  const v = validateSpec({ ...good, bodyType: 'tank' });
  assert.match(v.errors[0], /bodyType/);
  assert.match(v.errors[0], /sedan/);
  assert.equal(validateSpec(good).ok, true);
});

test('schema enums match the validator', () => {
  const schema = JSON.parse(fs.readFileSync(path.join(root, 'schema', 'vehicle.schema.json'), 'utf8'));
  assert.deepEqual(schema.properties.bodyType.enum, BODY_TYPES);
  assert.deepEqual(schema.properties.features.items.enum, FEATURES);
});

test('5. unsupported items land in report.skipped', () => {
  const spec = examples.find(e => e.file === 'sedan.json').spec;
  assert.ok(spec.unsupported.length > 0);
  const { report } = createVehicle(spec, style);
  for (const u of spec.unsupported) {
    assert.ok(report.skipped.some(s => s.feature === u.feature && s.note === u.note), u.feature);
  }
  // inapplicable features are skipped, not fatal
  const r = createVehicle({ ...spec, features: ['cargo-box'] }, style).report;
  assert.ok(r.skipped.some(s => s.feature === 'cargo-box'));
});

test('feature handling and colour snapping', () => {
  const { report } = createVehicle({ category: 'vehicle', bodyType: 'suv', colors: { body: '#c0392b' }, features: ['roof-rack', 'roof-sign', 'spare-wheel', 'stripe'] }, style);
  assert.deepEqual(report.applied.sort(), ['roof-rack', 'roof-sign', 'spare-wheel', 'stripe']);
  assert.equal(report.colors.body.requested, '#c0392b');
  assert.ok(style.palette.body.includes(report.colors.body.used));
  assert.ok(report.approximated.some(a => a.feature === 'lengthToWidth'));
});

test('6. CLI GLB reloads with node names intact', async () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'stylized3d-'));
  try {
    for (const { file } of examples) {
      const r = spawnSync(process.execPath, [path.join(root, 'cli.mjs'), path.join(exampleDir, file), '--out', out], { encoding: 'utf8' });
      assert.equal(r.status, 0, `${file}: ${r.stderr}`);
      const base = file.replace(/\.json$/, '');
      const glb = fs.readFileSync(path.join(out, `${base}.glb`));
      const report = JSON.parse(fs.readFileSync(path.join(out, `${base}.report.json`), 'utf8'));
      assert.ok(report.triangles > 0);
      const ab = glb.buffer.slice(glb.byteOffset, glb.byteOffset + glb.byteLength);
      const gltf = await new GLTFLoader().parseAsync(ab, '');
      const names = new Set();
      const mats = new Set();
      gltf.scene.traverse(o => { names.add(o.name); if (o.isMesh) mats.add(o.material.name); });
      for (const n of ['body', 'wheel-front-left', 'wheel-front-right', 'wheel-back-left', 'wheel-back-right']) {
        assert.ok(names.has(n), `${file}: ${n} missing after reload`);
      }
      assert.ok(mats.has('headlight') && mats.has('taillight'), file + ': lamp material names lost');
    }
    const bad = path.join(out, 'bad.json');
    fs.writeFileSync(bad, JSON.stringify({ category: 'vehicle', bodyType: 'tank', colors: { body: '#fff' } }));
    const r = spawnSync(process.execPath, [path.join(root, 'cli.mjs'), bad, '--out', out], { encoding: 'utf8' });
    assert.equal(r.status, 1);
    assert.match(r.stderr, /bodyType/);
  } finally {
    fs.rmSync(out, { recursive: true, force: true });
  }
});

test('colour snapping keeps the hue', () => {
  const used = hex => createVehicle({ category: 'vehicle', bodyType: 'sedan', colors: { body: hex } }, style).report.colors.body.used;
  assert.ok(['#de433e', '#e74e3e'].includes(used('#c0392b')), used('#c0392b'));
  assert.ok(['#6895d9', '#4e6dcd'].includes(used('#2e6fd8')), used('#2e6fd8'));
  assert.ok(['#ffc044', '#ffc214'].includes(used('#f1c40f')), used('#f1c40f'));
  assert.ok(['#61cb8b', '#3da679', '#61c8af'].includes(used('#2ecc71')), used('#2ecc71'));
  assert.equal(used('#fafafa'), '#ffffff');
  assert.equal(used('#1a1a1a'), '#38383d');
});

function frontTop(group, fraction) {
  const box = new THREE.Box3().setFromObject(group.getObjectByName('body'));
  const zMin = box.max.z - fraction * (box.max.z - box.min.z);
  let top = -Infinity;
  group.getObjectByName('body').traverse(o => {
    if (!o.isMesh) return;
    const p = o.geometry.attributes.position;
    for (let i = 0; i < p.count; i++) if (p.getZ(i) >= zMin) top = Math.max(top, p.getY(i));
  });
  return top;
}

test('bus hoodRatio: long nose has a lower front section, 0 keeps the flat front', () => {
  const base = { category: 'vehicle', bodyType: 'bus', colors: { body: '#e0a526' } };
  const nose = createVehicle({ ...base, proportions: { hoodRatio: 0.15, cabinRatio: 0.85, rearRatio: 0 } }, style);
  const flat = createVehicle({ ...base, proportions: { hoodRatio: 0, cabinRatio: 0.9, rearRatio: 0.1 } }, style);
  assert.ok(frontTop(nose.group, 0.1) < 0.65 * nose.report.dimensions.height, 'long-nose front should be low');
  assert.ok(frontTop(flat.group, 0.1) > 0.9 * flat.report.dimensions.height, 'flat front should reach roof height');
  const [l0, l1] = style.envelope.busLength;
  assert.ok(nose.report.dimensions.length >= l0 - 0.01 && nose.report.dimensions.length <= l1 + 0.01);
  assert.ok(nose.report.approximated.some(a => a.feature === 'hoodRatio'));
  // the shipped flat-front example is unchanged in that respect
  const ex = createVehicle(examples.find(e => e.file === 'bus.json').spec, style);
  assert.ok(frontTop(ex.group, 0.1) > 0.9 * ex.report.dimensions.height);
});

test('bus pillars follow the roof colour, never colors.secondary', () => {
  const pillarHexes = spec => {
    const { group } = createVehicle(spec, style);
    const s = new Set();
    group.getObjectByName('body').traverse(o => { if (o.isMesh && o.name === 'pillar') s.add(hexOf(o.material)); });
    return [...s];
  };
  const base = { category: 'vehicle', bodyType: 'bus', colors: { body: '#3da679', secondary: '#222222', roof: '#e0a526' } };
  const withRoof = createVehicle(base, style).report.colors.roof.used;
  assert.deepEqual(pillarHexes(base), [withRoof]);
  assert.deepEqual(pillarHexes({ ...base, colors: { body: '#3da679', secondary: '#222222', roof: null } }), ['#ffffff']);
});

test('cabinMin enlarges a short cabin and is reported', () => {
  const cabinLen = spec => {
    const { group, report } = createVehicle(spec, style);
    const cabin = group.getObjectByName('body').children.find(c => c.name === 'cabin');
    const b = new THREE.Box3().setFromObject(cabin);
    return { len: b.max.z - b.min.z, report };
  };
  const base = { category: 'vehicle', bodyType: 'sedan', colors: { body: '#7d8a92' } };
  const short = cabinLen({ ...base, proportions: { hoodRatio: 0.33, cabinRatio: 0.37, rearRatio: 0.30 } });
  const atMin = cabinLen({ ...base, proportions: { hoodRatio: 0.26, cabinRatio: style.cabinMin.sedan, rearRatio: 1 - 0.26 - style.cabinMin.sedan } });
  assert.ok(short.report.approximated.some(a => a.feature === 'cabinRatio'));
  assert.ok(!atMin.report.approximated.some(a => a.feature === 'cabinRatio'));
  assert.ok(Math.abs(short.len - atMin.len) < 0.02, `${short.len} vs ${atMin.len}`);
});
