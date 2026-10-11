# A3b — 找路加速＋findRoute 去重

- Scope：`segmentBlocked()` 改精確線段對矩形＋solids 空間分格（rebuildNav 時建）；snapDoor 結果快取（rebuildNav 清除）；findRoute／findRoutePos 抽共用（review 第 2 點）。路線行為不變。
- 依賴：A3a。
- 驗收：第 1 關居民全天路線與改前同樣可達（stuck 數相同）、無路點在建築內、無線段穿建築；settleTown 中「居民重規劃」在 2.5 倍壓力情境大幅下降（改前 62～71ms）；路人／公車乘客正常；主控台無錯。
- 起始：2026-10-11；worker OpenCode Muse 1.3。
- 交付（main.js 找路區段）：`rebuildNav()` 建 `navSolids` 快照與 CELL 分格索引 `blockBuckets`，清 `pathCache`／`snapCache`；新 `segHitsBlock()`（slab 精確測試，嚴格內部）；`segmentBlocked()` 只查附近分格；`snapDoor()` 依門座標快取；findRoute／findRoutePos 共用 `cachedRawPath()`、`lanePoints()`、`finishRoute()`（review 第 2 點）。
- worker 自查：第 1 關 104 段路線改前改後完全相同、stuck 0→0；舊取樣法當 oracle：穿牆線段 7→7（既有斜角擦邊，未變）、路點在建築內 0；居民重規劃第 1 關 5.6→2.2～2.4ms，壓力情境 33.7→7.1～9.5ms；路人／乘客／搬建築／鋪路重規劃行為不變。
- 指揮者審核修正：`navBlocks()` 改完後已無呼叫者（worker 報告誤稱仍被使用），刪除。node --check 通過；第 1 關 08:30 實測（output/p1-a3b-0830.jpg）居民通勤正常、主控台無錯。
- 未解（可修可不修，既有）：7 段斜角擦邊在偏移失敗退回原路徑時仍會擦到建築角；5/20 路人回家查詢不可達時停在原地。
- 驗證 commit：未建立。
