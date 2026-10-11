// 第 1 關「小鎮」的地圖資料（P1-A2：完整小鎮資料）。
// 網格格寬 CELL = 1.6，原點對齊大街（j = 0 即 z = 0，後街 j = -5 即 z = -8.0）。
// bounds 是地圖範圍＝可編輯範圍；邊緣的馬路格是車流出入口。
// paths 是不在網格上的步道（巷子，世界座標矩形）。
// rows 的 front 是建築正面的 z，facing 是朝向（+1 朝南，−1 朝北）。
import { RESIDENTS } from '../residents.js';

const BACK = -8.0;
const FRONTAGE = 1.6;
const MAIN_NORTH = { street: 0, front: -FRONTAGE, facing: 1 };
const MAIN_SOUTH = { street: 0, front: FRONTAGE, facing: -1 };
const BACK_SOUTH = { street: BACK, front: BACK + FRONTAGE, facing: -1 };
const BACK_NORTH = { street: BACK, front: BACK - FRONTAGE, facing: 1 };

const ALLEY_X = [-5.6, 5.6];
const ALLEY_HALF = 0.45;

const paths = ALLEY_X.flatMap(x => [
  [x - ALLEY_HALF, -6.4, x + ALLEY_HALF, -1.6],
  [x - ALLEY_HALF, 1.6, x + ALLEY_HALF, 8.5],
  [x - ALLEY_HALF, -12.6, x + ALLEY_HALF, -9.6],
]);

const zebras = [
  ...ALLEY_X.flatMap(x => [{ x, z: 0, w: ALLEY_HALF * 1.6, ns: false }, { x, z: BACK, w: ALLEY_HALF * 1.6, ns: false }]),
  { x: 0, z: 0, w: 0.6, ns: false },
];

const OUTER = [-6.6, -7.6, -8.6, -9.6, 6.6, 7.6, 8.6, 9.6];
const homes = [
  ...[-3.7, -4.65, 2.68, 3.67, 4.62, ...OUTER].map(x => ({ ...MAIN_NORTH, x })),
  ...[-4.55, -3.6, -2.6, -1.5, 0, 1.5, 2.5, 3.5, 4.55, ...OUTER].map(x => ({ ...BACK_SOUTH, x })),
  ...[-9.4, -10.9, 9.7, 11.2].map(x => ({ ...BACK_NORTH, x, villa: true })),
];

const shops = [
  { ...MAIN_NORTH, model: 'building-c', x: -1.72, name: '晨光咖啡', bg: '#3b2a20', fg: '#ffdca8', awning: 0xb8433a, glow: 1.4, closes: 22.5 },
  { ...MAIN_NORTH, model: 'building-a', x: -2.72, name: '小巷書店', bg: '#1f3b3a', fg: '#f3ead2', awning: 0x2f6b4f, glow: 1.2, closes: 21.5 },
  { ...MAIN_NORTH, model: 'building-h', x: 1.72, name: '便利商店', bg: '#f7f7f4', fg: '#1d6fd6', awning: 0x2c6fc4, glow: 1.8 },
  { ...BACK_NORTH, model: 'building-d', x: -4.55, name: '麥香麵包', bg: '#5a3a1e', fg: '#ffe7b0', awning: 0xd9822b, glow: 1.3, closes: 20 },
  { ...BACK_NORTH, model: 'building-b', x: -3.6, name: '小花園花店', bg: '#f4e8ef', fg: '#c0466e', awning: 0xe58fb0, glow: 1.0, closes: 19.5 },
  { ...BACK_NORTH, model: 'building-c', x: -2.6, name: '阿嬤早餐', bg: '#fff3c4', fg: '#8a4b00', awning: 0xf2c14e, glow: 1.2, closes: 13 },
  { ...BACK_NORTH, model: 'building-a', x: -1.5, name: '老街麵館', bg: '#7a1f1f', fg: '#fff1d6', awning: 0xb83a2e, glow: 1.5, closes: 21 },
  { ...BACK_NORTH, model: 'building-h', x: 1.5, name: '安心藥局', bg: '#ffffff', fg: '#1f8a4c', awning: 0x2f9e5b, glow: 1.3, closes: 22 },
  { ...BACK_NORTH, model: 'building-f', x: 2.5, name: '泡泡洗衣', bg: '#dff3ff', fg: '#1f6fb2', awning: 0x5aa9e6, glow: 1.0 },
  { ...BACK_NORTH, model: 'building-g', x: 3.5, name: '拾光文具', bg: '#3d2f5c', fg: '#f3e6ff', awning: 0x7a5cc4, glow: 1.1, closes: 21 },
  { ...BACK_NORTH, model: 'building-d', x: 4.55, name: '甜甜手搖飲', bg: '#1f4d4a', fg: '#c9f2e6', awning: 0x2fb3a0, glow: 1.4, closes: 23 },
];

