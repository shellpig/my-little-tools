// createVehicle(spec, style) -> { group, report }
// Pure three.js, no DOM: runs unchanged in the browser (importmap) and in Node.
// Axes: nose toward +z, y up, wheels touch y = 0, centred on x.
import * as THREE from 'three';

// Per-bodyType defaults and layout constants.
// lw/hw: "real" proportions; ratios: hood/cabin/rear; sf/sr: windshield / rear slant as a fraction of cabin base.
const TYPES = {
  sedan:       { lw: 2.7, hw: 0.90, ratios: [0.25, 0.52, 0.23], panels: 2, size: 'normal', lenBias: 0,    belt: 0.54, sf: 0.26, sr: 0.22, cwInset: 0.16 },
  hatchback:   { lw: 2.4, hw: 0.90, ratios: [0.26, 0.70, 0.04], panels: 2, size: 'normal', lenBias: 0,    belt: 0.54, sf: 0.20, sr: 0.55, cwInset: 0.16 },
  suv:         { lw: 2.6, hw: 1.00, ratios: [0.22, 0.66, 0.12], panels: 3, size: 'normal', lenBias: 0,    belt: 0.55, sf: 0.18, sr: 0.08, cwInset: 0.14 },
  van:         { lw: 2.6, hw: 1.05, ratios: [0.08, 0.84, 0.08], panels: 3, size: 'normal', lenBias: 0.10, belt: 0.52, sf: 0.14, sr: 0.02, cwInset: 0.10 },
  pickup:      { lw: 2.9, hw: 0.95, ratios: [0.27, 0.34, 0.39], panels: 1, size: 'normal', lenBias: 0.25, belt: 0.54, sf: 0.34, sr: 0.06, cwInset: 0.16 },
  'box-truck': { lw: 3.0, hw: 1.35, ratios: [0.10, 0.22, 0.68], panels: 1, size: 'normal', lenBias: 0.45, belt: 0.45, sf: 0.28, sr: 0.00, cwInset: 0.14, cabDrop: 0.25 },
  bus:         { lw: 4.8, hw: 1.30, ratios: [0, 0.9, 0.1],      panels: 6, size: 'large',  lenBias: 0,    belt: 0.45, sf: 0,    sr: 0,    cwInset: 0 }
};

export const VEHICLE_DEFAULTS = Object.fromEntries(Object.entries(TYPES).map(([k, t]) => [k, {
  proportions: {
    lengthToWidth: t.lw, heightToWidth: t.hw,
    hoodRatio: t.ratios[0], cabinRatio: t.ratios[1], rearRatio: t.ratios[2]
  },
  wheels: { axles: 2, sizeClass: t.size },
  windows: { sidePanels: t.panels, rear: true }
}]));

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const lerp = (a, b, t) => a + (b - a) * t;
const r3 = v => Math.round(v * 1000) / 1000;

// Nearest palette entry by perceptual-ish distance on sRGB bytes (redmean), not linear RGB.
function nearestHex(list, hex) {
  const rgb = h => [1, 3, 5].map(k => parseInt(h.slice(k, k + 2), 16));
  const [r, g, b] = rgb(hex);
  let best = list[0];
  let bestD = Infinity;
  for (const h of list) {
    const [r2, g2, b2] = rgb(h);
    const rm = (r + r2) / 2;
    const d = (2 + rm / 256) * (r - r2) ** 2 + 4 * (g - g2) ** 2 + (2 + (255 - rm) / 256) * (b - b2) ** 2;
    if (d < bestD) { bestD = d; best = h; }
  }
  return best;
}

// Extrude a side profile [[z, y], ...] across `width` with a 45-degree chamfer of size `bevel`.
// Outline stays at its exact size; only the two side caps shrink.
function extrudeProfile(points, width, bevel) {
  const b = Math.min(bevel, width / 4);
  const shape = new THREE.Shape(points.map(([z, y]) => new THREE.Vector2(z, y)));
  const depth = width - 2 * b;
  const g = new THREE.ExtrudeGeometry(shape, {
    depth, steps: 1, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelOffset: -b, bevelSegments: 1
  });
  g.translate(0, 0, -depth / 2);
  g.rotateY(-Math.PI / 2); // shape x -> world z, extrusion -> world x
  return g;
}

// Plain flat extrusion of a side profile across width (no chamfer).
function extrudeFlat(points, width) {
  const shape = new THREE.Shape(points.map(([z, y]) => new THREE.Vector2(z, y)));
  const g = new THREE.ExtrudeGeometry(shape, { depth: width, bevelEnabled: false });
  g.translate(0, 0, -width / 2);
  g.rotateY(-Math.PI / 2);
  return g;
}

function arcPoints(zc, yc, r, p0, p1) {
  const steps = Math.max(1, Math.round(Math.abs(p1 - p0) / 18));
  const out = [];
  for (let i = 0; i <= steps; i++) {
    const phi = (p0 + (p1 - p0) * i / steps) * Math.PI / 180;
    out.push([zc + r * Math.cos(phi), yc + r * Math.sin(phi)]);
  }
  return out;
}

function triangleCount(root) {
  let n = 0;
  root.traverse(o => {
    if (!o.isMesh) return;
    const g = o.geometry;
    n += (g.index ? g.index.count : g.attributes.position.count) / 3;
  });
  return n;
}

