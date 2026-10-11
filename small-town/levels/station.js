// 第 2 關「火車站」的地圖資料（P1-D）。
// 網格格寬 CELL = 1.6，原點對齊大街（j = 0 即 z = 0，後街 j = -5 即 z = -8.0）。
// 鐵道在 j = 4（z = 6.4），東西向貫穿整張地圖；車站本體在鐵道北側（x = 0，z = 2.8），面向站前廣場與大街。
// 南北向馬路在 i = 8（x = 12.8），穿過鐵道在 [8, 4] 形成平交道。

const BACK = -8.0;
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
  { x: 12.8, z: -4.0, w: 0.8, ns: true },
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
  { x: -8.0, z: -8.92, side: -1 },
  { x: -4.0, z: -8.92, side: -1 },
  { x: 0, z: -8.92, side: -1 },
  { x: 4.0, z: -8.92, side: -1 },
  { x: 8.0, z: -8.92, side: -1 },
  { x: 16.0, z: -8.92, side: -1 },
  // 後街南側
  { x: -6.0, z: -7.08, side: 1 },
  { x: -2.0, z: -7.08, side: 1 },
  { x: 2.0, z: -7.08, side: 1 },
  { x: 6.0, z: -7.08, side: 1 },
  { x: 9.5, z: -7.08, side: 1 },
  { x: 16.0, z: -7.08, side: 1 },
  // 站前廣場
  { x: -2.5, z: 1.8, side: 1 },
  { x: 2.5, z: 1.8, side: 1 },
  // 南北向道路
  { x: 11.92, z: -2.0, side: -1 },
  { x: 11.92, z: 2.0, side: -1 },
];

const railCells = [];
for (let i = -18; i <= 18; i++) railCells.push([i, 4]);

export default {
  id: 'station',
  name: '火車站',
  blurb: '一條鐵道穿過小鎮，車站前就是旅館與商店街。',
  preview: 'levels/station.jpg',
  bounds: [-18, 18, -7, 6],
  roads: [
    [-18, 0, 18, 0],
    [-18, -5, 18, -5],
    [8, -5, 8, 6],
  ],
  walks: [[-2, 1, 2, 1]],
  paths: [],
  zebras,
  bus: { from: [18, 0], stop: [1, 0], to: [-18, 0], riders: ['站前旅館', '便利商店'] },
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
  view: { maxDistance: 100, fog: [70, 200], shadow: 32 },
  // 鐵道南側的樹（世界座標）。
  trees: [
    [-28.64, 8.26], [-28.37, 9.05], [-28.39, 9.81], [-27.5, 8.04], [-26.97, 8.95], [-27.11, 10.18],
    [-25.67, 8.92], [-25.05, 8.05], [-24.58, 8.97], [-23.57, 8.93], [-23.81, 10.07], [-22.53, 8.23],
    [-22.54, 9.22], [-21.15, 8.21], [-19.66, 8.05], [-19.82, 8.96], [-20.32, 10.07], [-17.46, 8.24],
    [-17.36, 10.18], [-16.29, 8.02], [-15.28, 10.07], [-14.03, 8.07], [-14.31, 9.21], [-14.18, 9.96],
    [-12.84, 9.12], [-11.66, 9.94], [-10.63, 9.89], [-9.21, 8.24], [-9.55, 9.07], [-9.15, 10.18],
    [-7.92, 9.17], [-7.72, 10.11], [-6.87, 9.84], [-5.9, 8.98], [-5.71, 9.82], [-4.64, 8.04],
    [-4.73, 9.25], [-3.37, 8.14], [-3.46, 9.24], [-2.01, 8.03], [-2.11, 9.01], [-1.13, 8.38],
    [-1.05, 9.12], [-0.78, 10.19], [0.31, 9.87], [1.8, 9.03], [1.82, 10.19], [4.01, 9.04],
    [3.67, 9.91], [5.33, 8.38], [5.51, 9.3], [6.2, 8.09], [6.19, 9.15], [7.71, 9.22],
    [7.71, 10.16], [8.57, 10.12], [10.21, 8.39], [9.93, 9.28], [15.74, 8.06], [17.43, 8.39],
    [17.23, 9.85], [18.73, 8.26], [18.7, 9.07], [19.43, 9.02], [19.66, 9.9], [20.54, 8.36],
    [20.77, 9.13], [22.29, 8.2], [22.02, 8.91], [21.78, 9.8], [23.18, 9.19], [24.41, 8.22],
    [24.44, 9.9], [25.79, 8.2], [26.88, 9.1], [26.93, 9.98], [27.98, 8.38],
  ],
};
