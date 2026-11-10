# stylized-3d：風格化 3D 生成器

填一份小規格（什麼車、什麼比例、什麼顏色、有哪些特徵），以選定的風格輸出 3D 模型。目標是像那個風格，不是還原原圖。

目前支援：類別「載具」（轎車、掀背、休旅、廂型、皮卡、貨車、公車）× 風格「small-town」（對齊 Kenney Car Kit）。

完整規格見 [SPEC.md](SPEC.md)。

## 三種用法

### 1. 網頁表單（不需要 AI）

執行 `start.bat`，瀏覽器開 `http://localhost:8767/`。選車型、調比例與顏色，右側即時預覽，可下載 `spec.json` 與 `.glb`。

### 2. 從圖片開始（任何有視覺能力的 AI）

1. 在網頁按「複製提示詞」（內容即 [prompts/vehicle.md](prompts/vehicle.md)）。
2. 把提示詞和車輛圖片一起交給 ChatGPT、Claude、Gemini 等。
3. 把它回傳的 JSON 貼進網頁的「貼 JSON」區，按「套用 JSON」。

圖片不會經過這個工具，只會進你自己選的 AI 服務。

### 3. 命令列（給 agent 或批次使用）

```
cd stylized-3d
npm install
node cli.mjs examples/sedan.json --style small-town --out out
```

輸出 `<檔名>.glb` 與 `<檔名>.report.json`。規格不合法時列出錯誤並以 exit code 1 結束。

Claude Code 使用者可把 [skill/SKILL.md](skill/SKILL.md) 複製到 `~/.claude/skills/stylize-3d/SKILL.md`，之後直接給圖片並說「做成小鎮風格的車」。

## 報告

每次生成都會回報三類：已套用的特徵、近似處理的項目（例如比例被壓進風格範圍）、略過的項目（規格裡 `unsupported` 列的、或該車型不適用的特徵）。不支援的東西不會讓生成失敗。

## 部署

純靜態、無建置步驟。Cloudflare Pages 的 Build output directory 設為 `stylized-3d` 即可。`compare.html` 是開發用的比對頁，會讀 `../small-town/` 的素材，部署後無法使用。

## 開發

```
node --test
```

加新風格：在 `styles/` 新增一份 JSON。加新類別：在 `generators/` 新增生成器，並在 `schema/` 補對應的檢查。

GLB 的節點命名比照 Kenney Car Kit（`body`、`wheel-front-left`…），可直接當成 Kenney 車使用。
