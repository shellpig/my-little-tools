# A3c — settleTown 拿掉貓落點，依貓規則重算

- Scope：使用者拍板的貓規則——被找到的貓當天消失，換遊戲日才重新躲並算落點（分散幾幀）；搬／刪／放建築只重算躲在該建築範圍內的貓；鋪路不重算貓。settleTown 不再對所有藏身點 raycast。
- 依賴：A3b。
- 驗收：找到貓後當天看不到、點不到、不會被說話選到；過午夜後陸續回來、落點高度正確；搬走貓所在建築，貓落到正確高度，蓋到貓頭上的建築把貓移上屋頂；鋪路不動貓；其他貓自行換位置照常；settleTown 耗時不含貓；主控台無錯。
- 起始：2026-10-11；worker OpenCode Muse 1.3。
- 交付（main.js）：`setTime()` 統一處理時間前進／預設鈕／滑桿，時間往回（含過午夜）即 `startNewDay()`；`Cat.vanish()`（找到後縮小消失、`gone`、不佔藏身點），`hideAt()` 藏身時才 `surfaceY` 算高度（先隱藏自己避免射到自己）；`dayQueue` 每幀最多一隻回來；`freeSpots()`；`footprintOf()`＋`reseatCats()` 由 change／undo／loadLayout／putDown 呼叫，只重算新舊範圍內的貓；settleTown 拿掉全藏身點 raycast；點擊與 E 互動排除 gone 貓。
- worker 自查：真實點擊找 4 隻→當天消失、點不到；過午夜 3,2,1,0 每幀一隻回來、高度與 surfaceY 誤差 <1e-3；預設鈕往回跳也觸發；搬走屋頂有貓的建築只該貓落下、蓋房在貓上該貓上屋頂；拖曳鋪路＋undo 的 surfaceY 呼叫 0 次；settleTown 第 1 關 6.7～9.0→3.6～6.1ms；無貓關卡正常；無錯。
- 指揮者審核：diff 範圍正確、無 __dbg；node --check 通過；第 1 關 20:00 實測（output/p1-a3c-20.jpg）貓在屋頂、主控台無錯。未修改。
- 已知行為：滑桿往回拖一點也算換日（只影響已找到的貓提早回來）；`catBook.finds` 跨日重複找到同一隻仍會累加（既有語意）。
- 驗證 commit：未建立。
