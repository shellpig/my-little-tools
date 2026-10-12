// Pure ES module for Light A-Train (P2-A): train types, state defaults,
// kinematics-derived timing, and circular timetable validation.
// No scene, DOM or storage dependencies.

export const TRAIN_TYPES = {
  local: {
    name: '普通電車',
    units: ['train-electric-square-a', 'train-electric-square-b', 'train-electric-square-b', 'train-electric-square-c'],
    speed: 1.0,
    price: 1000,
    seats: 120,
    leadFront: 0.405,
    trainLen: 3.48,
  },
  subway: {
    name: '區間快車',
    units: ['train-electric-subway-a', 'train-electric-subway-b', 'train-electric-subway-b', 'train-electric-subway-c'],
    speed: 1.2,
    price: 1200,
    seats: 150,
    leadFront: 0.390,
    trainLen: 3.48,
  },
  city: {
    name: '都會電車',
    units: ['train-electric-city-a', 'train-electric-city-b', 'train-electric-city-b', 'train-electric-city-c'],
    speed: 1.0,
    price: 1500,
    seats: 200,
    leadFront: 0.360,
    trainLen: 3.51,
  },
  retro: {
    name: '復古客車',
    units: ['train-locomotive-passenger-a', 'train-locomotive-passenger-b', 'train-locomotive-passenger-b'],
    speed: 0.8,
    price: 1800,
    seats: 80,
    tourism: 1.5,
    leadFront: 0.435,
    trainLen: 2.58,
  },
  express: {
    name: '雙層特急',
    units: ['train-electric-double-a', 'train-electric-double-b', 'train-electric-double-b', 'train-electric-double-c'],
    speed: 1.5,
    price: 2000,
    seats: 250,
    leadFront: 0.375,
    trainLen: 3.484,
  },
};

// Simulated kinematic timings (minutes) on the Station line (104.0 length,
// east center 52.8, west center 51.2, dwell 6 min, accel 0.8, brake 2.5):
// arr: time from track entry until nose reaches station center
// dur: time from track entry until train tail exits the map
export const TRAIN_TIMINGS = {
  local: {
    east: { stop: { arr: 27.68, dur: 63.84 }, pass: { arr: 27.45, dur: 54.79 } },
    west: { stop: { arr: 26.88, dur: 63.84 }, pass: { arr: 26.65, dur: 54.79 } },
  },
  subway: {
    east: { stop: { arr: 23.82, dur: 55.83 }, pass: { arr: 23.34, dur: 46.12 } },
    west: { stop: { arr: 23.15, dur: 55.82 }, pass: { arr: 22.67, dur: 46.12 } },
  },
  city: {
    east: { stop: { arr: 27.70, dur: 63.88 }, pass: { arr: 27.47, dur: 54.83 } },
    west: { stop: { arr: 26.90, dur: 63.88 }, pass: { arr: 26.67, dur: 54.83 } },
  },
  retro: {
    east: { stop: { arr: 33.86, dur: 75.75 }, pass: { arr: 33.73, dur: 67.34 } },
    west: { stop: { arr: 32.86, dur: 75.75 }, pass: { arr: 32.73, dur: 67.34 } },
  },
  express: {
    east: { stop: { arr: 20.29, dur: 48.25 }, pass: { arr: 19.35, dur: 37.58 } },
    west: { stop: { arr: 19.75, dur: 48.26 }, pass: { arr: 18.82, dur: 37.58 } },
  },
};

export function isValidTrainType(type) {
  return typeof type === 'string' && Object.prototype.hasOwnProperty.call(TRAIN_TYPES, type);
}

export function getApproachMinutes(typeKey, dir, stop) {
  if (!isValidTrainType(typeKey)) return 27.0;
  const t = TRAIN_TIMINGS[typeKey]?.[dir]?.[stop ? 'stop' : 'pass'];
  return t ? t.arr : 27.0;
}

