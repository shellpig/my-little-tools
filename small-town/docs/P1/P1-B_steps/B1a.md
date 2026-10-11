# B1a — 新小鎮選單與 10 格存檔

- Scope：完整 P1-B；關卡卡片、640×360 town.jpg、10 格含快照存檔、舊三格遷移、帶關卡匯出入、重設及儲存失敗原子性。
- 契約：實作規格／開發設計方針／測試指南的 P1-B 章節及共通決策。
- 前置：d866c72（A1/A2/A3）。
- 起始：2026-10-11；OpenCode Muse Spark 1.3 via OpenCode CLI。
- 驗收：語法檢查、P1-B 全部必測／遷移／負向、12/20 第 1 關回歸、主控台無錯、完整 diff 審核。測試使用獨立瀏覽器 context，證據放 output/。
- 回合：2 回合；首回合 12:13 啟動，12:17 寫完自查腳本後輸出停滯超過 10 分鐘，12:28 結束該 worker；第二回合保留主程式並針對缺圖與審核問題收尾。
- 交付：main.js 匯入 LEVELS；switchGame 統一開始新關／讀檔／匯入／重設的原子寫入與 reload；takeShot 320×180 俯視 JPEG、finally 還原輔助物與 renderer target 並 dispose；readSlots 遷移舊三格；renderSlots 十格與快照；renderLevels 關卡卡片；匯出格式 version 2 帶 level。index.html 新入口／全螢幕選單／捲動面板與響應排版；town.js preview 與真實 640×360 town.jpg。
- 指揮者審核修正：退回 Muse 補預覽圖、快照 sRGB（原線性像素直接 JPEG 偏暗）、桌面面板 580px 與手機換行、舊 slots 遷移写失敗提示。移除新 reload 流程造成無呼叫者的舊 loadLayout，未改交通／找路／貓／許願／換裝。主程式由 Muse 修改，指揮者未自行改主要程式。
- 驗證：node --check main.js/town.js 與 git diff --check 通過；指揮者獨立執行完整功能 25/25、跨關卡 7/7、補測 9/9；第七格存讀與 undo 清空、十格重載／儲存用量、快照原始及顯示尺寸、編輯標記還原、匯出入／舊格式／未知關卡、舊三格遷移不動 game、slots 寫入失敗與四種 game 寫入失敗、取消操作、連拍幾何數稳定、1440/600/390 排版與遷移 quota 提示全部通過。跨關卡使用瀏覽器 route 注入暫時第二關，未加入正式資料。
- 回歸：12/20 基準與修正版截圖人工比對，地圖／建築／燈光無非預期變更；瀏覽器 pageerror 為空。一次測試碰到 CDN Failed to fetch，重跑完整範圍後成功，未為此改程式。
- 證據：output/p1-b-conductor-results.json、p1-b-multilevel-results.json、p1-b-edge-results.json；p1-b-menu-conductor.png、p1-b-slots-conductor.png、p1-b-shot-conductor.jpg、p1-b-regression-12.png／20.png、p1-b-width-390.png／600.png／1440.png。腳本及截圖不提交。
- 未解／下一步：無 P1-B 阻擋問題；正式關卡仍只有小鎮，車站留待 P1-D。使用者已授權 commit/push；下一步 P1-C。三份 Phase 契約未改。
- 驗證 commit：本紀錄所屬的 P1-B 功能提交（驗證完成後提交，未重跑測試）。
