# A3a — 鋪路 instancing＋人行道規則單一來源

- Scope：路片、人行道格、人行道條帶、路緣改用共用幾何＋InstancedMesh，重建時不再新建／遺漏幾何；畫面的人行道與找路的 `sidewalkRects()` 用同一套規則（review 第 3 點）。畫面與第 1 關一致。
- 依賴：P1-A2 工作樹。
- 驗收：第 1 關 t=12 截圖與基準（output/p1-a3-base-12.jpg）一致；連續重鋪 10 次 `renderer.info.memory.geometries` 不增加；draw calls 下降；鋪路、清除、undo、讀存檔、斑馬線、車流正常；主控台無錯。
- 起始：2026-10-11；worker OpenCode Muse 1.3。
- 交付（main.js）：`sidewalkRects()` 改回傳 `{r, side, x, z}`，`rebuildNav()` 取 `.r`、`paveSidewalks()` 由它畫條帶／轉角／路緣，刪除重複規則；共用 `paveBox` 單位方塊＋`paveBoxes()`（一組一個 InstancedMesh）、`clearPaving()`（只 dispose InstancedMesh）；`drawTiles()` 路片依（piece, glTF mesh）分組 instancing，刪除 `roadPiece()`；`queuePave()` 讓拖曳時每幀最多重鋪一次（只有 `paintAt` 呼叫）。
- worker 自查：無頭 Edge；重鋪 10 次幾何體 497→497；大地圖 draw calls 約 1154（舊 2137）；重鋪耗時第 1 關 0.4～0.5ms、2.5 倍地圖 4.5ms（舊 30～50ms）；walkGrid.cost 2072 格與舊規則完全相同；筆刷／清除／undo／讀檔無錯。
- 指揮者審核：diff 只動指定三處（sidewalkRects/rebuildNav、paving 繪製、paintAt），無越界、無 __dbg；NORTH 等常數只在函式內使用，無 TDZ 問題；node --check 通過；第 1 關 t=12 截圖（output/p1-a3a-12.jpg）與基準一致，主控台無錯。未修改。
- 未解：drawZebras 每次重畫仍新建並 dispose 幾何（不漏）；groundHeight 每次掃全部 tiles（範圍外）。
- 驗證 commit：未建立。