export function getTripDuration(typeKey, dir, stop) {
  if (!isValidTrainType(typeKey)) return 60.0;
  const t = TRAIN_TIMINGS[typeKey]?.[dir]?.[stop ? 'stop' : 'pass'];
  return t ? t.dur : 60.0;
}

export const DEFAULT_FLEET = [
  { id: 't1', name: '普通 1 號', type: 'local' },
  { id: 't2', name: '普通 2 號', type: 'local' },
  { id: 't3', name: '特急 1 號', type: 'express' },
];

export const DEFAULT_TIMETABLE = [
  { train: 't1', dir: 'east', hour: 7, stop: true },
  { train: 't2', dir: 'west', hour: 9, stop: true },
  { train: 't3', dir: 'east', hour: 14, stop: false },
  { train: 't2', dir: 'east', hour: 18, stop: true },
  { train: 't1', dir: 'west', hour: 20, stop: true },
  { train: 't3', dir: 'west', hour: 21, stop: false },
];

export const BUS_PRICE = 100;
export const BUS_MAX = 4;
export const BUS_COLORS = {
  green: 0x2e8b74,
  red: 0xd9383a,
  blue: 0x2b7bbb,
  yellow: 0xf5b025,
  orange: 0xe66a28,
  purple: 0x8a4ebd,
  white: 0xe8ecef,
  gray: 0x6e7681,
};

// One bus every BUS_HEADWAY minutes, split across the buses, 06:00-23:00.
export const BUS_HEADWAY = 120;

export const FACILITIES = {
  apartment: {
    name: '公寓',
    group: 'earn',
    pack: 'commercial',
    models: ['building-skyscraper-a', 'building-skyscraper-b', 'building-skyscraper-d'],
    scale: 1.0,
    price: 300,
    pop: 40,
    daily: 3,
  },
  shop: {
    name: '商店',
    group: 'earn',
    pack: 'commercial',
    models: ['low-detail-building-wide-a', 'low-detail-building-wide-b'],
    scale: 1.4,
    price: 200,
    daily: pop => 2 * Math.max(1, pop / 300),
  },
  hotel: {
    name: '旅館',
    group: 'earn',
    pack: 'commercial',
    models: ['building-n'],
    scale: 0.7,
    price: 800,
    daily: 5,
    perStop: 0.5,
  },
  office: {
    name: '辦公大樓',
    group: 'earn',
    pack: 'commercial',
    models: ['building-skyscraper-c', 'building-skyscraper-e', 'building-j'],
    scale: 1.0,
    price: 1500,
    pop: 80,
    daily: 10,
  },
  factory: {
    name: '工廠',
    group: 'earn',
    pack: 'industrial',
    models: ['building-a', 'building-b', 'building-c'],
    scale: 0.8,
    price: 1000,
    daily: 8,
    radius: 6,
    growth: -2,
  },
  park: {
    name: '小公園',
    group: 'deco',
    pack: 'nature',
    compose: 'park',
    scale: 1.0,
    price: 100,
    radius: 6,
    growth: 2,
  },
  landmark: {
    name: '廣場地標',
    group: 'deco',
    pack: 'nature',
    models: ['statue_obelisk', 'statue_column'],
    scale: 2.5, // thin statues: sized by height, not footprint
    price: 150,
    radius: 8,
    growth: 2,
  },
  tower: {
    name: '水塔／風車',
    group: 'deco',
    pack: 'industrial',
    models: ['water-tower', 'windmill'],
    scale: 1.4,
    price: 80,
  },
  camp: {
    name: '露營區',
    group: 'deco',
    pack: 'nature',
    compose: 'camp',
    scale: 1.0,
    price: 120,
    daily: 1,
  },
  farm: {
    name: '農田',
    group: 'deco',
    pack: 'nature',
    compose: 'farm',
    models: ['crops_cornStageD', 'crops_wheatStageB'],
    scale: 1.0,
    price: 50,
  },
};

