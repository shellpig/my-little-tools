// The player's wardrobe: new colours for a Mini Character's top, trousers,
// hair and skin, plus glasses, a mask or a hat. The townspeople share one
// material and one palette texture, so the player gets copies of both.
import * as THREE from 'three';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

export const PARTS = [
  { id: 'shirt', label: '上衣', colors: ['#f4f4f4', '#e8534a', '#f59f3a', '#f7d154', '#5ec889', '#4f8fe0', '#8b6be0', '#f28dbb', '#3a3d4a'] },
  { id: 'pants', label: '褲子', colors: ['#3a3d4a', '#4a63b8', '#7d8aa6', '#c9a46a', '#5b8a4e', '#a54a3f', '#f4f4f4', '#2f2f36'] },
  { id: 'hair', label: '頭髮', colors: ['#2d2b30', '#6b4330', '#a8643f', '#e0a95a', '#f2d48a', '#c4c7d2', '#e2574c', '#6aa3e8', '#d47fd0'] },
  { id: 'skin', label: '膚色', colors: ['#fde0c8', '#f3c39b', '#e9a578', '#c8865a', '#a0623f', '#6e4129'] },
];

export const ACCESSORIES = [
  { id: '', label: '無' },
  { id: 'glasses', label: '眼鏡', glb: 'aid-glasses' },
  { id: 'sunglasses', label: '墨鏡', glb: 'aid-sunglasses' },
  { id: 'mask', label: '氧氣鼻管', glb: 'aid-mask' },
  { id: 'cap', label: '棒球帽' },
  { id: 'beanie', label: '毛帽' },
  { id: 'tophat', label: '紳士帽' },
  { id: 'crown', label: '皇冠' },
];

// The palette is a grid of 32 × 128 swatches; colours come in pairs of
// columns (flat and shaded). Rows 0–1 are mostly unused and hold the copies.
const SW = 32;
const SH = 128;
const SIZE = 512;
const FREE = [
  ...Array.from({ length: 16 }, (_, i) => [i * SW, 0]),
  ...Array.from({ length: 14 }, (_, i) => [(i + 2) * SW, SH]),
];

// In every character the face is a flat plate at SKIN_Z with the eyes,
// brows and mouth laid just in front of it at FACE_Z.
const SKIN_Z = 0.158;
const FACE_Z = 0.16;
const SHOE_TOP = 0.095;
const WAIST = 0.18;
const NEAR = 0.01;
// Where the head bone sits in the rest pose (torso + head offsets), and the
// top of the head block under the hair.
const HEAD_Y = 0.343;
const HEAD_TOP = 0.67;

const swatchOf = (u, v) => [Math.min(15, Math.floor(u * SIZE / SW)), Math.min(3, Math.floor(v * SIZE / SH))];
const key = ([c, r]) => `${c},${r}`;
const family = ([c, r]) => `${c >> 1},${r}`;