export function createVehicle(spec, style) {
  const T = TYPES[spec.bodyType];
  if (!T) throw new Error(`unknown bodyType: ${spec.bodyType}`);
  const isBus = spec.bodyType === 'bus';
  const type = spec.bodyType;
  const env = style.envelope;
  const pal = style.palette;
  const applied = [];
  const approximated = [];
  const skipped = [];

  const def = VEHICLE_DEFAULTS[type];
  const prop = { ...def.proportions, ...(spec.proportions || {}) };
  const wheelCfg = { ...def.wheels, ...(spec.wheels || {}) };
  const winCfg = { ...def.windows, ...(spec.windows || {}) };
  const features = [...new Set(spec.features || [])];
  const has = f => features.includes(f);

  // ----- colours -----
  const snap = hex => (style.snapColors ? nearestHex(pal.body, hex) : hex.toLowerCase());
  const colorsReport = {};
  const pick = (key, fallback) => {
    const req = spec.colors?.[key];
    if (!req) return snap(fallback);
    const used = snap(req);
    colorsReport[key] = { requested: req, used };
    return used;
  };
  const bodyHex = pick('body', '#ffffff');
  const secHex = pick('secondary', '#ffffff');
  const roofHex = spec.colors?.roof ? pick('roof', bodyHex) : null;
  const hasSecondary = !!spec.colors?.secondary;

  const matCache = new Map();
  const mat = (hex, double = false, vc = false) => {
    const key = `${hex}|${double}|${vc}`;
    if (!matCache.has(key)) {
      matCache.set(key, new THREE.MeshStandardMaterial({
        color: hex,
        roughness: style.material.roughness,
        metalness: style.material.metalness,
        flatShading: style.material.flatShading,
        side: double ? THREE.DoubleSide : THREE.FrontSide,
        vertexColors: vc
      }));
    }
    return matCache.get(key);
  };
  // Lamps get their own material objects so the town can drive their emissive.
  const lampMat = hex => new THREE.MeshStandardMaterial({ color: hex, roughness: 0.6, metalness: 0, flatShading: true });
  const headMat = lampMat(pal.headlight);
  headMat.name = 'headlight';
  const tailMat = lampMat(pal.taillight);
  tailMat.name = 'taillight';
  // Painted surfaces carry a vertical brightness gradient (vertex colours) when the style asks for one.
  const pmat = hex => mat(hex, false, !!style.gradient);
  const paint = pmat(bodyHex);
  const dark = mat(pal.skirt);

  // ----- overall size -----
  const W = isBus ? env.busWidth : env.width;
  const Wb = W - 0.08; // main shell a hair narrower than accessories so the envelope width is exact
  const [lenMin, lenMax] = isBus ? env.busLength : env.length;
  const [hMin, hMax] = isBus ? env.busHeight : env.height;
  const lw = prop.lengthToWidth;
  const hw = prop.heightToWidth;
  let L = isBus
    ? lerp(lenMin, lenMax, clamp((lw - 3) / 3, 0, 1))
    : lerp(lenMin, lenMax, clamp((lw - 2) / 3, 0, 1)) + T.lenBias;
  L = clamp(L, lenMin, lenMax);
  const H = isBus
    ? clamp(lerp(hMin, hMax, (hw - 1.0) / 0.6), hMin, hMax)
    : clamp(lerp(hMin, hMax, (hw - 0.6) / 0.9), hMin, hMax);
  approximated.push({ feature: 'lengthToWidth', note: `${lw} 對應為車長 ${r3(L)}（風格範圍 ${lenMin}～${lenMax}）` });
  approximated.push({ feature: 'heightToWidth', note: `${hw} 對應為車高 ${r3(H)}（風格範圍 ${hMin}～${hMax}）` });

  let [hr, cr, rr] = [prop.hoodRatio, prop.cabinRatio, prop.rearRatio];
  const rsum = hr + cr + rr;
  if (rsum <= 0) [hr, cr, rr] = T.ratios; else { hr /= rsum; cr /= rsum; rr /= rsum; }
  const cMin = style.cabinMin?.[type];
  if (cMin && cr < cMin && hr + rr > 1e-6) {
    const extra = Math.min(cMin - cr, (hr + rr) * 0.8);
    const f = extra / (hr + rr);
    approximated.push({ feature: 'cabinRatio', note: `風格的座艙至少佔車長 ${cMin}，${r3(cr)} 提高為 ${r3(cr + extra)}（從引擎蓋與車尾等比例扣除）` });
    hr -= hr * f;
    rr -= rr * f;
    cr += extra;
  }
  if (Math.abs(rsum - 1) > 0.005) approximated.push({ feature: 'proportions', note: `hood/cabin/rear 總和 ${r3(rsum)}，已正規化為 1` });

  // ----- features that change the height / length budget -----
  const roofFeatures = [];
  let ah = 0; // extra height carried by roof accessories
  if (has('roof-rack')) ah = Math.max(ah, 0.07);
  if (has('roof-sign')) ah = Math.max(ah, 0.09);
  if (roofHex) ah = Math.max(ah, 0.012);
  if (isBus) ah = Math.max(ah, 0.12); // AC unit on the roof
  const top = H - ah;
  const spareOn = has('spare-wheel');
  const rearInset = spareOn ? 0.07 : 0;

  // ----- wheels / base layout -----
  const wc = style.wheel;
  const R = wheelCfg.sizeClass === 'large' ? wc.largeRadius : wc.radius;
  const Ra = R + 0.03; // arch radius
  const wheelX = W / 2 - 0.01 - wc.flush - (wc.width - wc.inset); // tire face sits flush with the fender flare
  const yb = 0.12;
  const archTop = R + Ra;
  const belt = Math.max((T.belt) * top, archTop + (isBus ? 0.14 : 0.12));
  const zF = L / 2 - 0.08;
  const zR = -L / 2 + 0.08 + rearInset;
  const Ls = zF - zR;

  // A bus with hoodRatio >= 0.08 gets a conventional long nose: engine hood ahead of the passenger box.
  const longNose = isBus && prop.hoodRatio >= 0.08;
  const hoodLen = longNose ? clamp(prop.hoodRatio, 0.10, 0.22) * L : 0;
  const zH = zF - hoodLen; // front face of the passenger box
  const hoodTop = Math.max(0.52 * H, belt + 0.12);
  if (longNose) approximated.push({ feature: 'hoodRatio', note: `長鼻公車：引擎蓋長 ${r3(hoodLen)}，蓋頂高 ${r3(hoodTop)}` });
  const zFront = isBus ? (longNose ? zF - 0.6 : L / 2 - 1.6) : L / 2 - 0.62;
  const zBack = isBus ? -L / 2 + 1.2 : -L / 2 + (type === 'box-truck' ? 0.72 : 0.66);
  const axleZ = wheelCfg.axles === 3 ? [zFront, (zFront + zBack) / 2, zBack] : [zFront, zBack];
  const wheelNames = wheelCfg.axles === 3 ? ['front', 'mid', 'back'] : ['front', 'back'];

  // Nose / tail shaping: sloped hood and boot, rounded plan corners.
  const rF = isBus && !longNose ? 0 : 0.17;
  const rRr = ['sedan', 'hatchback', 'suv', 'van'].includes(type) ? 0.17 : 0;
  let zA0 = zF;
  let zBc0 = zF;
  if (longNose) zA0 = zH;
  if (!isBus) {
    zA0 = zF - hr * Ls;
    const zb = Math.max(zA0 - cr * Ls, zR);
    zBc0 = zA0 - Math.max(zA0 - zb, 0.4);
  }
  const hoodDrop = isBus && !longNose ? 0 : Math.min(0.12, 0.45 * (zF - zA0));
  const bootDrop = type === 'sedan' ? 0.05 : 0;
  const zBootStart = zBack - Ra;
  const dropAt = z => {
    let d = 0;
    if (hoodDrop > 0 && z > zA0) d = hoodDrop * (z - zA0) / (zF - zA0);
    if (bootDrop > 0 && z < zBootStart) d = Math.max(d, bootDrop * (zBootStart - z) / (zBootStart - zR));
    return d;
  };
  const planScale = z => {
    let hw = Wb / 2;
    if (rF > 0 && z > zF - rF) { const t = Math.min(1, (z - (zF - rF)) / rF); hw = Wb / 2 - rF + rF * Math.sqrt(1 - t * t); }
    if (rRr > 0 && z < zR + rRr) { const t = Math.min(1, (zR + rRr - z) / rRr); hw = Math.min(hw, Wb / 2 - rRr + rRr * Math.sqrt(1 - t * t)); }
    return hw / (Wb / 2);
  };
  const rad = a => a * Math.PI / 180;
  const frontSt = rF > 0 ? [0, 30, 60].map(a => zF - rF + rF * Math.sin(rad(a))) : [];
  const rearSt = rRr > 0 ? [60, 30, 0].map(a => zR + rRr - rRr * Math.sin(rad(a))) : [];

  const body = new THREE.Group();
  body.name = 'body';
  const add = (geo, m, name) => {
    const mesh = new THREE.Mesh(geo, m);
    if (name) mesh.name = name;
    mesh.castShadow = mesh.receiveShadow = true;
    body.add(mesh);
    return mesh;
  };
  const box = (w, h, d, x, y, z, m, name) => {
    const g = new THREE.BoxGeometry(w, h, d);
    g.translate(x, y, z);
    return add(g, m, name);
  };

  // Lower body with wheel arches.
  {
    const asc = [...axleZ].sort((a, b) => a - b);
    const groups = [];
    for (const z of asc) {
      const last = groups[groups.length - 1];
      if (last && z - last[last.length - 1] < 2 * Ra + 0.25) last.push(z); else groups.push([z]);
    }
    const sk = yb + 0.24; // top of the dark skirt band
    const ch = 0.08; // shoulder chamfer height
    const topL = belt - ch;
    const xi = Math.sqrt(Math.max(Ra * Ra - (sk - R) ** 2, 0));
    const pts = [[zR, sk]];
    const push = p => {
      const l = pts[pts.length - 1];
      if (Math.hypot(p[0] - l[0], p[1] - l[1]) > 1e-4) pts.push(p);
    };
    const pushIfAhead = p => { if (p[0] > pts[pts.length - 1][0] + 1e-3) push(p); };
    for (const z of rearSt) push([z, sk]);
    for (const g of groups) {
      const a = g[0];
      const b = g[g.length - 1];
      pushIfAhead(sk <= R ? [a - Ra, sk] : [a - xi, sk]);
      for (const p of arcPoints(a, R, Ra, 180, 90)) if (p[1] > sk + 1e-3) push(p);
      for (const p of arcPoints(b, R, Ra, 90, 0)) if (p[1] > sk + 1e-3) push(p);
      push(sk <= R ? [b + Ra, sk] : [b + xi, sk]);
    }
    for (const z of frontSt) pushIfAhead([z, sk]);
    const hoodTopL = longNose ? hoodTop - ch : topL;
    push([zF, sk]); push([zF, hoodTopL]);
    for (const z of [...frontSt].reverse()) push([z, hoodTopL]);
    if (longNose) { push([zH, hoodTopL]); push([zH, topL]); } else if (hoodDrop > 0 && zA0 < zF - rF - 0.02) push([zA0, topL]);
    if (bootDrop > 0 && zBootStart > zR + rRr + 0.02) push([zBootStart, topL]);
    for (const z of [...rearSt].reverse()) push([z, topL]);
    push([zR, topL]);
    const lg = extrudeFlat(pts, Wb);
    {
      const p = lg.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const z = p.getZ(i);
        if (p.getY(i) >= topL - 1e-6) p.setY(i, p.getY(i) - dropAt(z));
        p.setX(i, p.getX(i) * planScale(z));
      }
      lg.computeVertexNormals();
    }
    add(lg, paint, 'lower');
    // Shoulder: chamfered strip along the top edge, lofted through stations so it follows the slopes and rounded corners.
    {
      const zs = [...new Set([zR, ...rearSt, ...(bootDrop > 0 && zBootStart > zR + rRr + 0.02 ? [zBootStart] : []),
        ...(hoodDrop > 0 && zA0 < zF - rF - 0.02 ? [zA0] : []), ...(longNose ? [zH] : []), ...frontSt, zF])]
        .filter(z => z >= zR - 1e-6 && z <= zF + 1e-6).sort((a, b) => a - b);
      const st = [];
      for (const z of zs) {
        if (longNose && Math.abs(z - zH) < 1e-6) st.push({ z, hi: false }, { z, hi: true });
        else st.push({ z, hi: longNose && z > zH });
      }
      const sec = ({ z, hi }) => {
        const sc = planScale(z);
        const d = dropAt(z);
        const hw = Wb / 2 * sc;
        const b = hi ? hoodTop : belt;
        return [[-hw, b - ch - d, z], [hw, b - ch - d, z], [hw - ch, b - d, z], [-hw + ch, b - d, z]];
      };
      const ref = [0, topL - 0.1, (zR + zF) / 2];
      const out = [];
      const tri = (a, b, c) => {
        const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
        const v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
        const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
        const m = [(a[0] + b[0] + c[0]) / 3 - ref[0], (a[1] + b[1] + c[1]) / 3 - ref[1], (a[2] + b[2] + c[2]) / 3 - ref[2]];
        if (n[0] * m[0] + n[1] * m[1] + n[2] * m[2] < 0) out.push(...a, ...c, ...b); else out.push(...a, ...b, ...c);
      };
      for (let i = 0; i < st.length - 1; i++) {
        const A = sec(st[i]);
        const B = sec(st[i + 1]);
        for (const [e0, e1] of [[1, 2], [2, 3], [3, 0]]) { tri(A[e0], A[e1], B[e1]); tri(A[e0], B[e1], B[e0]); }
      }
      for (const S of [sec(st[0]), sec(st[st.length - 1])]) { tri(S[0], S[1], S[2]); tri(S[0], S[2], S[3]); }
      const sg = new THREE.BufferGeometry();
      sg.setAttribute('position', new THREE.Float32BufferAttribute(out, 3));
      sg.computeVertexNormals();
      add(sg, paint, 'shoulder');
    }
    // Dark fender flares: semicircular rings concentric with each wheel, slightly proud of the side.
    {
      const Ro = Ra + 0.07;
      const legY = Math.min(R, sk);
      for (const z of axleZ) {
        const poly = [[z - Ro, legY], ...arcPoints(z, R, Ro, 180, 0), [z + Ro, legY], [z + Ra, legY],
          ...arcPoints(z, R, Ra, 0, 180), [z - Ra, legY]]
          .filter((p, i, arr) => i === 0 || Math.hypot(p[0] - arr[i - 1][0], p[1] - arr[i - 1][1]) > 1e-4);
        const shape = new THREE.Shape(poly.map(([zz, y]) => new THREE.Vector2(zz, y)));
        for (const sx of [-1, 1]) {
          const g = new THREE.ExtrudeGeometry(shape, { depth: 0.035, bevelEnabled: false });
          g.translate(0, 0, sx > 0 ? -(Wb / 2 + 0.03) : Wb / 2 - 0.005);
          g.rotateY(-Math.PI / 2);
          add(g, dark, 'flare');
        }
      }
    }
    // Dark skirt band: one block per stretch between the arches (chamfered at the outer plan corners).
    const planBlock = (z0, z1, hw, y0, h, c0, c1, m, name) => {
      const P = [[-hw, z0 + c0], [-hw + c0, z0], [hw - c0, z0], [hw, z0 + c0], [hw, z1 - c1], [hw - c1, z1], [-hw + c1, z1], [-hw, z1 - c1]]
        .filter((p, i, a) => i === 0 || Math.hypot(p[0] - a[i - 1][0], p[1] - a[i - 1][1]) > 1e-4);
      const shape = new THREE.Shape(P.map(([x, z]) => new THREE.Vector2(x, -z)));
      const g = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false });
      g.rotateX(-Math.PI / 2);
      g.translate(0, y0, 0);
      return add(g, m, name);
    };
    const cc = 0.16;
    const edges = [zR];
    for (const g of groups) edges.push(g[0] - Ra, g[g.length - 1] + Ra);
    edges.push(zF);
    for (let i = 0; i < edges.length; i += 2) {
      const z0 = edges[i];
      const z1 = edges[i + 1];
      if (z1 - z0 > 0.05) {
        planBlock(z0, z1, W / 2, yb, sk + 0.02 - yb, i === 0 && rRr > 0 ? cc : 0, i === edges.length - 2 && rF > 0 ? cc : 0, dark, 'skirt');
      }
    }
    // Dark axle blocks behind each wheel so the arches read as tucked-in.
    for (const z of axleZ) box(2 * (wheelX - wc.inset), R + Ra - 0.03 - yb, 2 * Ra - 0.02, 0, (yb + R + Ra - 0.03) / 2, z, dark, 'axle');
    // Bumpers (protrude past the shell, corners cut) with a light plate block in the middle.
    const plate = mat(snap('#dcdce9'));
    planBlock(L / 2 - 0.17, L / 2 - 0.03, W / 2, yb, 0.26, 0, rF > 0 ? cc : 0, dark, 'bumper-front');
    planBlock(-L / 2 + 0.03, -L / 2 + 0.17, W / 2, yb, 0.26, rRr > 0 ? cc : 0, 0, dark, 'bumper-back');
    for (const sz of [1, -1]) box(0.3, 0.1, 0.03, 0, yb + 0.14, sz * (L / 2 - 0.015), plate, 'plate');
    // Lamps on the end faces, near the corners.
    const lampX = r => (r > 0 ? Wb / 2 - r - 0.13 : Wb / 2 - 0.19);
    for (const sx of [-1, 1]) {
      box(0.22, 0.12, 0.04, sx * lampX(rF), (longNose ? hoodTop - 0.06 : belt) - 0.16 - dropAt(zF), zF + 0.01, headMat, 'headlight');
      box(0.22, 0.10, 0.04, sx * lampX(rRr), belt - 0.16 - dropAt(zR), zR - 0.01, tailMat, 'taillight');
    }
  }

  // Windows: collect quads into one mesh.
  const winPos = [];
  const framePos = [];
  const quad = (a, b, c, d, out = winPos) => out.push(...a, ...b, ...c, ...a, ...c, ...d);
  const cb = style.bevel * 0.8; // cabin chamfer
  const TAPER = 0.88; // roof width relative to the cabin base
  let roofInfo = null;

  // Cabin trapezoid with side / front / rear windows.
  const addCabin = ({ zA, zB, sf, sr, base, cabTop, cw, panels, rear }) => {
    const cbase = zA - zB;
    const zFt = zA - sf;
    const zRt = zB + sr;
    const hgt = cabTop - base;
    const kf = y => 1 - (1 - TAPER) * ((y - base) / hgt);
    const cabGeo = extrudeProfile([[zB, base], [zA, base], [zFt, cabTop], [zRt, cabTop]], cw, cb);
    const cp = cabGeo.attributes.position;
    for (let i = 0; i < cp.count; i++) cp.setX(i, cp.getX(i) * kf(cp.getY(i)));
    cabGeo.computeVertexNormals();
    add(cabGeo, paint, 'cabin');
    const fz = y => zA + (zFt - zA) * ((y - base) / hgt);
    const rz = y => zB + (zRt - zB) * ((y - base) / hgt);
    const y0 = belt + cb + 0.03;
    const y1 = cabTop - cb - 0.03;
    const m = 0.08;
    const gap = 0.05;
    if (y1 - y0 > 0.08) {
      const span = y => (fz(y) - m) - (rz(y) + m);
      let n = panels;
      const mid = span((y0 + y1) / 2);
      while (n > 1 && mid / n - gap < 0.1) n--;
      if (n !== panels) approximated.push({ feature: 'windows.sidePanels', note: `${panels} 片放不下，改為 ${n} 片` });
      if (mid > 0.12) {
        for (const sx of [-1, 1]) {
          for (let i = 0; i < n; i++) {
            const pt = (y, u) => {
              const lo = rz(y) + m;
              const hi = fz(y) - m;
              return [sx * (cw / 2 * kf(y) + 0.01), y, lo + (hi - lo) * u];
            };
            const ua = i / n + gap / 2 / mid;
            const ub = (i + 1) / n - gap / 2 / mid;
            quad(pt(y0, ua), pt(y0, ub), pt(y1, ub), pt(y1, ua));
            const fr = (y, u, dz, yy) => { const p = pt(y, u); return [p[0] - sx * 0.004, yy, p[2] + dz]; };
            quad(fr(y0, ua, -0.025, y0 - 0.025), fr(y0, ub, 0.025, y0 - 0.025), fr(y1, ub, 0.025, y1 + 0.025), fr(y1, ua, -0.025, y1 + 0.025), framePos);
          }
        }
      }
    }
    const hxAt = y => (cw / 2 - cb - 0.02) * kf(y);
    const slopeQuad = (zBase, zTop, sign) => {
      const dz = zTop - zBase;
      const dy = hgt;
      const len = Math.hypot(dz, dy);
      const [nz, ny] = (sign > 0 ? [dy, -dz] : [-dy, dz]).map(v => v / len);
      const t0 = (belt + cb + 0.03 - base) / hgt;
      const t1 = 1 - (cb + 0.03) / hgt;
      const p = t => [zBase + dz * t + nz * 0.01, base + dy * t + ny * 0.01];
      const [za, ya] = p(t0);
      const [zb, yb2] = p(t1);
      const h0 = hxAt(ya);
      const h1 = hxAt(yb2);
      quad([-h0, ya, za], [h0, ya, za], [h1, yb2, zb], [-h1, yb2, zb]);
      const e = 0.02;
      const f0 = [za - nz * 0.004, ya - ny * 0.004];
      const f1 = [zb - nz * 0.004, yb2 - ny * 0.004];
      const ez = dz / len * 0.025;
      const ey = dy / len * 0.025;
      quad([-h0 - e, f0[1] - ey, f0[0] - ez], [h0 + e, f0[1] - ey, f0[0] - ez], [h1 + e, f1[1] + ey, f1[0] + ez], [-h1 - e, f1[1] + ey, f1[0] + ez], framePos);
    };
    slopeQuad(zA, zFt, 1);
    if (rear) slopeQuad(zB, zRt, -1);
    if (roofHex && roofHex !== bodyHex && zFt - zRt > 2 * cb + 0.1) {
      box(cw * TAPER - 2 * cb + 0.01, 0.012, zFt - zRt - 2 * cb, 0, cabTop + 0.006, (zFt + zRt) / 2, mat(roofHex), 'roof');
    }
    return { z0: zRt + cb, z1: zFt - cb, cw: cw * TAPER };
  };

  // Open bed / flatbed rails between zFrom (forward end) and the tail.
  const addBed = (zFrom, wallH) => {
    const len = zFrom - zR;
    for (const sx of [-1, 1]) box(0.07, wallH, len, sx * (Wb / 2 - 0.035), belt + wallH / 2, (zFrom + zR) / 2, paint, 'bed-wall');
    box(Wb, wallH, 0.07, 0, belt + wallH / 2, zR + 0.035, paint, 'tailgate');
    box(Wb - 0.14, 0.02, len - 0.07, 0, belt + 0.01, (zFrom + zR - 0.07) / 2, dark, 'bed-floor');
  };

  const cargoBox = (z0, z1, y0, y1, hex, name) => {
    add(extrudeProfile([[z0, y0], [z1, y0], [z1, y1], [z0, y1]], W, style.bevel), pmat(hex), name);
  };

  if (isBus) {
    const roofT = 0.16;
    const bandTop = top - roofT;
    const bandH = bandTop - belt;
    const bandMid = (belt + bandTop) / 2;
    const glassW = Wb - 0.02;
    const sk = yb + 0.24;
    const zP = longNose ? zH : zF; // front of the passenger box
    const LsP = zP - zR;
    box(glassW, bandH + 0.02, LsP, 0, bandMid, (zP + zR) / 2, mat(pal.window, true), 'window-band');
    const pillarHex = roofHex || snap('#ffffff');
    const doorZ = longNose ? zFront - (Ra + 0.07) - 0.05 - 0.38 : zF - 0.62;
    const n = clamp(winCfg.sidePanels, 1, 8);
    for (let i = 0; i <= n; i++) {
      const z = zR + 0.04 + (LsP - 0.08) * i / n;
      if (Math.abs(z - doorZ) < 0.5) box(W / 2, bandH, 0.08, W / 4, bandMid, z, mat(pillarHex), 'pillar');
      else box(W, bandH, 0.08, 0, bandMid, z, mat(pillarHex), 'pillar');
    }
    // End panels with a framed windshield / rear window.
    box(glassW, bandH, 0.05, 0, bandMid, zP - 0.015, paint, 'front-panel');
    box(glassW, bandH, 0.05, 0, bandMid, zR + 0.015, paint, 'rear-panel');
    const wx = glassW / 2 - 0.09;
    const wy0 = longNose ? Math.max(belt + 0.1, hoodTop + 0.06) : belt + 0.1;
    const wy1 = bandTop - 0.2;
    const endGlass = (z, dir) => {
      quad([-wx, wy0, z + dir * 0.014], [wx, wy0, z + dir * 0.014], [wx, wy1, z + dir * 0.014], [-wx, wy1, z + dir * 0.014]);
      const e = 0.03;
      quad([-wx - e, wy0 - e, z + dir * 0.011], [wx + e, wy0 - e, z + dir * 0.011], [wx + e, wy1 + e, z + dir * 0.011], [-wx - e, wy1 + e, z + dir * 0.011], framePos);
    };
    endGlass(zP, 1);
    if (winCfg.rear) endGlass(zR, -1);
    // Destination sign above the windshield.
    const signW = glassW * 0.7;
    box(signW + 0.04, 0.13, 0.03, 0, bandTop - 0.1, zP, dark, 'sign-back');
    box(signW, 0.09, 0.02, 0, bandTop - 0.1, zP + 0.02, mat(snap('#ffc044')), 'sign');
    // Two-leaf door on the kerb (-x) side, in the front overhang ahead of the front axle.
    const doorY0 = sk + 0.02;
    for (const dz of [-0.44, 0.44]) box(W, bandH, 0.08, 0, bandMid, doorZ + dz, mat(pillarHex), 'pillar');
    box(0.02, bandTop - doorY0, 0.76, -Wb / 2, (doorY0 + bandTop) / 2, doorZ, dark, 'door-frame');
    const inner = bandTop - doorY0 - 0.08;
    const iy0 = doorY0 + 0.04;
    const lowH = inner * 0.4;
    for (const dz of [-0.185, 0.185]) {
      box(0.014, lowH, 0.34, -(Wb / 2 + 0.012), iy0 + lowH / 2, doorZ + dz, paint, 'door-leaf');
      const gx = -(Wb / 2 + 0.02);
      const gy0 = iy0 + lowH + 0.02;
      const gy1 = iy0 + inner;
      quad([gx, gy0, doorZ + dz - 0.16], [gx, gy0, doorZ + dz + 0.16], [gx, gy1, doorZ + dz + 0.16], [gx, gy1, doorZ + dz - 0.16]);
    }
    const roofCol = roofHex || snap('#ffffff');
    add(extrudeProfile([[zR, bandTop], [zP, bandTop], [zP, top], [zR, top]], W, 0.05), pmat(roofCol), 'roof');
    box(0.9, 0.12, 1.3, 0, top + 0.06, zR + LsP * 0.3, mat(snap('#dcdce9')), 'roof-unit');
    roofInfo = { z0: zR + 0.3, z1: zP - 0.3, y: top, w: W * 0.7 };
  } else {
    const [hr0, cr0, rr0] = [hr, cr, rr];
    const zA = zF - hr0 * Ls;
    let zB = zA - cr0 * Ls;
    zB = Math.max(zB, zR);
    const cbase = Math.max(zA - zB, 0.4);
    let sf = T.sf * cbase;
    let sr = T.sr * cbase;
    if (sf + sr > cbase * 0.85) { const k = cbase * 0.85 / (sf + sr); sf *= k; sr *= k; }
    const cw = Wb - T.cwInset + 0.04;
    const base = belt - cb;
    const cabTop = type === 'box-truck' ? top - T.cabDrop : top;
    const roof = addCabin({ zA, zB: zA - cbase, sf, sr, base, cabTop, cw, panels: winCfg.sidePanels, rear: winCfg.rear });
    const zBc = zA - cbase;
    roofInfo = { z0: roof.z0, z1: roof.z1, y: cabTop, w: roof.cw };

    if (type === 'pickup') {
      if (has('cargo-box')) {
        cargoBox(zR, zBc - 0.02, belt, belt + 0.62, secHex, 'cargo-box');
        applied.push('cargo-box');
        if (has('open-bed')) skipped.push({ feature: 'open-bed', note: '與 cargo-box 衝突，只套用 cargo-box' });
      } else {
        addBed(zBc, 0.22);
        if (has('open-bed')) applied.push('open-bed');
      }
    } else if (type === 'box-truck') {
      if (has('cargo-box') || !has('open-bed')) {
        const cargoTop = top;
        cargoBox(zR, zBc - 0.03, belt, cargoTop, secHex, 'cargo-box');
        roofInfo = { z0: zR + 0.15, z1: zBc - 0.2, y: cargoTop, w: W * 0.8 };
        if (has('cargo-box')) applied.push('cargo-box');
        if (has('open-bed')) skipped.push({ feature: 'open-bed', note: '與 cargo-box 衝突，只套用 cargo-box' });
      } else {
        addBed(zBc - 0.03, 0.16);
        applied.push('open-bed');
      }
    }
  }

  if (winPos.length) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(winPos, 3));
    g.computeVertexNormals();
    add(g, mat(pal.window, true), 'windows');
  }
  if (framePos.length) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(framePos, 3));
    g.computeVertexNormals();
    add(g, mat(pal.skirt, true), 'window-frames');
  }

  // ----- roof / tail features -----
  const roofBox = (w, h, d, x, y, z, m, name) => box(w, h, d, x, y, z, m, name);
  if (has('roof-rack') && roofInfo && roofInfo.z1 - roofInfo.z0 > 0.3) {
    const { z0, z1, y, w } = roofInfo;
    const zc = (z0 + z1) / 2;
    const len = z1 - z0 - 0.1;
    const half = w / 2 - 0.12;
    for (const sx of [-1, 1]) roofBox(0.05, 0.06, len, sx * half, y + 0.03, zc, dark, 'rack-rail');
    for (const dz of [-len / 2 + 0.04, len / 2 - 0.04]) roofBox(half * 2 + 0.05, 0.05, 0.05, 0, y + 0.025, zc + dz, dark, 'rack-bar');
    applied.push('roof-rack');
  } else if (has('roof-rack')) {
    skipped.push({ feature: 'roof-rack', note: '車頂平面太短，放不下' });
  }
  if (has('roof-sign') && roofInfo && roofInfo.z1 - roofInfo.z0 > 0.2) {
    const zc = (roofInfo.z0 + roofInfo.z1) / 2;
    roofBox(0.34, 0.09, 0.16, 0, roofInfo.y + 0.045, zc, mat(secHex), 'roof-sign');
    applied.push('roof-sign');
  } else if (has('roof-sign')) {
    skipped.push({ feature: 'roof-sign', note: '車頂平面太短，放不下' });
  }
  if (has('stripe')) {
    // Side stripe on the lower body between the wheel arches.
    const z0 = Math.min(...axleZ) + Ra + 0.05;
    const z1 = Math.max(...axleZ) - Ra - 0.05;
    if (z1 - z0 > 0.3) {
      const yc = (yb + 0.2 + belt) / 2 + 0.04;
      for (const sx of [-1, 1]) box(0.012, 0.06, z1 - z0, sx * (Wb / 2 + 0.002), yc, (z0 + z1) / 2, mat(secHex), 'stripe');
      applied.push('stripe');
    } else {
      skipped.push({ feature: 'stripe', note: '兩軸之間太短，放不下' });
    }
  }
  if (spareOn) {
    const sr = Math.min(0.24, (belt - yb) / 2 - 0.02);
    const yc = (yb + belt) / 2 + 0.02;
    const tire = new THREE.CylinderGeometry(sr, sr, 0.1, 12);
    tire.rotateX(Math.PI / 2);
    tire.translate(0, yc, zR - 0.05);
    add(tire, mat(pal.tire), 'spare-wheel');
    const hub = new THREE.CylinderGeometry(sr * 0.5, sr * 0.5, 0.02, 10);
    hub.rotateX(Math.PI / 2);
    hub.translate(0, yc, zR - 0.108);
    add(hub, mat(pal.hub), 'spare-hub');
    applied.push('spare-wheel');
  }
  for (const f of ['cargo-box', 'open-bed']) {
    if (has(f) && !applied.includes(f) && !skipped.some(s => s.feature === f)) {
      skipped.push({ feature: f, note: `${f} 只適用於 pickup 與 box-truck` });
    }
  }

  for (const u of spec.unsupported || []) skipped.push({ feature: u.feature, note: u.note || '沒有對應零件' });

  // Vertical brightness gradient on painted meshes (vertex colours; GLB exports it as COLOR_0).
  if (style.gradient) {
    const { top: gTop, bottom: gBottom } = style.gradient;
    body.traverse(o => {
      if (!o.isMesh || !o.material.vertexColors) return;
      const p = o.geometry.attributes.position;
      const c = new Float32Array(p.count * 3);
      for (let i = 0; i < p.count; i++) {
        const v = gBottom + (gTop - gBottom) * clamp((p.getY(i) - yb) / (H - yb), 0, 1);
        c[i * 3] = c[i * 3 + 1] = c[i * 3 + 2] = v;
      }
      o.geometry.setAttribute('color', new THREE.BufferAttribute(c, 3));
    });
  }

  // ----- wheels -----
  const group = new THREE.Group();
  group.name = 'vehicle';
  group.add(body);
  const tw = wc.width;
  const seg = wc.segments;
  const wheelNodes = [];
  const tireMat = mat(pal.tire);
  const hubMat = mat(pal.hub);
  const centerMat = mat(snap('#dcdce9'));
  const geos = {};
  for (const sx of [-1, 1]) {
    const tire = new THREE.CylinderGeometry(R, R, tw, seg);
    tire.rotateZ(Math.PI / 2);
    tire.translate(sx * (tw / 2 - wc.inset), 0, 0);
    const outer = tw - wc.inset;
    const rim = new THREE.CylinderGeometry(R * 0.66, R * 0.66, 0.016, 12);
    rim.rotateZ(Math.PI / 2);
    rim.translate(sx * outer, 0, 0);
    const hub = new THREE.CylinderGeometry(R * 0.3, R * 0.3, 0.02, 10);
    hub.rotateZ(Math.PI / 2);
    hub.translate(sx * (outer + 0.004), 0, 0);
    geos[sx] = { tire, rim, hub };
  }
  axleZ.forEach((z, i) => {
    for (const sx of [-1, 1]) {
      const node = new THREE.Group();
      node.name = `wheel-${wheelNames[i]}-${sx > 0 ? 'left' : 'right'}`;
      node.position.set(sx * wheelX, R, z);
      for (const [geo, m, name] of [[geos[sx].tire, tireMat, 'tire'], [geos[sx].rim, hubMat, 'rim'], [geos[sx].hub, centerMat, 'hub']]) {
        const mesh = new THREE.Mesh(geo, m);
        mesh.name = name;
        mesh.castShadow = true;
        node.add(mesh);
      }
      group.add(node);
      wheelNodes.push(node);
    }
  });

  group.userData.rollWheels = distance => {
    const angle = distance / (R * group.scale.x);
    for (const w of wheelNodes) w.rotation.x = (w.rotation.x + angle) % (Math.PI * 2);
  };
  group.userData.headlightMaterial = headMat;
  group.userData.taillightMaterial = tailMat;

  // ----- report -----
  group.updateMatrixWorld(true);
  const bb = new THREE.Box3().setFromObject(group);
  const triangles = triangleCount(group);
  if (triangles > style.detail.maxTriangles) {
    approximated.push({ feature: 'detail', note: `三角形 ${triangles} 超過上限 ${style.detail.maxTriangles}` });
  }
  const report = {
    applied,
    approximated,
    skipped,
    dimensions: { width: r3(bb.max.x - bb.min.x), height: r3(bb.max.y - bb.min.y), length: r3(bb.max.z - bb.min.z) },
    triangles,
    colors: colorsReport
  };
  return { group, report };
}