export function createDefaultP2() {
  return {
    v: 1,
    day: 0,
    money: 5000,
    unlimited: false,
    fleet: DEFAULT_FLEET.map(t => ({ ...t })),
    timetable: DEFAULT_TIMETABLE.map(t => ({ ...t })),
    buses: [{ color: 'green' }],
    ledger: [],
  };
}

export function normalizeP2(rawP2) {
  if (!rawP2 || typeof rawP2 !== 'object') {
    return createDefaultP2();
  }
  const out = { ...rawP2 };
  if (out.v === undefined) out.v = 1;
  if (typeof out.day !== 'number' || isNaN(out.day)) out.day = 0;
  if (typeof out.money !== 'number' || isNaN(out.money)) out.money = 5000;
  if (typeof out.unlimited !== 'boolean') out.unlimited = false;
  if (!Array.isArray(out.fleet)) {
    out.fleet = DEFAULT_FLEET.map(t => ({ ...t }));
  } else {
    out.fleet = out.fleet.filter(f => f && typeof f === 'object');
  }
  if (!Array.isArray(out.timetable)) {
    out.timetable = DEFAULT_TIMETABLE.map(t => ({ ...t }));
  } else {
    out.timetable = out.timetable.filter(t => t && typeof t === 'object');
  }
  if (!Array.isArray(out.buses)) {
    out.buses = [{ color: 'green' }];
  } else {
    out.buses = out.buses.filter(b => b && typeof b === 'object').map(b => ({
      color: (typeof b.color === 'string' && BUS_COLORS[b.color] !== undefined) ? b.color : 'green',
    }));
  }
  if (!Array.isArray(out.ledger)) {
    out.ledger = [];
  } else {
    out.ledger = out.ledger.filter(l => l && typeof l === 'object');
  }
  return out;
}

// ---------- daily settlement (P2-B) ----------

export const POP = { house: 4, villa: 3 };

// One day's ledger entry; the caller applies `balance` unless unlimited.
// Riders per stop are capped by seats, which keeps fare = riders / 4.
export function settle(state, counts, pop, kinds = []) {
  let rail = counts.passes * 15;
  let riders = 0;
  for (const type of counts.stops) {
    const { seats, tourism = 1 } = TRAIN_TYPES[type];
    rail += Math.min(pop / 10, seats / 4) * tourism;
    riders += Math.min(Math.round(pop * 0.4), seats);
  }
  let facilityIncome = 0;
  for (const kind of kinds) {
    const { daily = 0, perStop = 0 } = FACILITIES[kind];
    facilityIncome += (typeof daily === 'function' ? daily(pop) : daily) + perStop * counts.stops.length;
  }
  const busIncome = 3 * state.buses.length;
  const cost = 8 * (counts.runs + counts.backhauls) + state.buses.length;
  const balance = state.unlimited ? state.money : state.money + rail + busIncome + facilityIncome - cost;
  return { day: state.day, income: { rail, bus: busIncome, facility: facilityIncome }, cost, riders, balance };
}

// Validates the sequence of trips for a single train in a 24-hour circular timetable.
export function validateTrainTrips(trainType, trips) {
  if (!isValidTrainType(trainType)) return { valid: false, reason: '車型無效' };
  if (!Array.isArray(trips) || trips.length <= 1) return { valid: true };
  const validTrips = trips.filter(t => t && typeof t === 'object');
  if (validTrips.length <= 1) return { valid: true };
  const entries = validTrips.map(t => {
    const app = getApproachMinutes(trainType, t.dir, t.stop);
    const dur = getTripDuration(trainType, t.dir, t.stop);
    const entryMin = ((t.hour * 60 - app) % 1440 + 1440) % 1440;
    return { ...t, app, dur, entryMin };
  });
  entries.sort((a, b) => a.entryMin - b.entryMin);

  for (let i = 0; i < entries.length; i++) {
    const a = entries[i];
    const b = entries[(i + 1) % entries.length];
    const interval = (b.entryMin - a.entryMin + 1440) % 1440;
    if (interval === 0) {
      return { valid: false, reason: '班次時間重疊' };
    }
    if (a.dir !== b.dir) {
      if (interval < a.dur) {
        return {
          valid: false,
          reason: `間隔不足一趟（需 ${Math.ceil(a.dur)} 分，實際 ${Math.round(interval)} 分）`,
        };
      }
    } else {
      const oppDir = a.dir === 'east' ? 'west' : 'east';
      const backhaul = getTripDuration(trainType, oppDir, false);
      const need = a.dur + backhaul;
      if (interval < need) {
        return {
          valid: false,
          reason: `同方向間隔不足（含回送需 ${Math.ceil(need)} 分，實際 ${Math.round(interval)} 分）`,
        };
      }
    }
  }
  return { valid: true };
}

