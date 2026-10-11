# A2a — Pedestrian Paths & Town Level Data

- Scope：通用半格 A*、居民／路人、town 資料搬移、nullable 設施、無貓／無許願、每關 catBook。
- 依賴：A1a 驗證通過；worker 寫檔前讀取目前最新程式，不以先前記憶重生檔案。
- 驗收：P1 測試指南 A2 必測 1～9、舊 catBook 遷移；A1 存檔、車流、公車與編輯回歸。
- 起始：2026-10-11；worker OpenCode Muse 1.3；A1 在 2542f64 上的未提交工作樹。
- 交付：main.js、nav.js、levels/town.js；完整小鎮資料、半格網格／A*、居民實際停留地點、路人／乘客找路、nullable 設施、關卡 catBook。其他程式、資產及三份 Phase 契約未修改。
- worker 自查修正：狹窄巷子與公園入口的半格取樣、初次找路的初始化順序、無貓／無許願與無設施互動、夜間回家；除錯掛載已刪除。
- 指揮者審核修正：公園可走掩碼缺乏範圍造成北側草地與無斑馬線道路被誤判為可走；補上範圍及道路分類優先順序。三位居民的偏移路線在普通作息中穿入建築；經隔離測試確認未偏移路徑安全，偏移會碰撞時退回原路徑，居民與路人／乘客均適用。
- 驗證：node --check 四份修改 JS、git diff --check 通過；無 __dbg／console.log 殘留。30 位居民／104 段全天測試無不可達段、非有限座標或建築內位置；遠斑馬線路徑由約 6.9 改為 37.3 單位且經 x≈-17.2 過街，無斑馬線仍可臨時穿越。完整 catBook 遷移／再次載入、四貓測試關卡與紀錄分離、無許願點擊／E、null 設施啟動／散步均通過。新路搬移書店後居民改走新路，undo 回復原門口與路徑；堵住門口會停留，解除後恢復；夜間 19/20 路人回家。
- A1 回歸：資料／編輯 15 項通過；六組 300 秒車流模擬（預設、四彎道、切斷、恢復、支路站點、連通 T／十字／死路／2×2 路网）無持續卡死或 runtime error，公車正常停靠／返程。
- 證據：output/p1-a2-results.json、p1-a2-nav-results.json、p1-a2-resident-paths.json、p1-a2-edit-results.json、p1-a1-results.json、p1-a1-traffic.json、p1-a2-12.png、p1-a2-20.png、p1-a1-connected-network.png。後續回歸會更新同名輸出；均不 commit。
- 可修可不修：外圍 tree:39～47 共 9 棵隨機樹的預設位置與舊基準不同。初始化改成先建鎮再建人物，使這批樹的 rand 取用順序不同；建築與路燈位置、存檔狀態保留，無功能或資料破壞。原始差異仍記在 p1-a1-results.json 的 optional 項，沒有當成驗證通過隱藏。
- 後续資料注意：目前有 bus 的關卡同時提供 busStop（x／shelterX／shelterZ）；Town 已提供，新增關卡依 town.js 範例處理。沒有 bus 的關卡不需要。
- 驗證 commit：未建立，驗證對象是 2542f64 加目前工作樹；commit/push 等使用者指示。
- 不做：新小鎮選單、10 格存檔、火車、第二關、泛用編輯器。
