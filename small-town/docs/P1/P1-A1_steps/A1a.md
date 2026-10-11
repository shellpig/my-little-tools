# A1a — Grid Roads & Traffic

- 日期：2026-10-11；worker：OpenCode Muse 1.3；起始 commit：2542f64。
- Scope：依 P1-A1 契約處理網格道路、人行道、車流、公車及佈局遷移，保留暫時的舊行人邏輯。
- 依賴：固定時刻及鏡頭的日／夜基準已拍攝；使用者已指定本機 Muse。
- 驗收：P1 測試指南 A1 必測 1～7、遷移及二次載入；瀏覽器無錯誤；修改的 JS 語法檢查；審核 git diff。
- 不做：A2 找路、B 選單／10 格存檔、C 鐵道、D 第二關，不修改三份契約或其他專案。
- 交付：main.js、levels/town.js、levels/index.js；道路、人行道、車流與佈局轉換／儲存接線已完成，worker 交付語法、資料與擷取實際程式的邏輯檢查結果。
- 指揮者審核修正：worker 自查已修正彎道進場方向、沿路線到站距離、null 匯入及重設寫入失敗等問題。另退回一項實際問題：支路盡頭站點返程因重複節點 indexOf 而循環，修正回合進行中。
- 驗證結果：15 項瀏覽器資料／編輯檢查通過，詳見 output/p1-a1-results.json；五分鐘模擬預設、四彎道、切斷／恢復、含 T／十字／死路／2×2 的連通路網，無持續卡死車，詳見 output/p1-a1-traffic.json；支路站點返程尚待修正。畫面證據 output/p1-a1-12.png、-20.png。
- 收尾：A1-fix1 用每個路徑段的 routeAt 解決支路往返的重複節點問題；支路公車能停靠、向西離場及重新進場。修正後資料／編輯 15 項再次全過，車流六組均無 runtime error；node --check、git diff --check 通過，無除錯殘留或 git 寫入。
- 未解問題／下一步：無會壞掉或丟資料的已知 A1 blocker；派出 A2。不自動 commit/push。
