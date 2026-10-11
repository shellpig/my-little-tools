# C1a — 鐵道、火車與平交道

- Scope：完整 P1-C；只在第二關草稿驗證，第一關 rail 為空，P1-D 未開工。
- 契約：實作規格／開發設計方針／測試指南的 P1-C 與共通決策。
- 前置：2b164e8，已交付 P1-A/B 與 UI／預設時間／霧化調整。
- 起始：2026-10-11；OpenCode Muse Spark 1.3 via OpenCode CLI。
- 驗收：語法、模型接口与彎道尺度、C 全部 8 項、道路編輯／undo、無 station／rail、暫停倍速、第一關回歸、完整 diff 審核。獨立 browser context；證據 output/。
- 交付：rail.js 的 buildRailLine／pointAt／projectOnto／buildRail；main.js initRail、frame、buildRoads、行人與居民、Vehicle.drive、groundHeight、setTiles／paintAt 接線；town.js rail:null；必要 Train Kit GLB／紋理／預覽／授權。
- 初回合審核：已交 rail.js／main.js 接線與必要資源。獨立第二關草稿重現彎道投影、早開桿、柵欄朝向、行人區域／大步跨越、居民跨作息等待、區內汽車煞停、暫停、過站漏停及載入 walk 蓋鐵道問題；完整合併退回 Muse 修正。證據 output/p1-c-independent-audit-results.json；修正 prompt/log 為 opencode-muse-small-town-C1a-fix。第一關地圖按 id 比對、居民路線一致，無 train 素材请求／pageerror。
- 驗證 commit：本紀錄所屬的 P1-C 功能提交（完成驗收後提交，未重跑測試）。
- 回合與收尾：Muse 首回合主要實作；修正回合完成投影、車身前後範圍、軌道延伸、柵欄朝向／重建及人行道線段停等後遭服務限流，重試仍限流；使用者明確授權 Codex 收尾。
- Codex 修正：車尾清空以實際模型 front/rear 與道路半寬判斷；暫停不推進火車／班次／停站／柵欄；班次 gameDt=dt*speed（遊戲秒），行駛與停站用實秒，沿用車流速度風格。居民停等延後整份個人作息，跨段／午夜不瞬移，檢查實際路徑各段以免倍速漏過平交道，人工調時間與重規劃清掉延遲。車輛預先延伸路徑再檢查下一節點，已在交叉區者能駛離。setTiles 共用入口禁止 walk 蓋鐵道。軌道延伸覆蓋整列進出場，移除未使用常數。警示距離 4.5→10，避免原已在區內的 0.3 速度乘客與到站火車交疊（修正後碰撞樣本 0）。
- 驗證：node --check 三個 JS 與 git diff --check 通過；output/p1-c-independent-audit-results.json 13/13，p1c-verify1.json 13/13，p1-c-extra-results.json 17/17。涵蓋八種彎道與投影連續性、車廂間距、完整進出／停站／發車、EW／NS 柵欄、車流停止線與车尾清空、區內人物／汽車離開、人行道與大步進入、居民跨段／午夜續走、人工時間跳轉、彎道玩家停等／離開／後方不阻擋、道路移除／undo 與共用柵欄幾何及重建時保留動畫姿勢、60／600／3600 倍速、暫停、無站點、實際日夜班次。
- 日夜證據：固定中午與凌晨各模擬 500 實秒，控制相同隨機序列；實際發車 16／14 次，下一班間隔 75／450 遊戲秒（草稿 every 為 45～90）。
- 第一關回歸：output/p1-c-town-before.json／after.json 按 id 排序比對建築／道路／布局／人物與車數完全相同，居民路線完全相同；300 模擬實秒車流無非有限值；12／20 截圖人工比對無非預期改變，無 train-kit 素材請求或 pageerror。第一關實際 rail:null，未新增正式第二關或改 LEVELS。
- 證據：p1c-station.png、p1c-train-curve.png、p1c-crossing-closed.png；第二關驗收資料只透過 Playwright route 注入，output/ 不提交。
- 非阻擋原有問題：undo 會重建斑馬線，drawZebras 在 2b164e8 就只 clear 未 dispose；已用該 commit 原始 main.js 實測 10 次 undo，geometry 572→922。新柵欄重建使用同一 geometry，碰撞柱數量恢復、無殘留阻擋；未順手修改舊斑馬線問題。證據 p1-c-legacy-geometry.json。
- 下一步／限制：P1-C 無待修阻擋問題；正式第二關與通勤客、場景美術及預覽卡片在 P1-D，所以正式選單目前仍只有小鎮。Stroller 接線已審核，驗收草稿公園不與鐵道相交；平交道的動態行人案例使用實際 Resident／Passenger 與共用進入判斷。三份 Phase 契約未改；使用者已授權 commit/push。

## 指揮者審核清單（已完成）

- [x] 需求：C 必測 1～8、無站點、無鐵道、道路編輯與 undo。
- [x] 生命週期：初始化／空關卡／換日／時間跳轉／暫停與倍速；新鐵道資源穩定，原斑馬線問題另列。
- [x] 模型與路徑：尺度、接口、四向转彎、車廂長度與間距、中心／切線、全車進出與車尾清空。
- [x] 接線與 API：frame、buildRoads／settleTown、車輛／公車、各行人類別／居民、玩家；新函式都有實際呼叫者，無 TDZ。
- [x] 契約與資料：LEVEL.rail 格式、CELL／半格與視覺單一來源、鐵軌不與 walk 重合、原儲存與匯出格式不變。
- [x] 失敗與邊界：關閉時煞停、已在交叉口者離開、玩家前後及彎道、停站與停等解除、編輯後無殘留阻擋。
- [x] 平台與可達性：Windows 素材路徑／GLB 紋理／檔名大小寫；第二關草稿能實際驅動功能，正式第一關不載火車素材。
- [x] 回歸與範圍：第一關資料／路線／12、20 點／車流；只改授權區段，無偽造測試／除錯殘留／無關功能改寫。
