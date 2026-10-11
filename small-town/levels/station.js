// 第 2 關「火車站」的地圖資料（P1-D）。
// 網格格寬 CELL = 1.6，原點對齊大街（j = 0 即 z = 0，後街 j = -4 即 z = -6.4）。
// 鐵道在 j = 4（z = 6.4），東西向貫穿整張地圖；車站本體在鐵道北側（x = 0，z = 2.8），面向站前廣場與大街。
// 南北向馬路在 i = 8（x = 12.8），穿過鐵道在 [8, 4] 形成平交道。

const BACK = -6.4;
const FRONTAGE = 1.6;
const MAIN_NORTH = { street: 0, front: -FRONTAGE, facing: 1 };
const MAIN_SOUTH = { street: 0, front: FRONTAGE, facing: -1 };
const BACK_SOUTH = { street: BACK, front: BACK + FRONTAGE, facing: -1 };
const BACK_NORTH = { street: BACK, front: BACK - FRONTAGE, facing: 1 };

const shops = [
  { ...MAIN_NORTH, model: 'building-d', x: -3.7, name: '站前便當', bg: '#5a3a1e', fg: '#ffe7b0', awning: 0xd9822b, glow: 1.3, closes: 21 },
  { ...MAIN_NORTH, model: 'building-a', x: -2.72, name: '伴手禮', bg: '#7a1f1f', fg: '#fff1d6', awning: 0xb83a2e, glow: 1.2, closes: 21 },
  { ...MAIN_NORTH, model: 'building-c', x: -1.72, name: '車站咖啡', bg: '#3b2a20', fg: '#ffdca8', awning: 0x6e473b, glow: 1.4, closes: 22.5 },
  { ...MAIN_NORTH, model: 'building-h', x: 1.72, name: '便利商店', bg: '#f7f7f4', fg: '#1d6fd6', awning: 0x2c6fc4, glow: 1.8 },
  { ...MAIN_NORTH, model: 'building-b', x: 2.72, name: '麵包坊', bg: '#f4e8ef', fg: '#8a4b00', awning: 0xf2c14e, glow: 1.1, closes: 20 },
];

const homes = [
  // 大街北側（避開商店與旅館，避開南北向道路 i = 8 即 x 11.2..14.4）
  ...[-4.8, -5.8, -6.8, -7.8, -8.8, -9.8, -10.8].map(x => ({ ...MAIN_NORTH, x })),
  ...[3.8, 4.8, 5.8, 6.8, 7.8, 8.8, 9.8].map(x => ({ ...MAIN_NORTH, x })),
  ...[15.5, 16.5].map(x => ({ ...MAIN_NORTH, x })),

  // 大街南側（站前廣場在 x -4.0..4.0，住宅分佈於廣場兩側）
  ...[-4.8, -5.8, -6.8, -7.8, -8.8, -9.8, -10.8].map(x => ({ ...MAIN_SOUTH, x })),
  ...[4.8, 5.8, 6.8, 7.8, 8.8, 9.8].map(x => ({ ...MAIN_SOUTH, x })),
  ...[15.5, 16.5].map(x => ({ ...MAIN_SOUTH, x })),

  // 後街南側
  ...[-1.0, -2.0, -3.0, -4.0, -5.0, -6.0, -7.0, -8.0, -9.0, -10.0].map(x => ({ ...BACK_SOUTH, x })),
  ...[1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0].map(x => ({ ...BACK_SOUTH, x })),
  ...[15.5, 16.5].map(x => ({ ...BACK_SOUTH, x })),

  // 後街北側（外圍為別墅）
  ...[-1.0, -2.1, -3.2, -4.3, -5.4].map(x => ({ ...BACK_NORTH, x })),
  ...[-7.2, -8.8, -10.4].map(x => ({ ...BACK_NORTH, x, villa: true })),
  ...[1.0, 2.1, 3.2, 4.3, 5.4, 6.5, 7.6, 8.7].map(x => ({ ...BACK_NORTH, x })),
  ...[15.5, 17.1].map(x => ({ ...BACK_NORTH, x, villa: true })),
];

const zebras = [
  { x: 0, z: 0, w: 0.8, ns: false },
  { x: -2.2, z: 0, w: 0.8, ns: false },
  { x: 2.2, z: 0, w: 0.8, ns: false },
  { x: 0, z: BACK, w: 0.8, ns: false },
  { x: 12.8, z: -3.2, w: 0.8, ns: true },
  { x: 12.8, z: 2.0, w: 0.8, ns: true },
];