// Validates the entire timetable against fleet, returning an error Map keyed by "hour_dir".
export function validateTimetable(fleet, timetable) {
  const errors = new Map();
  if (!Array.isArray(timetable)) return { valid: true, errors };
  const safeFleet = (fleet || []).filter(f => f && typeof f === 'object');
  const fleetMap = new Map(safeFleet.map(f => [f.id, f]));

  // 1. Check basic parameters and detect duplicate cells
  const cellCounts = new Map();
  for (let i = 0; i < timetable.length; i++) {
    const t = timetable[i];
    if (!t || typeof t !== 'object') {
      errors.set(`invalid_${i}`, '班次格式無效');
      continue;
    }
    const key = `${t.hour}_${t.dir}`;
    cellCounts.set(key, (cellCounts.get(key) || 0) + 1);
  }

  for (let i = 0; i < timetable.length; i++) {
    const t = timetable[i];
    if (!t || typeof t !== 'object') continue;
    const key = `${t.hour}_${t.dir}`;
    if (cellCounts.get(key) > 1) {
      errors.set(key, '同方向同整點重複排班');
      continue;
    }
    if (!Number.isInteger(t.hour) || t.hour < 0 || t.hour > 23 || (t.dir !== 'east' && t.dir !== 'west')) {
      errors.set(key, '班次時間或方向無效');
      continue;
    }
    if (!fleetMap.has(t.train)) {
      errors.set(key, '指派車輛不存在');
      continue;
    }
    const f = fleetMap.get(t.train);
    if (!f || !isValidTrainType(f.type)) {
      errors.set(key, '指派車輛之車型不存在');
      continue;
    }
  }

  // 2. Check each train's circular interval feasibility
  const byTrain = new Map();
  for (const t of timetable) {
    if (!t || typeof t !== 'object') continue;
    if (errors.has(`${t.hour}_${t.dir}`)) continue;
    if (!byTrain.has(t.train)) byTrain.set(t.train, []);
    byTrain.get(t.train).push(t);
  }

  for (const [trainId, trips] of byTrain.entries()) {
    const f = fleetMap.get(trainId);
    if (!f || !isValidTrainType(f.type)) continue;
    const res = validateTrainTrips(f.type, trips);
    if (!res.valid) {
      for (const t of trips) {
        const key = `${t.hour}_${t.dir}`;
        if (!errors.has(key)) errors.set(key, res.reason);
      }
    }
  }

  return { valid: errors.size === 0, errors };
}

// Tests whether a proposed trip can be assigned to a cell without conflict.
export function canAssignTrain(fleet, timetable, hour, dir, trainId, stop) {
  const f = (fleet || []).find(item => item && item.id === trainId);
  if (!f) return { valid: false, reason: '找不到車輛' };
  if (!isValidTrainType(f.type)) return { valid: false, reason: '車型無效' };

  // Other trains on this cell?
  const other = (timetable || []).find(t => t && t.hour === hour && t.dir === dir && t.train !== trainId);
  if (other) return { valid: false, reason: '同整點該方向已有其他列車' };

  // Candidate trips for this train
  const remaining = (timetable || []).filter(t => t && t.train === trainId && !(t.hour === hour && t.dir === dir));
  const candidateTrips = [...remaining, { train: trainId, dir, hour, stop: !!stop }];

  return validateTrainTrips(f.type, candidateTrips);
}
