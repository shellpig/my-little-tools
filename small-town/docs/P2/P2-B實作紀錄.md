# P2-B 實作紀錄

## 接手摘要

- 更新：2026-10-12。
- 目標：第 2 關資金、每日 06:00 結算、花錢（買賣車、鋪路）與 undo 反轉金額、無限資金；第 1 關行為不變。公車、設施、成長不在本次範圍。
- 分支：`feat/small-town-p2-b`，從 main `d5cf812`（P2-A 已合入）開出；完成後 merge 回 main。
- 指揮者：Claude Code；實作者：agy / Gemini 3.1 Pro (High)；本機工作樹直接改程式，不得 git 寫入。
- 拆法：依讀取範圍拆兩步（handbook §2.1）。B1 結算只碰 atrain.js、rail.js 發車計數、main.js 時鐘與標題列；B2 花錢只碰 main.js 編輯／undo、經營面板。
- 結果：B1、B2 驗證通過，P2-B 完成，已 merge 回 main 並 push；下一步 P2-C。
- 契約：本目錄實作規格、開發設計方針、測試指南的 P2-B 段；契約疑點由指揮者裁定，記在各 step 檔。
- prompt 與輸出：`C:\_work\AI_Work\Tools\agy-runs\agy-small-town-P2-B1.* / P2-B2.*`。

## 步驟進度

| 步驟 | 標題 | 狀態 | 依賴 | 詳細紀錄 |
|---|---|---|---|---|
| B1 | 資金欄位、每日結算、標題列與通知 | 完成（3e78212） | P2-A | [B1.md](P2-B_steps/B1.md) |
| B2 | 花錢：買賣車、鋪路計價、undo 反轉、無限資金開關 | 完成 | B1 | [B2.md](P2-B_steps/B2.md) |
