// node cli.mjs <spec.json> [--style small-town] [--out <folder>]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { validateSpec } from './schema/validate.js';
import { createVehicle } from './generators/vehicle.js';

const here = path.dirname(fileURLToPath(import.meta.url));

// GLTFExporter wants FileReader (browser API); this is the smallest stand-in it needs.
globalThis.FileReader ??= class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(buf => { this.result = buf; this.onloadend?.(); });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then(buf => {
      this.result = `data:${blob.type || 'application/octet-stream'};base64,${Buffer.from(buf).toString('base64')}`;
      this.onloadend?.();
    });
  }
};

export async function exportGlb(group) {
  const saved = group.userData;
  group.userData = {}; // functions and materials must not leak into glTF extras
  try {
    return await new GLTFExporter().parseAsync(group, { binary: true });
  } finally {
    group.userData = saved;
  }
}

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

async function main(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--style') args.style = argv[++i];
    else if (argv[i] === '--out') args.out = argv[++i];
    else args._.push(argv[i]);
  }
  if (args._.length !== 1) fail('用法：node cli.mjs <spec.json> [--style small-town] [--out <資料夾>]');

  const specPath = path.resolve(args._[0]);
  let spec;
  try {
    spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  } catch (e) {
    fail(`讀不到或不是合法 JSON：${specPath}（${e.message}）`);
  }
  const styleName = args.style || 'small-town';
  const stylePath = path.join(here, 'styles', `${styleName}.json`);
  if (!fs.existsSync(stylePath)) fail(`找不到風格：${styleName}`);
  const style = JSON.parse(fs.readFileSync(stylePath, 'utf8'));

  const { ok, errors } = validateSpec(spec);
  if (!ok) {
    console.error('規格不合法：');
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }

  const { group, report } = createVehicle(spec, style);
  const glb = await exportGlb(group);

  const outDir = path.resolve(args.out || path.join(here, 'out'));
  fs.mkdirSync(outDir, { recursive: true });
  const base = path.basename(specPath, path.extname(specPath));
  const glbPath = path.join(outDir, `${base}.glb`);
  const reportPath = path.join(outDir, `${base}.report.json`);
  fs.writeFileSync(glbPath, Buffer.from(glb));
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  const d = report.dimensions;
  console.log(`${spec.name || base}（${spec.bodyType}，風格 ${styleName}）`);
  console.log(`  尺寸 ${d.width} × ${d.height} × ${d.length}，三角形 ${report.triangles}`);
  console.log(`  已套用：${report.applied.join(', ') || '（無）'}`);
  for (const a of report.approximated) console.log(`  近似：${a.feature} - ${a.note}`);
  for (const s of report.skipped) console.log(`  略過：${s.feature} - ${s.note}`);
  for (const [k, v] of Object.entries(report.colors)) console.log(`  顏色 ${k}：${v.requested} -> ${v.used}`);
  console.log(`  輸出：${glbPath}`);
  console.log(`  報告：${reportPath}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch(e => fail(e.stack || String(e)));
}
