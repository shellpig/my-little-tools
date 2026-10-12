# P2-D 實作紀錄

## 接手摘要

- 更新：2026-10-12。
- 目標：第 2 關住宅與商店依交通與設施沿路自動長出、透天在熱鬧處升級成小公寓；通勤客與路人的目的地改成同一份清單；第 1 關行為不變。
- 分支：`feat/small-town-p2-d`，從 main `e874eb1`（P2-C 已合入）開出；完成後 merge 回 main。
- 指揮者：Claude Code；實作者：agy / Gemini 3.1 Pro (High)；本機工作樹直接改程式，不得 git 寫入。使用者指示「一路處理完畢」：每步驗證後 commit 到分支，最後 merge + push + 更新 brief。
- 拆法：依讀取範圍拆四步（handbook §2.1）。D1 只碰 atrain.js 與經營面板；D2 只碰門口與目的地；D3 只碰地塊與生成；D4 只碰商店比例、公寓升級與刪除冷卻。
- 下一步：D2（D1 完成）。
- 契約：本目錄實作規格、開發設計方針、測試指南的 P2-D 段；契約疑點由指揮者裁定，記在各 step 檔。
- prompt 與輸出：`C:\_work\AI_Work\Tools\agy-runs\agy-small-town-P2-D*.*`。

## 步驟進度

| 步驟 | 標題 | 狀態 | 依賴 | 詳細紀錄 |
|---|---|---|---|---|
| D1 | 成長評分與設定：`lotScore()`、`#p2.growth`、經營面板「小鎮」分頁 | 完成 | P2-C | [D1.md](P2-D_steps/D1.md) |
| D2 | 門口與統一目的地：新增建築的門口、`destinations()` | 進行中 | D1 | [D2.md](P2-D_steps/D2.md) |
| D3 | 地塊與生成：候選地塊、空間檢查、蓋住宅、上限、動畫與通知 | 待做 | D2 | [D3.md](P2-D_steps/D3.md) |
| D4 | 商店比例、公寓升級、刪除冷卻 | 待做 | D3 | [D4.md](P2-D_steps/D4.md) |
