// P1-C railway: a fixed rail line per level, arc-length trains, station
// stops and level crossings. The town level has no rail and never touches
// this module beyond a null check. All randomness here uses Math.random so
// the town's seeded rand() order is untouched.
import * as THREE from 'three';
import { TRAIN_TYPES, isValidTrainType, getApproachMinutes, getTripDuration, validateTimetable } from './atrain.js';

// Measured Kenney Train Kit 1.1 geometry, in model units:
// - railroad-straight spans z 0..4 (track x -0.35..0.35, bed y 0..0.1)
//   with the node origin one unit above the bed (translation y -1).
// - railroad-corner-small is a 90-degree arc of radius 2 about local
//   (-2, 0): interface A at (0, 0) heading +z, interface B at (-2, 2)
//   heading -x; same bed height and origin.
// - locomotive and carriage bodies run along z, front at +z, wheels at y 0.
export const RAIL_SCALE = 0.4; // a 4-long straight piece spans exactly CELL
export const RAIL_Y = 0.42; // bed base (model y -1) lands at 0.02
export const RAIL_TOP = 0.06; // rail top the train wheels sit on
export const TRAIN_SCALE = 0.3; // wheel track (+-0.49) lands on the rails
export const TRAIN_CRUISE = 2.0;
export const TRAIN_ACCEL = 0.8;
export const TRAIN_BRAKE = 2.5;
export const TRAIN_GAP = 0.12; // coupler gap between units
export const TRAIN_DWELL = 6; // real seconds stopped at the platform
export const GATE_WARN = 10; // gives passengers already inside time to clear
export const GATE_TIME = 1.2; // arm swing seconds each way
const EXT = 4; // straight approach past each map edge, inside the fog
const FIRST_TRAIN = [6, 12]; // game seconds until the first arrival

// ---------- rail line ----------

// The centre line through the rail cells in travel order: straight spans
// across straight cells and quarter arcs (radius CELL / 2 about the cell
// corner inside the turn) across corner cells, plus a straight approach
// past each map edge. Positions come from arc length, so units never cut
// corners. Pure: plain numbers, no scene.
export function buildRailLine(cells, cellSize) {
  if (!Array.isArray(cells) || cells.length < 2) return null;
  const half = cellSize / 2;
  const at = k => ({ x: cells[k][0] * cellSize, z: cells[k][1] * cellSize });
  const moves = [];
  for (let k = 0; k + 1 < cells.length; k++) {
    const dx = cells[k + 1][0] - cells[k][0];
    const dz = cells[k + 1][1] - cells[k][1];
    if (Math.abs(dx) + Math.abs(dz) !== 1) return null;
    moves.push({ x: dx, z: dz });
  }
  // Per cell: the travel heading in and out. Ends continue straight out.
  const turns = cells.map((_, k) => ({
    in: k === 0 ? moves[0] : moves[k - 1],
    out: k === cells.length - 1 ? moves[moves.length - 1] : moves[k],
  }));
  for (const t of turns) {
    const dot = t.in.x * t.out.x + t.in.z * t.out.z;
    if (dot !== 1 && dot !== 0) return null;
  }
  const segs = [];
  const push = s => {
    s.start = segs.length ? segs[segs.length - 1].start + segs[segs.length - 1].len : 0;
    segs.push(s);
  };
  const first = at(0);
  push({
    kind: 'line',
    ax: first.x - moves[0].x * (half + EXT), az: first.z - moves[0].z * (half + EXT),
    bx: first.x - moves[0].x * half, bz: first.z - moves[0].z * half,
    len: EXT,
  });
  const centers = new Map();
  cells.forEach(([i, j], k) => {
    const c = at(k);
    const { in: hIn, out: hOut } = turns[k];
    const pin = { x: c.x - hIn.x * half, z: c.z - hIn.z * half };
    const pout = { x: c.x + hOut.x * half, z: c.z + hOut.z * half };
    if (hIn.x === hOut.x && hIn.z === hOut.z) {
      push({ kind: 'line', ax: pin.x, az: pin.z, bx: pout.x, bz: pout.z, len: cellSize });
    } else {
      const cc = { x: c.x - hIn.x * half + hOut.x * half, z: c.z - hIn.z * half + hOut.z * half };
      const a0 = Math.atan2(pin.z - cc.z, pin.x - cc.x);
      const tPlus = { x: -Math.sin(a0), z: Math.cos(a0) };
      const sweep = (tPlus.x * hIn.x + tPlus.z * hIn.z) > 0 ? Math.PI / 2 : -Math.PI / 2;
      push({ kind: 'arc', cx: cc.x, cz: cc.z, r: half, a0, sweep, len: Math.abs(sweep) * half });
    }
    const last = segs[segs.length - 1];
    centers.set(`${i},${j}`, last.start + last.len / 2);
  });
  const end = at(cells.length - 1);
  const m = moves[moves.length - 1];
  push({
    kind: 'line',
    ax: end.x + m.x * half, az: end.z + m.z * half,
    bx: end.x + m.x * (half + EXT), bz: end.z + m.z * (half + EXT),
    len: EXT,
  });
  const length = segs[segs.length - 1].start + segs[segs.length - 1].len;
  return { segs, length, centers };
}

// Arc position to world point and unit tangent. Before the start or past
// the end (both straight approaches) it extrapolates along the end span.
export function pointAt(line, s) {
  const segs = line.segs;
  let g = segs[0];
  if (s <= 0) g = segs[0];
  else if (s >= line.length) g = segs[segs.length - 1];
  else g = segs.find(q => s < q.start + q.len) ?? segs[segs.length - 1];
  if (g.kind === 'line') {
    const d = Math.hypot(g.bx - g.ax, g.bz - g.az) || 1;
    const t = (s - g.start) / d;
    return {
      x: g.ax + (g.bx - g.ax) * t, z: g.az + (g.bz - g.az) * t,
      tx: (g.bx - g.ax) / d, tz: (g.bz - g.az) / d,
    };
  }
  const a = g.a0 + Math.sign(g.sweep) * (s - g.start) / g.r;
  const dir = Math.sign(g.sweep);
  return {
    x: g.cx + Math.cos(a) * g.r, z: g.cz + Math.sin(a) * g.r,
    tx: -Math.sin(a) * dir, tz: Math.cos(a) * dir,
  };
}

