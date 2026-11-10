# stylized-3d 規格（最小版本：小鎮風格 × 載具）

最後更新：2026-11-10

## 目標

輸入一份小的規格 JSON（描述「是什麼車、什麼比例、什麼顏色、有哪些特徵」），以選定的風格輸出 3D 模型。外觀完全由風格決定：目標是像那個風格，不是像原圖。

本版只做一個類別（載具）與一種風格（`small-town`，對齊 Kenney Car Kit）。架構要讓之後加類別（建築、人物）與加風格（多一份風格檔）不必改既有程式。

## 硬性限制

- **純靜態、可部署 Cloudflare Pages**：Build output directory = `stylized-3d`，無建置步驟。網頁只能用相對路徑，不能讀取 `stylized-3d/` 以外的檔案。
- 網頁的 three.js 用 importmap 從 CDN 載入，版本與小鎮相同（`three@0.160.0`，jsdelivr）。
- 生成器是純函式，同一份檔案在瀏覽器與 Node 都能 import（只 `import * as THREE from 'three'`，不碰 DOM）。
- 命令列用的相依套件只裝在 `stylized-3d/package.json`（`three@0.160.0`），`node_modules/` 加進 `.gitignore`。網頁不需要 `npm install`。
- 不改 `small-town/` 的任何檔案（接進小鎮是之後的事）。
- 沒有後端，圖片不上傳。

## 檔案配置

```
stylized-3d/
  index.html            人用的網頁：表單、貼 JSON、即時預覽、下載
  app.js                網頁邏輯
  start.bat             本機起站（照 small-town/start.bat，port 8767）
  cli.mjs               命令列
  package.json
  generators/vehicle.js createVehicle(spec, style) → { group, report }
  styles/small-town.json
  schema/vehicle.schema.json
  schema/validate.js    validateSpec(spec) → { ok, errors }（瀏覽器與 Node 共用，不依賴套件）
  prompts/vehicle.md    給視覺模型的提示詞（看圖 → 只輸出 spec JSON）
  examples/             sedan.json、pickup.json、bus.json 等手寫規格
  compare.html          開發用：生成車與 Kenney 車並排（見「驗收」）
  tests/                node --test
```

## 規格 JSON

```json
{
  "category": "vehicle",
  "name": "紅色轎車",
  "bodyType": "sedan",
  "proportions": {
    "lengthToWidth": 2.6,
    "heightToWidth": 0.85,
    "hoodRatio": 0.28,
    "cabinRatio": 0.45,
    "rearRatio": 0.27
  },
  "colors": { "body": "#c0392b", "secondary": "#f2f0ea", "roof": null },
  "wheels": { "axles": 2, "sizeClass": "normal" },
  "windows": { "sidePanels": 2, "rear": true },
  "features": ["roof-sign"],
  "unsupported": [{ "feature": "車頂衝浪板", "note": "沒有對應零件" }]
}
```

| 欄位 | 允許值 | 說明 |
|---|---|---|
| `category` | `vehicle` | 必填 |
| `name` | 字串 | 選填，顯示用 |
| `bodyType` | `sedan` `hatchback` `suv` `van` `pickup` `box-truck` `bus` | 必填 |
| `proportions.lengthToWidth` | 1.5～8 | 真實比例，風格會再壓縮 |
| `proportions.heightToWidth` | 0.5～2 | 真實比例 |
| `hoodRatio` `cabinRatio` `rearRatio` | 各 0～1，總和約 1（容許 ±0.05，生成器自行正規化） | 引擎蓋／座艙／車尾各佔車長多少；`van`、`bus` 的引擎蓋可為 0 |
| `colors.body` | `#rrggbb` | 必填 |
| `colors.secondary` `colors.roof` | `#rrggbb` 或 `null` | 條紋、貨箱、車頂色 |
| `wheels.axles` | 2 或 3 | |
| `wheels.sizeClass` | `normal` `large` | |
| `windows.sidePanels` | 1～8 | 每側車窗片數 |
| `windows.rear` | 布林 | |
| `features` | `roof-rack` `roof-sign` `spare-wheel` `cargo-box` `open-bed` `stripe` 的子集 | |
| `unsupported` | `{feature, note}` 陣列 | 圖片裡有、但上面清單沒有的東西 |

`proportions`、`wheels`、`windows`、`features`、`unsupported` 都可省略；每個 `bodyType` 要有一組預設值。未知的欄位或不在清單內的值，`validateSpec` 要回報錯誤（指出欄位路徑與允許值）。

## 風格檔 `styles/small-town.json`

數值量自 `small-town/assets/car-kit` 的 GLB（單位與 Kenney 相同，小鎮以 0.2 縮放）。

```json
{
  "name": "small-town",
  "envelope": {
    "width": 1.5,
    "length": [2.5, 3.4],
    "height": [1.1, 1.8],
    "busLength": [5.0, 6.5],
    "busWidth": 1.6,
    "busHeight": [1.9, 2.2]
  },
  "bevel": 0.10,
  "wheel": { "radius": 0.30, "width": 0.35, "inset": 0.05, "largeRadius": 0.36, "flush": 0.015, "segments": 16 },
  "material": { "roughness": 0.9, "metalness": 0, "flatShading": true },
  "snapColors": true,
  "palette": {
    "body": ["#de433e", "#e74e3e", "#ff7e44", "#ffc044", "#ffc214", "#61cb8b", "#3da679", "#61c8af",
             "#6895d9", "#4e6dcd", "#a878e8", "#ff8aae", "#ffffff", "#dcdce9", "#868ba1", "#4f5260", "#38383d", "#b06041"],
    "window": "#d0e8ff",
    "skirt": "#4f5260",
    "tire": "#38383d",
    "hub": "#868ba1",
    "headlight": "#ffc044",
    "taillight": "#de433e"
  },
  "detail": { "maxTriangles": 3000 }
}
```