// Which part each triangle belongs to ('' keeps its colour).
function classify(head, body, look) {
  const tris = mesh => {
    const g = mesh.geometry;
    const pos = g.attributes.position;
    const uv = g.attributes.uv;
    const out = [];
    for (let t = 0; t < pos.count; t += 3) {
      const ys = [0, 1, 2].map(k => pos.getY(t + k));
      const zs = [0, 1, 2].map(k => pos.getZ(t + k));
      const x = [0, 1, 2].reduce((sum, k) => sum + pos.getX(t + k) / 3, 0);
      const sw = swatchOf(...[0, 1, 2].reduce((s, k) => [s[0] + uv.getX(t + k) / 3, s[1] + uv.getY(t + k) / 3], [0, 0]));
      out.push({ t, sw, x, y: (ys[0] + ys[1] + ys[2]) / 3, ys,
        onFace: zs.every(z => Math.abs(z - FACE_Z) < 0.001), onSkin: zs.every(z => Math.abs(z - SKIN_Z) < 0.001) });
    }
    return out;
  };
  const headTris = tris(head);
  const bodyTris = tris(body);
  const dark = sw => sw[1] === 3 && sw[0] < 2;

  // Skin is whatever the face plate is made of.
  const skin = family(headTris.find(h => h.onSkin).sw);

  const parts = { head: [], body: [] };
  for (const h of headTris) {
    let part = 'hair';
    if (family(h.sw) === skin) part = 'skin';
    // Eyes and mouth, glasses, hats and hair clips keep their colours.
    else if ((h.onFace && dark(h.sw)) || h.sw[1] === 2 || (h.sw[1] === 3 && h.sw[0] >= 6 && h.sw[0] <= 9)
      || (look === 'male-c' && dark(h.sw) && h.ys.every(y => y > 0.55))) part = '';
    parts.head.push(part);
  }

  // Clothes go by height: a swatch that stays within one band is all that
  // part; one that spans bands (overalls, a black suit) goes triangle by triangle.
  const zone = (lo, hi) => {
    if (hi <= SHOE_TOP + NEAR) return '';
    if (lo >= WAIST - NEAR) return 'shirt';
    if (lo >= SHOE_TOP - NEAR && hi <= WAIST + NEAR) return 'pants';
    return null;
  };
  const range = new Map();
  for (const b of bodyTris) {
    const r = range.get(key(b.sw)) ?? [Infinity, -Infinity];
    range.set(key(b.sw), [Math.min(r[0], ...b.ys), Math.max(r[1], ...b.ys)]);
  }
  for (const b of bodyTris) {
    const [lo, hi] = range.get(key(b.sw));
    let part = zone(lo, hi) ?? zone(Math.min(...b.ys), Math.max(...b.ys)) ?? (b.y < SHOE_TOP ? '' : b.y < WAIST ? 'pants' : 'shirt');
    // Skin shows on the hands and legs; skin-coloured bits on the chest
    // are clothes (braces, a collar) and keep their colour.
    if (family(b.sw) === skin) part = Math.abs(b.x) < 0.2 && b.y >= WAIST ? '' : 'skin';
    // A belt, and small light details like buttons and soles, stay put.
    else if ((lo >= WAIST - 0.02 && hi <= 0.215) || (b.sw[1] === 3 && b.sw[0] >= 6 && b.sw[0] <= 7)) part = '';
    parts.body.push(part);
  }
  return parts;
}

// A character's meshes with every recoloured triangle pointed at its own
// copy of the swatch it used, so that copy can be painted freely.
function remap(gltf, look) {
  const meshes = {};
  gltf.scene.traverse(o => { if (o.isSkinnedMesh) meshes[o.name] = o; });
  const geos = {};
  for (const name of ['head-mesh', 'body-mesh']) {
    const g = meshes[name].geometry;
    geos[name] = g.index ? g.toNonIndexed() : g.clone();
  }
  const parts = classify({ geometry: geos['head-mesh'] }, { geometry: geos['body-mesh'] }, look);
  const copies = new Map();
  for (const [name, list] of [['head-mesh', parts.head], ['body-mesh', parts.body]]) {
    const uv = geos[name].attributes.uv;
    list.forEach((part, i) => {
      if (!part) return;
      const t = i * 3;
      const sw = swatchOf((uv.getX(t) + uv.getX(t + 1) + uv.getX(t + 2)) / 3, (uv.getY(t) + uv.getY(t + 1) + uv.getY(t + 2)) / 3);
      const id = `${part}:${key(sw)}`;
      if (!copies.has(id)) copies.set(id, { part, from: sw, to: FREE[copies.size] });
      const { to } = copies.get(id);
      for (let k = 0; k < 3; k++) {
        uv.setXY(t + k, uv.getX(t + k) + (to[0] - sw[0] * SW) / SIZE, uv.getY(t + k) + (to[1] - sw[1] * SH) / SIZE);
      }
    });
    uv.needsUpdate = true;
  }
  return { geos, copies: [...copies.values()] };
}

function hatMesh(id) {
  const group = new THREE.Group();
  const mat = color => new THREE.MeshStandardMaterial({ color, roughness: 0.8 });
  const box = (w, h, d, color, x, y, z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
    m.position.set(x, y, z);
    m.castShadow = true;
    group.add(m);
  };
  if (id === 'cap') {
    box(0.48, 0.12, 0.42, '#e8534a', 0, 0.05, 0);
    box(0.44, 0.025, 0.16, '#e8534a', 0, 0, 0.27);
    box(0.06, 0.03, 0.06, '#f4f4f4', 0, 0.125, 0);
  } else if (id === 'beanie') {
    box(0.5, 0.14, 0.44, '#4f8fe0', 0, 0.05, 0);
    box(0.52, 0.05, 0.46, '#f4f4f4', 0, -0.02, 0);
    box(0.1, 0.08, 0.1, '#f4f4f4', 0, 0.15, 0);
  } else if (id === 'tophat') {
    box(0.6, 0.03, 0.52, '#2a2b33', 0, 0, 0);
    box(0.38, 0.26, 0.34, '#2a2b33', 0, 0.14, 0);
    box(0.385, 0.05, 0.345, '#b8324a', 0, 0.04, 0);
  } else if (id === 'crown') {
    box(0.4, 0.07, 0.34, '#f2c14e', 0, 0.02, 0);
    for (const [x, z] of [[-0.17, -0.14], [0, -0.14], [0.17, -0.14], [-0.17, 0.14], [0, 0.14], [0.17, 0.14]]) {
      box(0.06, 0.08, 0.06, '#f2c14e', x, 0.09, z);
    }
    box(0.06, 0.06, 0.02, '#e8534a', 0, 0.03, 0.175);
  }
  return group;
}

