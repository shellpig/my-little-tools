// Dependency-free spec validator, shared by the browser and Node.
export const BODY_TYPES = ['sedan', 'hatchback', 'suv', 'van', 'pickup', 'box-truck', 'bus'];
export const FEATURES = ['roof-rack', 'roof-sign', 'spare-wheel', 'cargo-box', 'open-bed', 'stripe'];
export const SIZE_CLASSES = ['normal', 'large'];

const HEX = /^#[0-9a-fA-F]{6}$/;
const isObj = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const list = a => a.map(v => JSON.stringify(v)).join(', ');

export function validateSpec(spec) {
  const errors = [];
  const err = (path, msg) => errors.push(`${path}：${msg}`);
  if (!isObj(spec)) return { ok: false, errors: ['spec：必須是物件'] };

  const unknownKeys = (obj, allowed, path) => {
    for (const k of Object.keys(obj)) {
      if (!allowed.includes(k)) err(path ? `${path}.${k}` : k, `未知欄位，允許：${allowed.join(', ')}`);
    }
  };
  const num = (obj, key, path, min, max) => {
    if (obj[key] === undefined) return;
    const v = obj[key];
    if (typeof v !== 'number' || !Number.isFinite(v) || v < min || v > max) {
      err(`${path}.${key}`, `必須是 ${min}～${max} 的數字（目前 ${JSON.stringify(v)}）`);
    }
  };
  const sub = (key, allowed) => {
    if (spec[key] === undefined) return null;
    if (!isObj(spec[key])) { err(key, '必須是物件'); return null; }
    unknownKeys(spec[key], allowed, key);
    return spec[key];
  };

  unknownKeys(spec, ['category', 'name', 'bodyType', 'proportions', 'colors', 'wheels', 'windows', 'features', 'unsupported']);

  if (spec.category !== 'vehicle') err('category', `必填，只能是 "vehicle"（目前 ${JSON.stringify(spec.category)}）`);
  if (spec.name !== undefined && typeof spec.name !== 'string') err('name', '必須是字串');
  if (!BODY_TYPES.includes(spec.bodyType)) err('bodyType', `必填，允許：${list(BODY_TYPES)}（目前 ${JSON.stringify(spec.bodyType)}）`);

  const p = sub('proportions', ['lengthToWidth', 'heightToWidth', 'hoodRatio', 'cabinRatio', 'rearRatio']);
  if (p) {
    num(p, 'lengthToWidth', 'proportions', 1.5, 8);
    num(p, 'heightToWidth', 'proportions', 0.5, 2);
    for (const k of ['hoodRatio', 'cabinRatio', 'rearRatio']) num(p, k, 'proportions', 0, 1);
    if (['hoodRatio', 'cabinRatio', 'rearRatio'].every(k => typeof p[k] === 'number')) {
      const sum = p.hoodRatio + p.cabinRatio + p.rearRatio;
      if (Math.abs(sum - 1) > 0.05) err('proportions', `hoodRatio + cabinRatio + rearRatio 總和須約為 1（±0.05），目前 ${sum.toFixed(3)}`);
    }
  }

  if (spec.colors === undefined) {
    err('colors', '必填，至少要有 colors.body');
  } else {
    const c = sub('colors', ['body', 'secondary', 'roof']);
    if (c) {
      if (typeof c.body !== 'string' || !HEX.test(c.body)) err('colors.body', `必填，格式 #rrggbb（目前 ${JSON.stringify(c.body)}）`);
      for (const k of ['secondary', 'roof']) {
        if (c[k] !== undefined && c[k] !== null && (typeof c[k] !== 'string' || !HEX.test(c[k]))) {
          err(`colors.${k}`, `格式 #rrggbb 或 null（目前 ${JSON.stringify(c[k])}）`);
        }
      }
    }
  }

  const w = sub('wheels', ['axles', 'sizeClass']);
  if (w) {
    if (w.axles !== undefined && ![2, 3].includes(w.axles)) err('wheels.axles', `允許：2, 3（目前 ${JSON.stringify(w.axles)}）`);
    if (w.sizeClass !== undefined && !SIZE_CLASSES.includes(w.sizeClass)) err('wheels.sizeClass', `允許：${list(SIZE_CLASSES)}（目前 ${JSON.stringify(w.sizeClass)}）`);
  }

  const win = sub('windows', ['sidePanels', 'rear']);
  if (win) {
    if (win.sidePanels !== undefined && !(Number.isInteger(win.sidePanels) && win.sidePanels >= 1 && win.sidePanels <= 8)) {
      err('windows.sidePanels', `必須是 1～8 的整數（目前 ${JSON.stringify(win.sidePanels)}）`);
    }
    if (win.rear !== undefined && typeof win.rear !== 'boolean') err('windows.rear', '必須是布林');
  }

  if (spec.features !== undefined) {
    if (!Array.isArray(spec.features)) {
      err('features', `必須是陣列，元素允許：${list(FEATURES)}`);
    } else {
      spec.features.forEach((f, i) => {
        if (!FEATURES.includes(f)) err(`features[${i}]`, `不在清單內，允許：${list(FEATURES)}（目前 ${JSON.stringify(f)}）`);
      });
    }
  }

  if (spec.unsupported !== undefined) {
    if (!Array.isArray(spec.unsupported)) {
      err('unsupported', '必須是 {feature, note} 陣列');
    } else {
      spec.unsupported.forEach((u, i) => {
        const path = `unsupported[${i}]`;
        if (!isObj(u)) return err(path, '必須是物件 {feature, note}');
        unknownKeys(u, ['feature', 'note'], path);
        if (typeof u.feature !== 'string' || !u.feature) err(`${path}.feature`, '必須是非空字串');
        if (u.note !== undefined && typeof u.note !== 'string') err(`${path}.note`, '必須是字串');
      });
    }
  }

  return { ok: errors.length === 0, errors };
}
