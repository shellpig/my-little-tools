# P2 review 修正紀錄

## 接手摘要

- 日期：2026-10-13。範圍：本次 review 的四項問題；不修改 Phase 三份契約文件。
- 起始：main `33b5edf`；分支：`feat/small-town-p2-review-fixes`，已 fetch，與 origin/main 一致。
- Worker：GPT-6 Luna，reasoning effort max；只修改程式與必要測試，不做 git 寫入。
- 指揮者負責審 diff、專用 headless Chromium 驗證與本紀錄；驗證完成後使用者於 2026-10-13 指示「merge cp」，授權 commit、合併回 main 與 push。

## 步驟進度

| 步驟 | 範圍 | 狀態 |
|---|---|---|
| R1 | undo 歷史金額不受無限資金切換影響 | 完成 |
| R2 | 組合設施占地與搬過住宅原地升級 | 完成 |
| R3 | 點選班表可取代既有車輛 | 完成 |

## 指揮者裁定與驗收

- R1：一般消費與退款保留無限資金規則；undo 必須反轉原步驟實際記錄的金額。原步驟未扣款或退款則 undo 不動資金。驗刪除及購買／鋪路兩個金額方向，以及切換開關。
- R2：公園、露營區、農田登記整體模型占地，沿用 editable 的移動、旋轉、刪除、undo、存讀檔同步。升級以住宅目前 x/z/rot 為準，保留出生與地塊 metadata，空間不合法就保留住宅。驗三種設施阻擋成長、搬動／旋轉升級，以及障礙物擋升級。
- R3：點選既有格子先排除該格舊班次，選車與確定採同一份班表檢查；不改全域班表驗證規則。驗合法取代、非法間隔、取消不寫入、清除、停／過及拖拉。
- 共通：最小 diff；語法檢查；P2 三日結算與存讀檔；第 1 關 smoke；不啟動或控制 Edge。

## R1 交付

- Worker 1 回合：`applyMoney(delta, isUndo = false)`；undo 明確傳 true，其餘呼叫不變。
- 指揮者審核：3 行新增／3 行刪除；無存檔格式與一般消費行為變更。
- Worker 語法、diff whitespace、實際函式 Node VM 正負歷史金額與開關切換探針通過。
- 指揮者專用 Chromium：實際刪除公寓後開無限再 undo，5150 回到 5000 且公寓恢復；原購買步驟在無限下 undo，5000 回到 5300；無限下免費購買後切回一般 undo 不動錢，全部通過。
- 同一回歸脚本接著在 R2 未修的公園占地斷言失敗（solids=0、同地塊住宅仍可建），確認測試能抓到原問題。

## R2 交付與審核

- Worker 2 回合：三種 compose 設施的聯合模型 bounds 登記一筆全域 solid；小公寓套用當前住宅 x/z/rot，`lotFree()` 排除住宅與候選自己的 solid，再檢查街道、建築、posts 與邊界。
- 指揮者退回首版：區域 solids 遮蔽全域清單，算出的 footprint 未真正登記。修正後用同一物件連接全域 solids 與 editable，驗刪除不誤刪、還原重新加入、discard 不留殘項。
- 移除本次改動造成無呼叫者的 `buildOnLot(replacing)` 參數與說明；正常成長流程其餘行為不變。
- Chromium：park/camp/farm 均阻擋同地塊住宅；搬動與旋轉、刪除與還原、三種設施存讀檔 bounds 一致，全部通過。
- 搬動並旋轉自動住宅後，小公寓 x/z/rot 精確相等；auto/lot/born 保留；放入玩家樹木時跳過升級並保留原住宅，通過。

## R3 交付與審核

- Worker 1 回合：`timetableWithoutModalCell()` 提供選車及確認共用的基底班表；保留全域 validator 與其他班表操作。
- Chromium：7:00 往東可把普通車取代成特急、不停站，同格僅一班；取消不改資料；8:00 同車間隔不足仍禁選；清除成功。
- Chromium 拖拉回歸：9:00 往西移到 11:00 成功；普通 2 號排到 10:00 往東因間隔不足遭拒且資料不變；特急取代已有的 11:00 往西成功；沒有殘留拖拉樣式或 pageerror。

## 整體驗證

- `node --check small-town/main.js`、`git diff --check` 通過；程式 diff 僅 main.js 35 行新增、18 行刪除；除上述四點與必要的 orphan 移除，未改其他程式區段。
- `output/p2-review-regression.cjs` 全部斷言通過；探針只在 Playwright route 注入，不寫入產品程式。
- 預設班表依主迴圈 0.1 分鐘順序推進三日：資金 5094、5188、5282；重新載入 P2 狀態一致。
- 第 1 關 smoke：p2=null、rail=null、經營按鈕隱藏；所有測試頁 pageerror 清單為空。
- 截圖：`output/p2-review-growth.png`、`output/p2-review-timetable.png`、`output/p2-review-town.png`（不 commit）。
- 未重跑：完整 P1 視覺回歸、真人拖拉手感、長時間 FPS；這次只驗修正範圍及相關回歸。
- 所有測試只啟動專用 headless Chromium，finally 關閉。沒有啟動或控制 Edge。
- 驗證完成，使用者已授權 commit、合併回 main 與 push。