const civic = [
  { ...BACK_NORTH, model: 'building-j', x: -7.2, name: '鎮立小學', bg: '#f2efe6', fg: '#2f5d8a', glow: 0.5, closes: 18 },
  { ...BACK_NORTH, model: 'building-i', x: 6.75, name: '郵局', bg: '#1f7a3d', fg: '#ffffff', glow: 0.8, closes: 18.5 },
  { ...BACK_NORTH, model: 'building-l', x: 8.2, name: '仁心診所', bg: '#ffffff', fg: '#c62f2f', glow: 1.0, closes: 21 },
];

export default {
  id: 'town',
  name: '小鎮',
  blurb: '一條大街、旅館與公園的安靜小鎮。',
  preview: 'levels/town.jpg',
  bounds: [-18, 18, -7, 6],
  roads: [[-18, 0, 18, 0], [-18, -5, 18, -5]],
  walks: [],
  paths,
  zebras,
  bus: { from: [18, 0], stop: [1, 0], to: [-18, 0], riders: ['山嵐旅館', '便利商店'] },
  busStop: { x: 1.75, shelterX: 1.85, shelterZ: -1.0 },
  homes,
  shops,
  civic,
  hotel: { model: 'building-n', name: '山嵐旅館', bg: '#1d2440', fg: '#f5d58a' },
  park: { cz: 4.5, ring: 1.45, xHalf: 4.6, zMin: 1.95, zMax: 7.5, path: 0.34 },
  gas: { x: -8, z: 3.0 },
  parking: true,
  lamps: [
    { x: -3.3, z: -0.92, side: -1 }, { x: -1.25, z: -0.92, side: -1 }, { x: 2.75, z: -0.92, side: -1 },
    { x: 7.8, z: -0.92, side: -1 }, { x: -7.8, z: -0.92, side: -1 }, { x: -7.8, z: 0.92, side: 1 },
    { x: -2.3, z: 0.92, side: 1 }, { x: 1.3, z: 0.92, side: 1 }, { x: 4.8, z: 0.92, side: 1 },
    { x: 8, z: 0.92, side: 1 }, { x: -3.1, z: -7.08, side: 1 }, { x: 2.0, z: -7.08, side: 1 },
    { x: -1.1, z: -8.92, side: -1 }, { x: 3.1, z: -8.92, side: -1 }, { x: -10.15, z: -8.92, side: -1 },
    { x: 10.45, z: -8.92, side: -1 },
  ],
  residents: RESIDENTS,
  walkers: 20,
  strollers: 7,
  cats: [
    [-1.72, -2.1], [-2.72, -2.1], [1.72, -2.1], [0.45, -2.6], [2.5, -5.7],
    [-4.55, -10.1], [4.55, -10.1], [-7.2, -10.3], [8.2, -10.2],
    [1.85, -1.0], [0.2, -1.47], [-7.7, 3.0], [8.6, 2.35],
    [-5.6, -3.6], [5.6, -5.4], [0.53, 4.5], [-0.95, 4.75],
    [3.2, 8.1], [-6.5, 8.7], [-3.4, 6.1],
  ],
  wishes: true,
  rail: null,
  camera: { target: [0, 0.2, -2.2], position: [4, 12, 13] },
  view: { maxDistance: 40, fog: [20, 70], shadow: 16 },
  trees: [],
};