const lamps = [
  // 大街北側
  { x: -6.0, z: -0.92, side: -1 },
  { x: -3.3, z: -0.92, side: -1 },
  { x: -1.25, z: -0.92, side: -1 },
  { x: 2.75, z: -0.92, side: -1 },
  { x: 6.0, z: -0.92, side: -1 },
  { x: 9.5, z: -0.92, side: -1 },
  { x: 16.0, z: -0.92, side: -1 },
  // 大街南側
  { x: -6.0, z: 0.92, side: 1 },
  { x: 6.0, z: 0.92, side: 1 },
  { x: 9.5, z: 0.92, side: 1 },
  { x: 16.0, z: 0.92, side: 1 },
  // 後街北側
  { x: -8.0, z: -7.32, side: -1 },
  { x: -4.0, z: -7.32, side: -1 },
  { x: 0, z: -7.32, side: -1 },
  { x: 4.0, z: -7.32, side: -1 },
  { x: 8.0, z: -7.32, side: -1 },
  { x: 16.0, z: -7.32, side: -1 },
  // 後街南側
  { x: -6.0, z: -5.48, side: 1 },
  { x: -2.0, z: -5.48, side: 1 },
  { x: 2.0, z: -5.48, side: 1 },
  { x: 6.0, z: -5.48, side: 1 },
  { x: 9.5, z: -5.48, side: 1 },
  { x: 16.0, z: -5.48, side: 1 },
  // 站前廣場
  { x: -2.5, z: 1.8, side: 1 },
  { x: 2.5, z: 1.8, side: 1 },
  // 南北向道路
  { x: 11.92, z: -2.0, side: -1 },
  { x: 11.92, z: 2.0, side: -1 },
];

// 空地上的樹（世界座標），固定種子產生，每次載入都一樣。
// 離鎮中心越遠越密、越往南越密，再疊一層低頻雜訊讓樹成片、留出空地。
// 避開馬路與人行道、鐵道和鎮中心的建築。
const trees = (() => {
  let seed = 20261011;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const EDGE = 30 * 1.6;
  const CORE = [-12.5, 18.5, -12.5, 5.0]; // 建築集中的範圍
  const wave = (x, z) => (Math.sin(x * 0.21 + 1.3) + Math.sin(z * 0.17 - 0.7)
    + Math.sin((x + z) * 0.13 + 2.1) + Math.sin((x - z) * 0.09)) / 4;
  const blocked = (x, z) => Math.abs(z) < 2.2 || Math.abs(z - BACK) < 2.2 || Math.abs(x - 12.8) < 2.2
    || Math.abs(z - 6.4) < 1.6
    || (x > CORE[0] && x < CORE[1] && z > CORE[2] && z < CORE[3]);
  const out = [];
  for (let n = 0; n < 16000; n++) {
    const x = (rnd() * 2 - 1) * (EDGE - 0.6) - 0.8;
    const z = (rnd() * 2 - 1) * (EDGE - 0.6) - 0.8;
    if (blocked(x, z)) continue;
    const dx = Math.max(CORE[0] - x, 0, x - CORE[1]);
    const dz = Math.max(CORE[2] - z, 0, z - CORE[3]);
    const far = Math.min(Math.hypot(dx, dz) / 18, 1);
    const south = (z + EDGE) / (2 * EDGE);
    const clump = Math.min(Math.max((wave(x, z) + 0.15) / 0.6, 0), 1) ** 2;
    const chance = (0.012 + 0.05 * far) * (0.5 + south) + 0.35 * far * (0.4 + 0.8 * south) * clump;
    if (rnd() > chance) continue;
    if (out.some(([tx, tz]) => (tx - x) ** 2 + (tz - z) ** 2 < 1.1)) continue;
    out.push([+x.toFixed(2), +z.toFixed(2)]);
  }
  return out;
})();

const railCells = [];
for (let i = -30; i <= 29; i++) railCells.push([i, 4]);

export default {
  id: 'station',
  name: '火車站',
  blurb: '一條鐵道穿過小鎮，車站前就是旅館與商店街。',
  preview: 'levels/station.jpg',
  bounds: [-30, 29, -30, 29],
  roads: [
    [-30, 0, 29, 0],
    [-30, -4, 29, -4],
    [8, -30, 8, 29],
  ],
  walks: [[-2, 1, 2, 1]],
  paths: [],
  zebras,
  bus: { from: [29, 0], stop: [1, 0], to: [-30, 0], riders: ['站前旅館', '便利商店'] },
  busStop: { x: 1.75, shelterX: 1.85, shelterZ: -1.0 },
  homes,
  shops,
  civic: [],
  station: {
    model: 'building-k',
    name: '晴川站',
    x: 0,
    front: 2.8,
    facing: -1,
    bg: '#1b3835',
    fg: '#f5ead2',
  },
  hotel: { model: 'building-n', name: '站前旅館', bg: '#202f4a', fg: '#e8d5b5' },
  park: null,
  gas: null,
  parking: false,
  lamps,
  residents: [],
  commuters: 14,
  walkers: 14,
  strollers: 0,
  cats: [
    [1.0, 5.15],
    [-1.5, 1.6],
    [0.2, 3.3],
    [0.3, -2.2],
    [-2.72, -2.1],
  ],
  wishes: false,
  rail: {
    cells: railCells,
    station: { cell: [0, 4], side: 'north' },
    every: [90, 240],
    train: ['train-electric-square-a', 'train-electric-square-b', 'train-electric-square-b', 'train-electric-square-c'],
  },
  camera: { target: [0, 0.2, 3], position: [4, 12, 18.2] },
  // 模擬城市式玩法：鏡頭可以拉遠看整張地圖，霧淡、陰影範圍蓋住整張地圖。
  view: { maxDistance: 140, fog: [100, 260], shadow: 48 },
  trees,
};
