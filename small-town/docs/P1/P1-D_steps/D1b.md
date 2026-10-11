# D1b — 通勤客＋P1-D 全項驗收

- Scope：第 2 關不具名通勤客：車站門口與建築門口之間往返（A* 路線，行為同 Passenger），火車到站時一次產生數名；平交道停等沿用 P1-C。完成測試指南 P1-D 必測 1～7。
- 依賴：D1a。
- 驗收：測試指南 P1-D 1～7；第 1 關不出通勤客、回歸不變。
- 起始：2026-10-11；worker agy Gemini 3.8 Flash (High)。
- 回合紀錄：agy 第一輪 15:48 起，只完成 rail.js `ctx.onStationStop()` 與 station.js `commuters: 14`，之後約 10 分鐘無動靜、CPU 幾乎不動，判定卡住並結束；16:12 加接續說明重送，至 16:23 仍未改 main.js，結束。使用者指示改派 Claude subagent（Sonnet 5.5，medium effort）接手，沿用同一份 prompt。
- 交付（Sonnet 5.5 subagent）：main.js 新區段 commuters：`Commuter extends Passenger`（`reroute()`）、`commuterDoor()`、`spawnCommuter()`（上限 LEVEL.commuters、車站被刪則不產生、到不了就不產生）、`burstCommuters()`（rail 到站回呼，`ceil(6×activity×0.5~1)` 人、間隔 0.7 秒）、`updateCommuters()`（約 `10/activity` 秒一人、一半往車站）；`initRail` 傳 `onStationStop`；`Passenger` 記住 `to`；`settleTown` 讓通勤客重新找路；`frame()` 在 `LEVEL.commuters` 時呼叫。rail.js 與 station.js 為 agy 第一輪的兩處改動。
- worker 自查：選單兩卡片、車站在畫面中央；600× 5 實分鐘（約 50 遊戲小時）火車停站 7、平交道關閉 6、汽車停等 7、無非有限值、無卡死；通勤客白天 5.5／分、夜間 0.5／分，到站爆發白天 4～5、夜間 1；42 條路線 0.1 取樣無穿牆、無瞬移；南側人工通勤客在關閉的平交道前等最多約 12 秒後繼續；貓 0/5、無祝福區；編輯／散步／存檔正常，搬住宅後通勤客改走新路；實作規格第 2 節流程 11 步截圖；第 1 關 30 居民 104 段雜湊相同、無通勤客、無錯。600× 以外倍速與 P1-A2 必測 2～6 未自動化。
- 指揮者審核：diff 約 60 行、只動通勤客相關處，無 __dbg；activity 最小 0.05，不會除以 0；node --check 通過；瀏覽器載入第 2 關無錯。證據複製到 output/p1-d1b/。
- 新發現（可修可不修）：目的地建築被搬到門口找不到路時，該通勤客直接消失。
- 既有問題：行人路線可能在平交道以外的地方跨過鐵軌（測到 x≈10.9 平交道關閉時穿越）；本關通勤客不需過軌所以不影響 D1b。index.html 標頭文字「點噴水池可以許願」在第 2 關仍顯示。車廂模型只有木材車與貨箱車，客運列車看起來像貨車。
- 驗證 commit：未建立。
- 使用者追加（指揮者直接修改）：關卡 `view`（第 2 關鏡頭最遠 100、霧 70～200、陰影範圍 32；第 1 關維持 40／20～70／16）、地面 400×400；`plantTree()` 抽出共用，第 2 關鐵道南側 77 棵樹（`trees`）；Train Kit 加入 city／square／subway／double 電聯車與 passenger-b（含預覽），第 2 關列車改 square a＋b×2＋c；月台白底左右各延伸一格；rail.js `stopS` 讓整列車置中停靠（原本車頭對準車站格）。瀏覽器實測第 2 關拉遠、樹、停站置中（output/p1-d-platform-centred.jpg），第 1 關畫面不變、兩關無錯。