// `characters`: look name → gltf; `aids`: glb name → gltf.
export function createWardrobe(characters, aids) {
  const looks = new Map();
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const source = Object.values(characters)[0].scene.getObjectByProperty('isSkinnedMesh', true).material;
  // A texture of its own: a clone would share the townspeople's image source,
  // and swapping that image would repaint them too.
  ctx.drawImage(source.map.image, 0, 0, SIZE, SIZE);
  const original = ctx.getImageData(0, 0, SIZE, SIZE);
  const map = new THREE.CanvasTexture(canvas);
  for (const k of ['flipY', 'colorSpace', 'wrapS', 'wrapT', 'magFilter', 'minFilter']) map[k] = source.map[k];
  const material = source.clone();
  material.map = map;

  function lookData(look) {
    if (!looks.has(look)) looks.set(look, remap(characters[look], look));
    return looks.get(look);
  }

  // Each copy keeps the shading of its swatch, scaled to the chosen colour.
  function paint(look, outfit) {
    const out = new ImageData(new Uint8ClampedArray(original.data), SIZE, SIZE);
    const px = (x, y) => (y * SIZE + x) * 4;
    for (const { part, from, to } of lookData(look).copies) {
      const fx = from[0] * SW;
      const fy = from[1] * SH;
      const color = outfit[part] ? new THREE.Color(outfit[part]) : null;
      const top = original.data.slice(px(fx + 2, fy + 2), px(fx + 2, fy + 2) + 3);
      for (let y = 0; y < SH; y++) {
        for (let x = 0; x < SW; x++) {
          const s = px(fx + x, fy + y);
          const d = px(to[0] + x, to[1] + y);
          for (let c = 0; c < 3; c++) {
            const was = original.data[s + c];
            out.data[d + c] = color ? Math.min(255, color[['r', 'g', 'b'][c]] * 255 * was / Math.max(1, top[c])) : was;
          }
          out.data[d + 3] = 255;
        }
      }
    }
    ctx.putImageData(out, 0, 0);
    map.needsUpdate = true;
  }

  function wear(obj, look, accessory) {
    const head = obj.getObjectByName('head');
    const old = head.getObjectByName('accessory');
    if (old) head.remove(old);
    const item = ACCESSORIES.find(a => a.id === accessory);
    if (!item?.id) return;
    let thing;
    if (item.glb) {
      thing = aids[item.glb].scene.clone(true);
      // Placed by eye against the face plane, in the head bone's space.
      if (item.id === 'mask') thing.position.set(0, -0.01, -0.01);
      else thing.position.set(0, 0.105, 0.1);
      thing.scale.setScalar(item.id === 'mask' ? 1.05 : 1.2);
    } else {
      // Pulled down over the top of the head; buns and spikes poke through.
      thing = hatMesh(item.id);
      thing.position.set(0, HEAD_TOP - HEAD_Y - 0.06, 0);
    }
    thing.name = 'accessory';
    thing.traverse(o => { if (o.isMesh) o.castShadow = true; });
    head.add(thing);
  }

  return {
    material,
    // A fresh skinned copy of the look in the given outfit.
    dress(look, outfit) {
      const obj = SkeletonUtils.clone(characters[look].scene);
      const { geos } = lookData(look);
      obj.traverse(o => {
        if (!o.isSkinnedMesh) return;
        o.geometry = geos[o.name];
        o.material = material;
        o.castShadow = true;
      });
      paint(look, outfit);
      obj.updateMatrixWorld(true);
      wear(obj, look, outfit.accessory);
      return obj;
    },
    paint,
    wear,
  };
}