// Nearest arc position and lateral distance to a world point.
export function projectOnto(line, x, z) {
  let best = null;
  for (const g of line.segs) {
    let px, pz, s;
    if (g.kind === 'line') {
      const dx = g.bx - g.ax;
      const dz = g.bz - g.az;
      const d2 = dx * dx + dz * dz || 1;
      const t = THREE.MathUtils.clamp(((x - g.ax) * dx + (z - g.az) * dz) / d2, 0, 1);
      px = g.ax + dx * t;
      pz = g.az + dz * t;
      s = g.start + Math.sqrt(d2) * t;
    } else {
      const a = Math.atan2(z - g.cz, x - g.cx);
      const dir = Math.sign(g.sweep) || 1;
      const sweepAbs = Math.abs(g.sweep);
      let delta = a - g.a0;
      while (delta > Math.PI) delta -= Math.PI * 2;
      while (delta <= -Math.PI) delta += Math.PI * 2;
      const inside = dir > 0 ? (delta >= 0 && delta <= sweepAbs) : (delta <= 0 && delta >= -sweepAbs);
      if (inside) {
        px = g.cx + Math.cos(a) * g.r;
        pz = g.cz + Math.sin(a) * g.r;
        s = g.start + Math.abs(delta) * g.r;
      } else {
        const ax0 = g.cx + Math.cos(g.a0) * g.r;
        const az0 = g.cz + Math.sin(g.a0) * g.r;
        const a1 = g.a0 + g.sweep;
        const ax1 = g.cx + Math.cos(a1) * g.r;
        const az1 = g.cz + Math.sin(a1) * g.r;
        const d0 = (x - ax0) * (x - ax0) + (z - az0) * (z - az0);
        const d1 = (x - ax1) * (x - ax1) + (z - az1) * (z - az1);
        if (d0 <= d1) {
          px = ax0;
          pz = az0;
          s = g.start;
        } else {
          px = ax1;
          pz = az1;
          s = g.start + g.len;
        }
      }
    }
    const dist = Math.hypot(x - px, z - pz);
    if (!best || dist < best.d) best = { s, d: dist };
  }
  return best;
}

// ---------- railway ----------