Kenney 實測（對齊用）：

| 車 | 寬 × 高 × 長 | 輪心 z（前／後） | 三角形 |
|---|---|---|---|
| sedan | 1.50 × 1.30 × 2.55 | ±0.66 | 2032 |
| suv | 1.50 × 1.30 × 2.70 | 0.76／-0.56 | 2474 |
| van | 1.50 × 1.35 × 2.75 | ±0.76 | 2082 |
| truck | 1.50 × 1.30 × 2.95 | 0.86／-0.76 | 2082 |
| delivery | 1.50 × 1.65 × 3.25 | 1.01／-0.61 | 2476 |

輪子：半徑 0.30、寬 0.40、輪心 (±0.30, 0.30, z)。輪徑約佔車高 46%，輪子縮在車身內側，這是風格的主要特徵。
外觀規則：方塊車身加倒角、深灰下緣與保險桿、近白淡藍色平面車窗、車燈是小方塊、純平塗無反光。參考 `small-town/assets/car-kit/Preview.png`。
公車沒有 Kenney 對應物，對齊 `small-town/main.js` 的 `makeBus`（長 1.3、寬 0.32 於小鎮尺度，即 6.5 × 1.6；白色車頂、整圈車窗帶、窗柱）。

## 生成器

`createVehicle(spec, style)` 回傳 `{ group, report }`。

- 座標：車頭朝 +z，y 向上，輪子著地於 y = 0，x 置中。與 Kenney 相同。
- **節點命名比照 Kenney**：`body`（一個節點，內含車身所有網格）、`wheel-front-left`、`wheel-front-right`、`wheel-back-left`、`wheel-back-right`（3 軸時加 `wheel-mid-left`／`wheel-mid-right`）。每個輪子是獨立節點，原點在輪心。這樣匯出的 GLB 之後能直接被小鎮的 `makeCar` 當成 Kenney 車使用。
- 車身：依 `bodyType` 與三段比例算出側面輪廓，沿車寬擠出並倒角。座艙比下車身略窄。
- 比例誇張：把真實比例對應進 `envelope`（轎車類長度夾在 2.5～3.4，公車用 `bus*`），不同車型在範圍內仍要有明顯差異。
- 顏色：`snapColors` 為真時，`colors.*` 取 `palette.body` 中最接近者。
- 同色的網格共用同一個材質物件。
- `group.userData`：`rollWheels(distance)`、`headlightMaterial`、`taillightMaterial`（比照 `small-town/vintage-sedan.js` 的介面）。
- 三角形總數 ≤ `detail.maxTriangles`。

`report`：

```json
{
  "applied": ["roof-sign"],
  "approximated": [{ "feature": "lengthToWidth", "note": "5.2 壓縮為車長 3.4" }],
  "skipped": [{ "feature": "車頂衝浪板", "note": "沒有對應零件" }],
  "dimensions": { "width": 1.5, "height": 1.3, "length": 2.7 },
  "triangles": 1840,
  "colors": { "body": { "requested": "#c0392b", "used": "#de433e" } }
}
```

不支援的東西一律進 `skipped`，生成不因此失敗。

## 網頁

- 左側表單（對應上表每個欄位，車型切換時載入該車型預設值）、右側即時 3D 預覽（可旋轉）。
- 「貼 JSON」區：貼上後跑 `validateSpec`，通過就填進表單並生成；不通過就列出錯誤。旁邊有按鈕複製 `prompts/vehicle.md` 的提示詞。
- 顯示 `report` 三類清單與尺寸、面數。
- 下載：`spec.json`、`.glb`。
- 介面文字用繁體中文。

## 命令列

```
node cli.mjs <spec.json> [--style small-town] [--out <資料夾>]
```

輸出 `<name>.glb` 與 `<name>.report.json`，並把 report 摘要印在終端機。規格不合法時列出錯誤、exit code 1。

## 驗收

程式檢查（`node --test`，實作者要跑過）：

1. `examples/` 每份規格通過 `validateSpec` 並成功生成。
2. 尺寸在 `envelope` 內；三角形 ≤ 3000；所有材質顏色都在風格調色盤內。
3. 節點命名符合上述清單；輪子著地（包圍盒 min.y ≈ 0）。
4. 壞規格（未知 bodyType、錯的顏色格式、未知 feature）被 `validateSpec` 擋下。
5. `unsupported` 的內容出現在 `report.skipped`。
6. 命令列產生的 GLB 能被 three 的 GLTFLoader 讀回，節點名稱還在。

人工檢查（由指揮者與使用者做）：`compare.html` 把 `examples/` 的生成車與 Kenney 的 sedan、truck、van 並排。這一頁會讀 `../small-town/assets/car-kit/`，只在本機從 repo 根目錄起站時能用，不屬於部署內容。

不使用 IoU 與原圖比對。
