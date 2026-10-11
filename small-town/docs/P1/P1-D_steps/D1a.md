# D1a — 斑馬線外漏＋第 2 關地圖

- Scope：drawZebras 改用 A3a 的 instanced 共用幾何（undo 不再外漏）；新增 levels/station.js（道路、鐵道、平交道、車站、站前廣場、旅館、5 家商店、一般住宅＋別墅、公車、路燈、貓、相機）、車站建築、註冊到 LEVELS、640×360 levels/station.jpg。通勤客留到 D1b。
- 依賴：cebfca5。
- 驗收：斑馬線 undo 10 次幾何不增加；選單兩張卡片；第 2 關載入無錯、建築不壓路／軌道／彼此、火車進站停靠、平交道柵欄與車流停等、公車停站；第 1 關回歸（截圖與居民路線）。
- 起始：2026-10-11；worker agy Gemini 3.8 Flash (High)。
- 交付：levels/station.js（鐵道 j=4 東西貫穿、station [0,4] north、大街＋後街＋南北路 i=8 平交道 [8,4]、站前廣場 walks [-2,1,2,1]、站前旅館 x=0、5 家商店、70 戶住宅含別墅、公車、27 盞路燈、5 處貓、相機）、levels/station.jpg、LEVELS 加入 station；main.js `STATION`／`STATION_DOOR`／`decorateStation()`（招牌、月台、雨棚、長椅）／`buildStation()`（editable 'station'、PLACES 入口）；`drawZebras()` 改用 `clearPaving`＋`paveBoxes`；rail.js 有 LEVEL.station 時不畫占位月台。
- worker 自查（agy）：斑馬線重建 10 次幾何 464→464；第 2 關載入 0 錯誤；78 個建築 solid 互不重疊、不壓路／軌道／廣場；火車停站 6 秒、平交道放下且車停等、公車停站；14 路人、貓 0/5、無許願區；編輯搬車站／商店、undo、鋪路、存檔快照與讀檔；選單兩卡片與雙向換關；第 1 關 t=12 截圖像素相同、30 居民路線相同。
- 指揮者審核修正：刪除 `buildStation`／`STATION_DOOR` 的防禦式預設值（資料已提供）、`CIVIC ?? []`、`places` 的 `filter(Boolean)` 與檔尾多餘空行。node --check 通過；瀏覽器實測第 2 關 11:00（output/p1-d1a-station-11.jpg）、選單兩卡片（output/p1-d1a-cards.jpg），主控台無錯。
- 觀察：鐵道南側目前全是草地；月台與車站寫死在鐵道 z=6.4 旁，搬動車站時月台跟著走、軌道不動。
- 驗證 commit：未建立。