// ctx: THREE scene helpers and live town state from main.js (no copies of
// its drive/path/person logic). Returns the live handle, or null when the
// rail data is unusable (then the town runs exactly as without rail).
export async function buildRail(ctx) {
  const def = ctx.LEVEL.rail;
  let line = def && buildRailLine(def.cells, ctx.CELL);
  if (!line) return null;
  const stationS = def.station ? line.centers.get(`${def.station.cell[0]},${def.station.cell[1]}`) ?? null : null;
  const names = Array.isArray(def.train) && def.train.length ? def.train
    : ['train-locomotive-passenger-a', 'train-carriage-wood', 'train-carriage-box'];
  const every = Array.isArray(def.every) && def.every[1] > def.every[0] ? def.every : [90, 240];
  // Optional express: every nth departure runs this set instead, faster,
  // straight through the station.
  const express = def.express && Array.isArray(def.express.train) && def.express.train.length ? def.express : null;
  const requestedOffset = Number(def.doubleTrack && def.doubleTrack.laneOffset);
  // Double track is intentionally limited to a straight horizontal corridor.
  // Other levels keep the original single-line route and geometry.
  const dualTrack = Number.isFinite(requestedOffset) && requestedOffset > 0
    && def.cells.every(([, j]) => j === def.cells[0][1]);
  const laneSpecs = dualTrack
    ? [
      { id: 'eastbound', direction: 1, zOffset: requestedOffset, cells: def.cells },
      { id: 'westbound', direction: -1, zOffset: -requestedOffset, cells: [...def.cells].reverse() },
    ]
    : [{ id: 'main', direction: 1, zOffset: 0, cells: def.cells }];
  const shiftLine = (route, zOffset) => {
    for (const seg of route.segs) {
      if (seg.kind === 'line') {
        seg.az += zOffset;
        seg.bz += zOffset;
      } else seg.cz += zOffset;
    }
    return route;
  };
  const directions = laneSpecs.map(spec => {
    const route = buildRailLine(spec.cells, ctx.CELL);
    if (!route) return null;
    const stationAt = def.station
      ? route.centers.get(def.station.cell[0] + ',' + def.station.cell[1]) ?? null
      : null;
    return {
      ...spec, line: shiftLine(route, spec.zOffset), stationS: stationAt,
      local: null, fast: null, train: null, departures: 0, lastGap: null,
      nextIn: FIRST_TRAIN[0] + Math.random() * (FIRST_TRAIN[1] - FIRST_TRAIN[0]),
    };
  });
  if (directions.some(d => !d)) return null;
  line = directions[0].line;

  // Track visuals: one straight or corner piece per cell, placed so the
  // model's own arc meets the centre line's arc. The EXT approaches past
  // each map edge (where trains enter/leave inside the fog) get minimal
  // straight pieces so a visible train always has rails under it.
  const cells = def.cells;
  for (const lane of directions) {
    const routeCells = lane.cells;
    for (let k = 0; k < routeCells.length; k++) {
      const [i, j] = routeCells[k];
      const x = i * ctx.CELL;
      const z = j * ctx.CELL + lane.zOffset;
      const prev = routeCells[Math.max(0, k - 1)];
      const next = routeCells[Math.min(routeCells.length - 1, k + 1)];
      const hIn = { x: i - prev[0], z: j - prev[1] };
      const hOut = { x: next[0] - i, z: next[1] - j };
      if (k === 0) Object.assign(hIn, hOut);
      if (k === routeCells.length - 1) Object.assign(hOut, hIn);
      const pin = { x: x - hIn.x * ctx.CELL / 2, z: z - hIn.z * ctx.CELL / 2 };
      if (hIn.x === hOut.x && hIn.z === hOut.z) {
        const obj = await ctx.place('train-kit', 'railroad-straight', {});
        obj.position.set(pin.x, RAIL_Y, pin.z);
        obj.rotation.y = Math.atan2(hIn.x, hIn.z);
        obj.scale.setScalar(RAIL_SCALE);
      } else {
        const cross = hIn.z * hOut.x - hIn.x * hOut.z;
        const rightTurn = cross < 0;
        const local = rightTurn ? { p: { x: 0, z: 0 }, h: { x: 0, z: 1 } } : { p: { x: -2, z: 2 }, h: { x: 1, z: 0 } };
        const th = Math.atan2(hIn.x, hIn.z) - Math.atan2(local.h.x, local.h.z);
        const c = Math.cos(th);
        const s = Math.sin(th);
        const obj = await ctx.place('train-kit', 'railroad-corner-small', {});
        obj.rotation.y = th;
        obj.scale.setScalar(RAIL_SCALE);
        obj.position.set(
          pin.x - RAIL_SCALE * (local.p.x * c + local.p.z * s), RAIL_Y,
          pin.z - RAIL_SCALE * (-local.p.x * s + local.p.z * c));
      }
    }
  }
  // Each train set: one head plus cars, built once and reused every run
  // so nothing is created per frame. Unit extents come from the loaded
  // models (front/rear allow an off-centre origin), keeping the set gap
  // between bodies through bends.
  async function buildSet(setNames, cruise, stops, laneStationS) {
    const units = [];
    if (!Array.isArray(setNames)) {
      setNames = TRAIN_TYPES.local.units;
    }
    for (const n of setNames) {
      const gltf = await ctx.model('train-kit', n);
      const obj = gltf.scene.clone(true);
      obj.traverse(o => { if (o.isMesh) o.castShadow = true; });
      const b = new THREE.Box3().setFromObject(obj);
      obj.scale.setScalar(TRAIN_SCALE);
      obj.visible = false;
      ctx.scene.add(obj);
      const front = b.max.z * TRAIN_SCALE;
      const rear = b.min.z * TRAIN_SCALE;
      units.push({ obj, len: front - rear, front, rear });
      // A pair of headlights on the lead unit's nose.
      if (!units[1] && ctx.headlight) {
        for (const x of [-0.6, 0.6]) {
          const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.14, 0.04), ctx.headlight);
          lamp.position.set(b.max.x * x, b.max.y * 0.3, b.max.z + 0.02);
          obj.add(lamp);
        }
      }
    }
    const offsets = [0];
    for (let k = 1; k < units.length; k++) offsets.push(offsets[k - 1] - units[k - 1].rear + units[k].front + TRAIN_GAP);
    const trainLen = units[0].front + offsets[offsets.length - 1] - units[units.length - 1].rear;
    // Where the lead unit's centre stops so the whole train sits centred on
    // the station cell, alongside the platform.
    const stopS = laneStationS === null || !stops ? null : laneStationS + trainLen / 2 - units[0].front;
    return { units, offsets, trainLen, stopS, cruise };
  }
  const isAtrain = !!ctx.LEVEL.atrain;
  const fleetMap = new Map();
  let maxTrainLen = 3.6;

  if (isAtrain) {
    const fleetData = (ctx.fleet || ctx.LEVEL.fleet || []).filter(f => f && typeof f === 'object');
    for (const f of fleetData) {
      const tdef = isValidTrainType(f.type) ? TRAIN_TYPES[f.type] : TRAIN_TYPES.local;
      const consist = await buildSet(tdef.units, TRAIN_CRUISE * tdef.speed, true, null);
      maxTrainLen = Math.max(maxTrainLen, consist.trainLen);
      fleetMap.set(f.id, {
        id: f.id,
        name: f.name || tdef.name,
        type: f.type,
        consist,
        at: 'west',
        busyUntil: -99999,
        run: null,
      });
    }
  } else {
    for (const lane of directions) {
      lane.local = await buildSet(names, TRAIN_CRUISE, true, lane.stationS);
      lane.fast = express ? await buildSet(express.train, TRAIN_CRUISE * (express.speed || 1), false, lane.stationS) : null;
      maxTrainLen = Math.max(maxTrainLen, lane.local.trainLen, lane.fast ? lane.fast.trainLen : 0);
    }
  }

  let timetable = [...(ctx.timetable || ctx.LEVEL.timetable || [])];
  let clockMinutes = ctx.clockMinutes !== undefined ? ctx.clockMinutes : 360;
  let opsDay = ctx.opsDay !== undefined ? ctx.opsDay : 0;
  const ranMap = new Map();
  ranMap.set(opsDay, new Map());
  const backhauls = [];
  const cancels = [];

  for (const lane of directions) {
    lane.waitingQueue = [];
  }

  function initSingleTrainPosition(train, startMinute) {
    const trips = timetable.filter(t => t.train === train.id);
    if (!trips.length) {
      train.at = 'west';
      train.busyUntil = -99999;
      return;
    }
    let best = null;
    let minDiff = Infinity;
    for (const t of trips) {
      const arr = opsDay * 1440 + (t.hour >= 6 ? t.hour : 24 + t.hour) * 60;
      let diff = arr - startMinute;
      while (diff < 0) diff += 1440;
      if (diff < minDiff) {
        minDiff = diff;
        best = t;
      }
    }
    train.at = (best && best.dir === 'east') ? 'west' : 'east';
    train.busyUntil = -99999;
  }

  function initFleetPositions(startMinute) {
    for (const train of fleetMap.values()) {
      initSingleTrainPosition(train, startMinute);
    }
    for (const targetDay of [opsDay, opsDay + 1]) {
      if (!ranMap.has(targetDay)) ranMap.set(targetDay, new Map());
      const dayRan = ranMap.get(targetDay);
      for (const t of timetable) {
        const trainObj = fleetMap.get(t.train);
        if (!trainObj) continue;
        const app = getApproachMinutes(trainObj.type, t.dir, t.stop);
        const arr = targetDay * 1440 + (t.hour >= 6 ? t.hour : 24 + t.hour) * 60;
        const entry = arr - app;
        const key = t.hour + '_' + t.dir;
        if (entry < startMinute && !dayRan.has(key)) {
          dayRan.set(key, 'missed');
        }
      }
    }
  }
  if (isAtrain) initFleetPositions(clockMinutes);

  // Keep the whole visible consist on track during its approach and exit.
  for (const lane of directions) {
    const route = lane.cells;
    const firstMove = { x: route[1][0] - route[0][0], z: route[1][1] - route[0][1] };
    const lastMove = { x: route[route.length - 1][0] - route[route.length - 2][0], z: route[route.length - 1][1] - route[route.length - 2][1] };
    const first = { x: route[0][0] * ctx.CELL, z: route[0][1] * ctx.CELL + lane.zOffset };
    const last = { x: route[route.length - 1][0] * ctx.CELL, z: route[route.length - 1][1] * ctx.CELL + lane.zOffset };
    const need = Math.ceil((EXT + maxTrainLen) / ctx.CELL);
    for (let q = 0; q < need; q++) {
      for (const [edge, mv] of [[first, firstMove], [last, lastMove]]) {
        const dir = edge === first ? -1 : 1;
        const cx = edge.x + mv.x * dir * (1 + q) * ctx.CELL;
        const cz = edge.z + mv.z * dir * (1 + q) * ctx.CELL;
        const obj = await ctx.place('train-kit', 'railroad-straight', {});
        obj.position.set(cx - mv.x * ctx.CELL / 2, RAIL_Y, cz - mv.z * ctx.CELL / 2);
        obj.rotation.y = Math.atan2(mv.x, mv.z);
        obj.scale.setScalar(RAIL_SCALE);
      }
    }
  }

  // Shared barrier look: one unit box geometry and three materials serve
  // every arm and post on every crossing.
  const unitBox = new THREE.BoxGeometry(1, 1, 1);
  const postMat = new THREE.MeshStandardMaterial({ color: 0x3a3d44, roughness: 0.6, metalness: 0.4 });
  const armRed = new THREE.MeshStandardMaterial({ color: 0xd2352b, roughness: 0.5 });
  const armWhite = new THREE.MeshStandardMaterial({ color: 0xf2f0ea, roughness: 0.5 });
  const bar = (w, h, d, mat, x, y, z, parent) => {
    const m = new THREE.Mesh(unitBox, mat);
    m.scale.set(w, h, d);
    m.position.set(x, y, z);
    m.castShadow = true;
    parent.add(m);
    return m;
  };
  const crossings = [];
  function launchAtrain(lane, trainObj, trip) {
    const { consist } = trainObj;
    const tdef = isValidTrainType(trainObj?.type) ? TRAIN_TYPES[trainObj.type] : TRAIN_TYPES.local;
    const cruise = TRAIN_CRUISE * tdef.speed;
    const stopS = trip.stop ? (lane.stationS + consist.trainLen / 2 - consist.units[0].front) : null;
    lane.train = {
      trainObj,
      trip,
      set: { ...consist, stopS, cruise },
      cruise,
      stopS,
      s: 0,
      speed: 0,
      dwelled: !trip.stop,
      waitT: 0,
    };
    trainObj.run = trip;
    for (const u of consist.units) u.obj.visible = true;
  }
  const rail = {
    line,
    units: directions[0].local?.units || [...fleetMap.values()][0]?.consist.units || [],
    crossings,
    fleet: fleetMap,
    directions: Object.fromEntries(directions.map(d => [d.id, d])),
    get train() { return directions[0].train; },
    set train(value) { directions[0].train = value; },
    get departures() { return directions[0].departures; },
    set departures(value) { directions[0].departures = value; },
    get lastGap() { return directions[0].lastGap; },
    set lastGap(value) { directions[0].lastGap = value; },
    get nextIn() { return directions[0].nextIn; },
    set nextIn(value) { directions[0].nextIn = value; },
    // A rail cell with a road tile on it is a crossing; painted or erased
    // roads (and undo) rebuild it through buildRoads. Barrier units sit on
    // the road approaches, posts clear of the lanes. Rebuilt from scratch
    // each time so a changed road direction re-aligns kept barriers.
    refreshCrossings() {
      const roadOf = (key, s) => {
        const node = ctx.roads.get(key);
        const p = pointAt(line, s);
        let road = { x: -p.tz, z: p.tx };
        if (node) {
          const sides = [...node.links.entries()].filter(([, to]) => to !== 'exit');
          const vec = side => {
            const [di, dj] = ctx.dirOf(side);
            return { x: di, z: dj };
          };
          const straight = sides.find(([a]) => sides.some(([b]) => b !== a && vec(a).x === -vec(b).x && vec(a).z === -vec(b).z));
          if (straight) road = vec(straight[0]);
        }
        const n = Math.hypot(road.x, road.z) || 1;
        return { x: road.x / n, z: road.z / n };
      };
      const keep = new Map(crossings.map(c => [c.key, { armT: c.armT, closed: c.closed }]));
      for (const c of crossings) {
        ctx.scene.remove(c.group);
        for (const e of c.posts) {
          const at = ctx.posts.indexOf(e);
          if (at >= 0) ctx.posts.splice(at, 1);
        }
      }
      crossings.length = 0;
      for (const [i, j] of cells) {
        const key = `${i},${j}`;
        if (ctx.tiles.get(key) !== 'road' || !ctx.roads.has(key)) continue;
        const x = i * ctx.CELL;
        const z = j * ctx.CELL;
        const sByDirection = Object.fromEntries(directions.map(d => [d.id, d.line.centers.get(key)]));
        const s = sByDirection[directions[0].id];
        const road = roadOf(key, s);
        const group = new THREE.Group();
        group.position.set(x, 0, z);
        ctx.scene.add(group);
        const arms = [];
        const barrierPosts = [];
        for (const end of [1, -1]) {
          const approach = { x: -road.x * end, z: -road.z * end };
          const right = { x: -approach.z, z: approach.x };
          const px = road.x * end * (ctx.CELL / 2 + 0.25) + right.x * 0.95;
          const pz = road.z * end * (ctx.CELL / 2 + 0.25) + right.z * 0.95;
          const post = bar(0.09, 0.5, 0.09, postMat, px, 0.25, pz, group);
          post.castShadow = true;
          const pivot = new THREE.Group();
          pivot.position.set(px, 0.48, pz);
          // Arms run along local +X: yaw it so +X points across the road
          // toward its centre (-right), not along +Z.
          pivot.rotation.y = Math.atan2(-right.x, -right.z) - Math.PI / 2;
          group.add(pivot);
          for (let q = 0; q < 6; q++) bar(0.26, 0.07, 0.05, q % 2 ? armWhite : armRed, 0.15 + q * 0.27, 0, 0, pivot);
          arms.push(pivot);
          barrierPosts.push(ctx.post(x + px, z + pz, 0.06));
        }
        const old = keep.get(key) ?? { closed: false, armT: 0 };
        for (const pivot of arms) pivot.rotation.z = (1 - old.armT) * 1.4;
        crossings.push({ key, x, z, s, sByDirection, rx: road.x, rz: road.z, group, arms, posts: barrierPosts, closed: old.closed, armT: old.armT });
      }
    },
    // Closed road nodes for Vehicle.drive's brake: the car stops ahead of
    // the node and never loses its other holders or queues.
    closedCells() {
      return crossings.filter(c => c.closed);
    },
    // A foot step into a closed crossing waits when its segment enters the
    // road-plus-sidewalk block; whoever is already inside walks off.
    // The block is oriented with the road: narrow along it (the rail gap)
    // and wide across it (road plus the sidewalks that cross the rails).
    // Routes never change.
    shouldWait(x0, z0, x1, z1) {
      const alongHalf = ctx.CELL / 2 + 0.05;
      const acrossHalf = ctx.CELL + 0.05;
      const toLocal = (c, x, z) => {
        const dx = x - c.x;
        const dz = z - c.z;
        return [dx * c.rx + dz * c.rz, dx * -c.rz + dz * c.rx];
      };
      const hits = (u0, v0, u1, v1) => {
        let t0 = 0;
        let t1 = 1;
        const dx = u1 - u0;
        const dy = v1 - v0;
        const ps = [-dx, dx, -dy, dy];
        const qs = [u0 + alongHalf, alongHalf - u0, v0 + acrossHalf, acrossHalf - v0];
        for (let i = 0; i < 4; i++) {
          const p = ps[i];
          const q = qs[i];
          if (Math.abs(p) < 1e-12) {
            if (q < 0) return false;
          } else {
            const t = q / p;
            if (p < 0) {
              if (t > t1) return false;
              if (t > t0) t0 = t;
            } else {
              if (t < t0) return false;
              if (t < t1) t1 = t;
            }
          }
        }
        return t0 <= t1;
      };
      for (const c of crossings) {
        if (!c.closed) continue;
        const [u0, v0] = toLocal(c, x0, z0);
        if (Math.abs(u0) <= alongHalf && Math.abs(v0) <= acrossHalf) continue;
        const [u1, v1] = toLocal(c, x1, z1);
        if (Math.abs(u1) <= alongHalf && Math.abs(v1) <= acrossHalf) return true;
        if (hits(u0, v0, u1, v1)) return true;
      }
      return false;
    },

    update(arg0, arg1, arg2, arg3) {
      if (!isAtrain) {
        let dt = arg0;
        let gameDt = arg1;
        let actNow = arg2;
        let playerPos = arg3;
        if (!Number.isFinite(dt) || dt < 0) dt = 0;
        if (!Number.isFinite(gameDt) || gameDt < 0) gameDt = 0;
        if (!gameDt) return;
        for (const lane of directions) {
          if (!lane.train) {
            lane.nextIn -= gameDt;
            if (lane.nextIn <= 0) {
              lane.departures++;
              const set = lane.fast && lane.departures % (express.every || 4) === 0 ? lane.fast : lane.local;
              lane.train = { set, s: 0, speed: 0, dwelled: set.stopS === null, waitT: 0 };
              for (const u of set.units) u.obj.visible = true;
            }
          }
          const t = lane.train;
          if (!t) continue;
          const { units, offsets, trainLen, stopS } = t.set;
          const nose = t.s + units[0].front;
          let target = t.set.cruise;
          if (!t.dwelled && stopS !== null && t.s < stopS + 0.5) {
            target = Math.min(target, t.s <= stopS ? Math.sqrt(Math.max(stopS - t.s, 0)) : 0);
          }
          if (playerPos) {
            const proj = projectOnto(lane.line, playerPos.x, playerPos.z);
            const blockRadius = dualTrack ? Math.max(0, requestedOffset - 0.02) : 0.5;
            const gap = proj.s - nose;
            if (proj.d < blockRadius && gap > -0.2) {
              const stop = Math.sqrt(Math.max(gap - 0.3, 0));
              if (gap < t.speed * t.speed / (2 * TRAIN_BRAKE) + 0.6) target = Math.min(target, stop);
            }
          }
          if (t.waitT > 0) {
            t.waitT -= dt;
            t.speed = 0;
          } else {
            t.speed += THREE.MathUtils.clamp(target - t.speed, -TRAIN_BRAKE * dt, TRAIN_ACCEL * dt);
            if (!Number.isFinite(t.speed) || t.speed < 0) t.speed = 0;
            t.s += t.speed * dt;
          }
          if (!t.dwelled && stopS !== null && Math.abs(t.s - stopS) < 0.06 && t.speed < 0.1) {
            t.s = stopS;
            t.speed = 0;
            t.dwelled = true;
            t.waitT = TRAIN_DWELL;
            if (ctx.onStationStop) ctx.onStationStop();
          }
          for (let k = 0; k < units.length; k++) {
            const q = pointAt(lane.line, t.s - offsets[k]);
            units[k].obj.position.set(q.x, RAIL_TOP, q.z);
            units[k].obj.rotation.y = Math.atan2(q.tx, q.tz);
          }
          const tail = t.s - (trainLen - units[0].front);
          if (tail > lane.line.length) {
            lane.train = null;
            for (const u of units) u.obj.visible = false;
            const a = Math.max(Number.isFinite(actNow) ? actNow : 1, 0.15);
            lane.lastGap = (every[0] + Math.random() * (every[1] - every[0])) / a;
            lane.nextIn = lane.lastGap;
          }
        }
        for (const c of crossings) {
          let shut = false;
          for (const lane of directions) {
            const t = lane.train;
            if (!t) continue;
            const { units, trainLen, cruise } = t.set;
            const nose = t.s + units[0].front;
            const tail = t.s - (trainLen - units[0].front);
            const crossingS = c.sByDirection[lane.id] ?? c.s;
            if (nose > crossingS - GATE_WARN * cruise / TRAIN_CRUISE
              && tail < crossingS + ctx.CELL / 2 + 0.05) {
              shut = true;
              break;
            }
          }
          c.closed = shut;
          c.armT = THREE.MathUtils.clamp(c.armT + (shut ? dt : -dt) / GATE_TIME, 0, 1);
          const lift = (1 - c.armT) * 1.4;
          for (const pivot of c.arms) pivot.rotation.z = lift;
        }
        return;
      }

      // Atrain mode
      const dt = Number.isFinite(arg0) && arg0 > 0 ? arg0 : 0;
      if (!dt) return;
      let playerPos = null;
      let extClock = undefined;
      let extDay = undefined;

      if (arg1 && typeof arg1.x === 'number') playerPos = arg1;
      else if (arg3 && typeof arg3.x === 'number') playerPos = arg3;

      if (typeof arg2 === 'number') extClock = arg2;
      if (typeof arg3 === 'number') extDay = arg3;

      if (extClock !== undefined && Number.isFinite(extClock)) {
        clockMinutes = extClock;
      } else {
        clockMinutes += dt;
      }
      if (extDay !== undefined && Number.isFinite(extDay)) {
        opsDay = extDay;
      }

      // Check timetable dispatch
      const validation = validateTimetable([...fleetMap.values()], timetable);
      for (const targetDay of [opsDay, opsDay + 1]) {
        if (!ranMap.has(targetDay)) ranMap.set(targetDay, new Map());
        const dayRan = ranMap.get(targetDay);
        const dayBase = targetDay * 1440;
        for (const t of timetable) {
          const tripKey = t.hour + '_' + t.dir;
          if (dayRan.has(tripKey)) continue;
          if (validation.errors.has(tripKey)) continue;

          const trainObj = fleetMap.get(t.train);
          if (!trainObj || !isValidTrainType(trainObj.type)) continue;

          const approach = getApproachMinutes(trainObj.type, t.dir, t.stop);
          const arrivalMinute = dayBase + (t.hour >= 6 ? t.hour : 24 + t.hour) * 60;
          const entryMinute = arrivalMinute - approach;

          if (clockMinutes >= entryMinute) {
            if (entryMinute < clockMinutes - Math.max(dt * 3, 2.0)) {
              dayRan.set(tripKey, 'missed');
              continue;
            }
            const lane = t.dir === 'east' ? directions[0] : directions[1];
            const isWaiting = lane.waitingQueue.some(q => q.trainObj.id === trainObj.id);

            // 1. Train busy running or in waiting queue -> cancel later trip
            if (trainObj.run !== null || isWaiting) {
              dayRan.set(tripKey, 'cancel');
              cancels.push({ day: targetDay, train: trainObj.id, hour: t.hour, dir: t.dir, type: 'cancel', reason: 'train_busy' });
              continue;
            }

            // 2. Check source end
            const reqSource = t.dir === 'east' ? 'west' : 'east';
            if (trainObj.at !== reqSource) {
              const idle = clockMinutes - trainObj.busyUntil;
              const backhaulDir = reqSource === 'west' ? 'west' : 'east';
              const dur = getTripDuration(trainObj.type, backhaulDir, false);
              if (idle >= dur) {
                // Backhaul off-map
                trainObj.at = reqSource;
                backhauls.push({ day: targetDay, train: trainObj.id, hour: t.hour, dir: t.dir, type: 'backhaul' });
                if (ctx.onTrainRun) ctx.onTrainRun('backhaul', trainObj.type);
              } else {
                dayRan.set(tripKey, 'cancel');
                cancels.push({ day: targetDay, train: trainObj.id, hour: t.hour, dir: t.dir, type: 'cancel', reason: 'not_idle_enough' });
                continue;
              }
            }

            // 3. Track exclusivity
            if (lane.train !== null) {
              lane.waitingQueue.push({ trainObj, trip: t, day: targetDay });
              trainObj.run = t;
              dayRan.set(tripKey, 'waiting');
              if (ctx.onTrainRun) ctx.onTrainRun(t.stop ? 'stop' : 'pass', trainObj.type);
            } else {
              launchAtrain(lane, trainObj, t);
              dayRan.set(tripKey, 'run');
              if (ctx.onTrainRun) ctx.onTrainRun(t.stop ? 'stop' : 'pass', trainObj.type);
            }
          }
        }
      }

      // Move active trains in both directions
      for (const lane of directions) {
        const t = lane.train;
        if (!t) continue;
        const { units, trainLen, stopS } = t.set;
        const nose = t.s + units[0].front;
        let target = t.cruise;
        if (!t.dwelled && stopS !== null && t.s < stopS + 0.5) {
          target = Math.min(target, t.s <= stopS ? Math.sqrt(Math.max(stopS - t.s, 0)) : 0);
        }
        if (playerPos) {
          const proj = projectOnto(lane.line, playerPos.x, playerPos.z);
          const blockRadius = dualTrack ? Math.max(0, requestedOffset - 0.02) : 0.5;
          const gap = proj.s - nose;
          if (proj.d < blockRadius && gap > -0.2) {
            const stop = Math.sqrt(Math.max(gap - 0.3, 0));
            if (gap < t.speed * t.speed / (2 * TRAIN_BRAKE) + 0.6) target = Math.min(target, stop);
          }
        }
        if (t.waitT > 0) {
          t.waitT -= dt;
          t.speed = 0;
        } else {
          t.speed += THREE.MathUtils.clamp(target - t.speed, -TRAIN_BRAKE * dt, TRAIN_ACCEL * dt);
          if (!Number.isFinite(t.speed) || t.speed < 0) t.speed = 0;
          t.s += t.speed * dt;
        }
        if (!t.dwelled && stopS !== null && Math.abs(t.s - stopS) < 0.06 && t.speed < 0.1) {
          t.s = stopS;
          t.speed = 0;
          t.dwelled = true;
          t.waitT = TRAIN_DWELL;
          if (ctx.onStationStop) ctx.onStationStop();
        }
        for (let k = 0; k < units.length; k++) {
          const q = pointAt(lane.line, t.s - t.set.offsets[k]);
          units[k].obj.position.set(q.x, RAIL_TOP, q.z);
          units[k].obj.rotation.y = Math.atan2(q.tx, q.tz);
        }
        const tail = t.s - (trainLen - units[0].front);
        if (tail > lane.line.length) {
          for (const u of units) u.obj.visible = false;
          t.trainObj.at = t.trip.dir === 'east' ? 'east' : 'west';
          t.trainObj.busyUntil = clockMinutes;
          t.trainObj.run = null;
          lane.train = null;
          if (lane.waitingQueue.length > 0) {
            const next = lane.waitingQueue.shift();
            launchAtrain(lane, next.trainObj, next.trip);
            const targetRan = ranMap.get(next.day) || currentRan;
            targetRan.set(next.trip.hour + '_' + next.trip.dir, 'run');
          }
        }
      }

      // Crossing barriers
      for (const c of crossings) {
        let shut = false;
        for (const lane of directions) {
          const t = lane.train;
          if (!t) continue;
          const { units, trainLen } = t.set;
          const nose = t.s + units[0].front;
          const tail = t.s - (trainLen - units[0].front);
          const crossingS = c.sByDirection[lane.id] ?? c.s;
          if (nose > crossingS - GATE_WARN * t.cruise / TRAIN_CRUISE
            && tail < crossingS + ctx.CELL / 2 + 0.05) {
            shut = true;
            break;
          }
        }
        c.closed = shut;
        c.armT = THREE.MathUtils.clamp(c.armT + (shut ? dt : -dt) / GATE_TIME, 0, 1);
        const lift = (1 - c.armT) * 1.4;
        for (const pivot of c.arms) pivot.rotation.z = lift;
      }
    },
    seek(targetMinutes) {
      if (!isAtrain) return;
      for (const lane of directions) {
        if (lane.train) {
          const t = lane.train;
          for (const u of t.set.units) u.obj.visible = false;
          t.trainObj.at = t.trip.dir === 'east' ? 'east' : 'west';
          t.trainObj.busyUntil = targetMinutes;
          t.trainObj.run = null;
          lane.train = null;
        }
        for (const q of lane.waitingQueue) {
          q.trainObj.run = null;
        }
        lane.waitingQueue.length = 0;
      }
      if (targetMinutes > clockMinutes) {
        for (const targetDay of [opsDay, opsDay + 1]) {
          if (!ranMap.has(targetDay)) ranMap.set(targetDay, new Map());
          const dayRan = ranMap.get(targetDay);
          const dayBase = targetDay * 1440;
          for (const t of timetable) {
            const tripKey = t.hour + '_' + t.dir;
            if (dayRan.has(tripKey)) continue;
            const trainObj = fleetMap.get(t.train);
            if (!trainObj) continue;
            const approach = getApproachMinutes(trainObj.type, t.dir, t.stop);
            const arrivalMinute = dayBase + (t.hour >= 6 ? t.hour : 24 + t.hour) * 60;
            const entryMinute = arrivalMinute - approach;
            if (entryMinute >= clockMinutes && entryMinute < targetMinutes) {
              dayRan.set(tripKey, 'missed');
            }
          }
        }
      }
      clockMinutes = targetMinutes;
    },
    clearDaily(newDay) {
      this.onSettlement(newDay);
    },
    onSettlement(newDay) {
      opsDay = newDay;
      if (!ranMap.has(newDay)) ranMap.set(newDay, new Map());
      for (const day of ranMap.keys()) {
        if (day < newDay - 1) ranMap.delete(day);
      }
    },
    async addTrain(trainData) {
      const tdef = isValidTrainType(trainData.type) ? TRAIN_TYPES[trainData.type] : TRAIN_TYPES.local;
      const consist = await buildSet(tdef.units, TRAIN_CRUISE * tdef.speed, true, null);
      const trainObj = {
        id: trainData.id,
        name: trainData.name,
        type: trainData.type,
        consist,
        at: 'west',
        busyUntil: -99999,
        run: null,
      };
      fleetMap.set(trainData.id, trainObj);
      initSingleTrainPosition(trainObj, clockMinutes);
      return trainObj;
    },
    removeTrain(trainId) {
      const trainObj = fleetMap.get(trainId);
      if (!trainObj) return;
      for (const lane of directions) {
        if (lane.train && lane.train.trainObj.id === trainId) {
          for (const u of lane.train.set.units) u.obj.visible = false;
          lane.train = null;
          if (lane.waitingQueue && lane.waitingQueue.length > 0) {
            const next = lane.waitingQueue.shift();
            launchAtrain(lane, next.trainObj, next.trip);
            const currentRan = ranMap.get(next.day) || ranMap.get(opsDay);
            if (currentRan) currentRan.set(next.trip.hour + '_' + next.trip.dir, 'run');
          }
        }
        if (lane.waitingQueue) lane.waitingQueue = lane.waitingQueue.filter(q => q.trainObj.id !== trainId);
      }
      for (const u of trainObj.consist.units) {
        ctx.scene.remove(u.obj);
      }
      fleetMap.delete(trainId);
      timetable = timetable.filter(t => t.train !== trainId);
    },
    renameTrain(trainId, newName) {
      const trainObj = fleetMap.get(trainId);
      if (trainObj) trainObj.name = newName;
    },
    setTimetable(newTimetable) {
      timetable = [...newTimetable];
      for (const t of fleetMap.values()) {
        if (t.busyUntil <= -90000 && t.run === null) {
          initSingleTrainPosition(t, clockMinutes);
        }
      }
      for (const targetDay of [opsDay, opsDay + 1]) {
        if (!ranMap.has(targetDay)) ranMap.set(targetDay, new Map());
        const dayRan = ranMap.get(targetDay);
        const dayBase = targetDay * 1440;
        for (const t of timetable) {
          const tripKey = t.hour + '_' + t.dir;
          if (dayRan.has(tripKey)) continue;
          const trainObj = fleetMap.get(t.train);
          if (!trainObj) continue;
          const approach = getApproachMinutes(trainObj.type, t.dir, t.stop);
          const arrivalMinute = dayBase + (t.hour >= 6 ? t.hour : 24 + t.hour) * 60;
          const entryMinute = arrivalMinute - approach;
          if (entryMinute < clockMinutes) {
            dayRan.set(tripKey, 'missed');
          }
        }
      }
    },
    snapshot() {
      if (isAtrain) {
        const fleetSnap = [...fleetMap.values()].map(t => ({
          id: t.id,
          name: t.name,
          type: t.type,
          at: t.at,
          busyUntil: t.busyUntil,
          run: t.run ? { hour: t.run.hour, dir: t.run.dir, stop: t.run.stop } : null,
          isWaiting: directions.some(d => d.waitingQueue.some(q => q.trainObj.id === t.id)),
        }));
        const snapshotDirection = lane => {
          const t = lane.train;
          const units = t ? t.set.units : null;
          return {
            active: !!t,
            s: t ? t.s : null,
            speed: t ? t.speed : null,
            dwelled: t ? t.dwelled : null,
            waitT: t ? t.waitT : null,
            nose: t && units[0] ? t.s + units[0].front : null,
            tail: t ? t.s - (t.set.trainLen - units[0].front) : null,
            lineLength: lane.line.length,
            stationS: lane.stationS,
            waitingCount: lane.waitingQueue.length,
            train: t ? { trainId: t.trainObj.id, hour: t.trip.hour, dir: t.trip.dir, stop: t.trip.stop } : null,
          };
        };
        const crossingSnapshots = crossings.map(c => ({
          key: c.key, x: c.x, z: c.z, s: c.s, sByDirection: c.sByDirection,
          closed: c.closed, armT: c.armT,
        }));
        const currentRan = {};
        for (const [day, map] of ranMap.entries()) {
          currentRan[day] = Object.fromEntries(map);
        }
        return {
          dualTrack: true,
          active: directions.some(d => !!d.train),
          fleet: fleetSnap,
          directions: Object.fromEntries(directions.map(d => [d.id, snapshotDirection(d)])),
          crossings: crossingSnapshots,
          ran: currentRan,
          backhauls: [...backhauls],
          cancels: [...cancels],
        };
      }
      const snapshotDirection = lane => {
        const t = lane.train;
        const set = t ? t.set : lane.local;
        const units = set ? set.units : [];
        const offsets = set ? set.offsets : [];
        const trainLen = set ? set.trainLen : 0;
        return {
          active: !!t,
          s: t ? t.s : null,
          speed: t ? t.speed : null,
          dwelled: t ? t.dwelled : null,
          waitT: t ? t.waitT : null,
          nose: t ? t.s + units[0].front : null,
          tail: t && units[0] ? t.s - (trainLen - units[0].front) : null,
          lineLength: lane.line.length,
          stationS: lane.stationS,
          express: t ? t.set === lane.fast : null,
          trainLen,
          unitS: t ? units.map((u, k) => t.s - offsets[k]) : [],
          departures: lane.departures,
          lastGap: lane.lastGap,
          nextIn: lane.nextIn,
        };
      };
      const crossingSnapshots = crossings.map(c => ({
        key: c.key, x: c.x, z: c.z, s: c.s, sByDirection: c.sByDirection,
        closed: c.closed, armT: c.armT,
      }));
      if (dualTrack) {
        return {
          dualTrack: true,
          active: directions.some(d => !!d.train),
          directions: Object.fromEntries(directions.map(d => [d.id, snapshotDirection(d)])),
          crossings: crossingSnapshots,
        };
      }
      return { ...snapshotDirection(directions[0]), crossings: crossingSnapshots };
    },
    debug() {
      return this.snapshot();
    },
  };
  // A plain platform slab east (or as sided) of the stopping cell: the
  // P1-D station building will replace this placeholder's looks.
  if (stationS !== null && def.station && !ctx.LEVEL.station) {
    const [si, sj] = def.station.cell;
    const p = pointAt(line, stationS);
    const side = def.station.side === 'west' ? { x: -1, z: 0 }
      : def.station.side === 'north' ? { x: 0, z: -1 }
      : def.station.side === 'south' ? { x: 0, z: 1 } : { x: 1, z: 0 };
    const slab = new THREE.Mesh(unitBox, new THREE.MeshStandardMaterial({ color: 0xb3ada3, roughness: 0.9 }));
    slab.scale.set(Math.abs(p.tx) > 0.5 ? 3.4 : 1.1, 0.12, Math.abs(p.tx) > 0.5 ? 1.1 : 3.4);
    slab.position.set(si * ctx.CELL + side.x * 0.9, 0.06, sj * ctx.CELL + side.z * 0.9);
    slab.receiveShadow = true;
    ctx.scene.add(slab);
  }
  rail.refreshCrossings();
  return rail;
}
