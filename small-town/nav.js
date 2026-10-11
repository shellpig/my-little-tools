// P1-A2 half-grid pedestrian navigation (pure: no THREE, no DOM).
//
// The walk grid covers LEVEL.bounds in HALF cells (HALF = 0.8 = sidewalk
// width, aligned to the same origin as CELL). Each half cell costs 1 on
// sidewalks, walk tiles, paths and zebra crossings, 25 on other road cells
// (temporary crossing), and is blocked on solids, outside the map or grass.
export const HALF = 0.8;
const SQRT2 = Math.SQRT2;

export function halfRange(bounds) {
  const [iMin, iMax, jMin, jMax] = bounds;
  const hi0 = 2 * iMin - 1;
  const hi1 = 2 * iMax;
  const hj0 = 2 * jMin - 1;
  const hj1 = 2 * jMax;
  return { hi0, hi1, hj0, hj1, cols: hi1 - hi0 + 1, rows: hj1 - hj0 + 1 };
}

const rectOverlap = (ax0, az0, ax1, az1, bx0, bz0, bx1, bz1) =>
  ax0 < bx1 && bx0 < ax1 && az0 < bz1 && bz0 < az1;

// Park paths: the ring, the entrance path and the cross paths. The ring is
// read a little wide so the 0.8 sampling always finds ring cells.
function parkWalk(park, x, z) {
  if (!park || Math.abs(x) > park.xHalf || z < park.zMin - HALF / 2 || z > park.zMax) return false;
  const r = Math.hypot(x, z - park.cz);
  return r < park.ring + 0.5
    || (Math.abs(x) < 0.45 && z < park.cz)
    || (Math.abs(z - park.cz) < 0.4);
}

export function buildWalkGrid({ bounds, roadCells, walkCells, sidewalkRects, paths, park, zebras, solids, roadHalf = 0.8 }) {
  const { hi0, hi1, hj0, hj1, cols, rows } = halfRange(bounds);
  const cost = new Uint8Array(cols * rows); // 0 blocked, 1 walk, 25 road
  const px = new Float32Array(cols * rows); // walk point: cell centre, or the
  const pz = new Float32Array(cols * rows); // clear part of a pinched connector
  const cellRects = cells => cells.map(([i, j]) => [i * 1.6 - 0.8, j * 1.6 - 0.8, i * 1.6 + 0.8, j * 1.6 + 0.8]);
  const roadRects = cellRects(roadCells);
  const walkRects = cellRects(walkCells);
  const zebraRects = zebras.map(zb => (zb.ns
    ? [zb.x - roadHalf, zb.z - zb.w / 2, zb.x + roadHalf, zb.z + zb.w / 2]
    : [zb.x - zb.w / 2, zb.z - roadHalf, zb.x + zb.w / 2, zb.z + roadHalf]));
  const pathRects = paths.map(([x0, z0, x1, z1]) =>
    [Math.min(x0, x1), Math.min(z0, z1), Math.max(x0, x1), Math.max(z0, z1)]);
  const blocks = solids.map(s => [s.minX + 0.02, s.minZ + 0.02, s.maxX - 0.02, s.maxZ - 0.02])
    .filter(s => s[0] < s[2] && s[1] < s[3]);
  const hits = (x0, z0, x1, z1, rects) => rects.some(r => rectOverlap(x0, z0, x1, z1, r[0], r[1], r[2], r[3]));
  // Narrow connectors (alleys, zebra crossings) must survive the 0.8
  // sampling even where a solid clips the cell's edge: walkable when the
  // cell's overlap with the connector is itself clear of solids, and the
  // walk point moves to the clear part's middle.
  const connector = (x0, z0, x1, z1, rects) => {
    for (const r of rects) {
      const ix0 = Math.max(x0, r[0]);
      const iz0 = Math.max(z0, r[1]);
      const ix1 = Math.min(x1, r[2]);
      const iz1 = Math.min(z1, r[3]);
      if (ix0 >= ix1 || iz0 >= iz1) continue;
      let pieces = [[ix0, iz0, ix1, iz1]];
      for (const s of blocks) {
        const next = [];
        for (const p of pieces) {
          if (!rectOverlap(p[0], p[1], p[2], p[3], s[0], s[1], s[2], s[3])) {
            next.push(p);
            continue;
          }
          if (s[0] > p[0]) next.push([p[0], p[1], Math.min(s[0], p[2]), p[3]]);
          if (s[2] < p[2]) next.push([Math.max(s[2], p[0]), p[1], p[2], p[3]]);
          if (s[1] > p[1]) next.push([Math.max(p[0], s[0]), p[1], Math.min(p[2], s[2]), Math.min(s[1], p[3])]);
          if (s[3] < p[3]) next.push([Math.max(p[0], s[0]), Math.max(s[3], p[1]), Math.min(p[2], s[2]), p[3]]);
        }
        pieces = next.filter(p => p[0] < p[2] && p[1] < p[3]);
        if (!pieces.length) break;
      }
      if (!pieces.length) continue;
      const best = pieces.reduce((a, b) =>
        (b[2] - b[0]) * (b[3] - b[1]) > (a[2] - a[0]) * (a[3] - a[1]) ? b : a);
      return [(best[0] + best[2]) / 2, (best[1] + best[3]) / 2];
    }
    return null;
  };
  for (let hj = hj0; hj <= hj1; hj++) {
    for (let hi = hi0; hi <= hi1; hi++) {
      const x0 = hi * HALF;
      const z0 = hj * HALF;
      const x1 = x0 + HALF;
      const z1 = z0 + HALF;
      const idx = (hj - hj0) * cols + (hi - hi0);
      px[idx] = (x0 + x1) / 2;
      pz[idx] = (z0 + z1) / 2;
      const blocked = hits(x0, z0, x1, z1, blocks);
      const onRoad = roadRects.some(r => px[idx] > r[0] && px[idx] < r[2] && pz[idx] > r[1] && pz[idx] < r[3]);
      if (!blocked && !onRoad && (hits(x0, z0, x1, z1, walkRects) || hits(x0, z0, x1, z1, sidewalkRects)
        || parkWalk(park, (x0 + x1) / 2, (z0 + z1) / 2))) {
        cost[idx] = 1;
        continue;
      }
      const clear = connector(x0, z0, x1, z1, [...zebraRects, ...(onRoad ? [] : pathRects)]);
      if (clear) {
        cost[idx] = 1;
        if (blocked) {
          px[idx] = clear[0];
          pz[idx] = clear[1];
        }
        continue;
      }
      if (!blocked && onRoad) cost[idx] = 25;
    }
  }
  return { hi0, hi1, hj0, hj1, cols, rows, cost, px, pz };
}

