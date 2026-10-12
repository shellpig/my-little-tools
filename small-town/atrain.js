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

export function createDefaultP2() {
  return {
    v: 1,
    day: 0,
    fleet: DEFAULT_FLEET.map(t => ({ ...t })),
    timetable: DEFAULT_TIMETABLE.map(t => ({ ...t })),
  };
}

export function normalizeP2(rawP2) {
  if (!rawP2 || typeof rawP2 !== 'object') {
    return createDefaultP2();
  }
  const out = { ...rawP2 };
  if (out.v === undefined) out.v = 1;
  if (typeof out.day !== 'number' || isNaN(out.day)) out.day = 0;
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
  return out;
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