// Walkable cells near a point, cheapest and nearest first. The reported
// point is the cell's walk point (its middle, or the clear part of a
// pinched connector).
export function snapCandidates(grid, x, z, maxDist = 4) {
  const out = [];
  const { hi0, hi1, hj0, hj1, cols, cost, px, pz } = grid;
  const r = Math.ceil(maxDist / HALF);
  const hiC = Math.floor(x / HALF);
  const hjC = Math.floor(z / HALF);
  for (let hj = Math.max(hj0, hjC - r); hj <= Math.min(hj1, hjC + r); hj++) {
    for (let hi = Math.max(hi0, hiC - r); hi <= Math.min(hi1, hiC + r); hi++) {
      const idx = (hj - hj0) * cols + (hi - hi0);
      const c = cost[idx];
      if (!c) continue;
      const cx = px[idx];
      const cz = pz[idx];
      const d = Math.hypot(cx - x, cz - z);
      if (d <= maxDist) out.push({ hi, hj, x: cx, z: cz, d, road: c === 25 });
    }
  }
  out.sort((a, b) => (a.road - b.road) || (a.d - b.d));
  return out;
}

// A* on the grid: 8 directions, octile heuristic, no squeezing diagonally
// between two blocked cells. allowRoad=false treats cost-25 road cells as
// blocked (zebra-first pass); true lets them through at cost 25.
export function astar(grid, s, e, allowRoad) {
  const { hi0, hj0, cols, rows, cost } = grid;
  const at = (hi, hj) => cost[(hj - hj0) * cols + (hi - hi0)];
  const passable = (hi, hj) => {
    if (hi < grid.hi0 || hi > grid.hi1 || hj < grid.hj0 || hj > grid.hj1) return false;
    const c = at(hi, hj);
    return allowRoad ? c !== 0 : c === 1;
  };
  if (!passable(s.hi, s.hj) || !passable(e.hi, e.hj)) return null;
  const size = cols * rows;
  const g = new Float64Array(size).fill(Infinity);
  const came = new Int32Array(size).fill(-1);
  const closed = new Uint8Array(size);
  const si = (s.hj - hj0) * cols + (s.hi - hi0);
  const ei = (e.hj - hj0) * cols + (e.hi - hi0);
  const octile = (hi, hj) => {
    const dx = Math.abs(hi - e.hi);
    const dz = Math.abs(hj - e.hj);
    return Math.max(dx, dz) + (SQRT2 - 1) * Math.min(dx, dz);
  };
  // Small binary heap of [f, idx].
  const heap = [];
  const push = (f, idx) => {
    heap.push([f, idx]);
    for (let i = heap.length - 1; i > 0;) {
      const p = (i - 1) >> 1;
      if (heap[p][0] <= heap[i][0]) break;
      [heap[p], heap[i]] = [heap[i], heap[p]];
      i = p;
    }
  };
  const pop = () => {
    const top = heap[0];
    const last = heap.pop();
    if (heap.length) {
      heap[0] = last;
      for (let i = 0;;) {
        const l = i * 2 + 1;
        const r = l + 1;
        let m = i;
        if (l < heap.length && heap[l][0] < heap[m][0]) m = l;
        if (r < heap.length && heap[r][0] < heap[m][0]) m = r;
        if (m === i) break;
        [heap[m], heap[i]] = [heap[i], heap[m]];
        i = m;
      }
    }
    return top;
  };
  g[si] = 0;
  push(octile(s.hi, s.hj), si);
  const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  while (heap.length) {
    const [, cur] = pop();
    if (closed[cur]) continue;
    closed[cur] = 1;
    if (cur === ei) {
      const cells = [];
      let c = ei;
      while (c !== -1) {
        cells.push({ hi: hi0 + (c % cols), hj: hj0 + Math.floor(c / cols) });
        c = came[c];
      }
      return cells.reverse();
    }
    const chi = hi0 + (cur % cols);
    const chj = hj0 + Math.floor(cur / cols);
    for (const [di, dj] of DIRS) {
      const nhi = chi + di;
      const nhj = chj + dj;
      if (!passable(nhi, nhj)) continue;
      if (di && dj && (!passable(chi + di, chj) || !passable(chi, chj + dj))) continue;
      const ni = (nhj - hj0) * cols + (nhi - hi0);
      if (closed[ni]) continue;
      const step = (at(nhi, nhj) === 25 ? 25 : 1) * (di && dj ? SQRT2 : 1);
      const ng = g[cur] + step;
      if (ng < g[ni]) {
        g[ni] = ng;
        came[ni] = cur;
        push(ng + octile(nhi, nhj), ni);
      }
    }
  }
  return null;
}
