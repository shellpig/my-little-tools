# 指揮者手冊 — 讓 agy / ChatGPT / Muse 實作，指揮者驗證與收尾

適用對象：被指定為「指揮者」的 AI session（目前是 Claude Code）。指揮者不自己寫主要程式，而是把 Subphase 拆成步驟交給外部 worker（Antigravity CLI `agy`、ChatGPT Web、Muse 網頁版、Muse 1.3 via OpenCode CLI）實作，再在本機驗證、審核、修小錯、commit、push、更新實作紀錄。

本檔是流程與踩坑紀錄，不是 Phase 契約。Phase 要做什麼看 `docs/Px/` 三份文件；本檔只講「怎麼讓別人做、怎麼確認做對」。

來源：搬自 adventure-table `docs/others/conductor-handbook.md`（2026-10-04 版），worker 操作細節照搬，驗證流程與審核清單改成小鎮（純靜態網頁、無測試框架、瀏覽器實測）。

按角色／工作讀取：指揮者讀 §1、§2、§5、§7，再讀所選 worker 的 §3、§4、§4b 或 §4c；選 worker 時才讀 §6。只建立實作紀錄時讀 §2.4。Windows 指令與外部 CLI 見 [local-tools.md](local-tools.md)。

---

## 1. 角色分工

| 角色 | 做什麼 | 不做什麼 |
|---|---|---|
| 使用者 | 拍板 step 範圍、選 worker、決定何時停 | 不盯進度（指揮者負責） |
| 指揮者（本 session） | 讀契約、拆 step、寫 prompt、送出、定時檢查、pull、瀏覽器實測、審 diff、修小錯、commit、push、更新 `<Subphase>實作紀錄.md` | 不重寫 worker 的大段程式（改動超過幾處就退回 worker）；不改 Phase 三份文件（verifier 職權） |
| worker（agy / ChatGPT / Muse） | 讀指定文件與程式、寫程式、回報 | agy、OpenCode Muse：不得任何 git 寫入；ChatGPT／網頁版 Muse：可 commit + push 到指定 branch，但不得開新 branch / 動 main / force push / rebase |

**commit 權責**：agy 與 OpenCode Muse 的產出由指揮者 commit；ChatGPT 自己 commit（author 是 repo owner，沒有 Co-Authored-By）。指揮者自己的修正另開 commit，訊息寫清楚修了 worker 的什麼。commit 訊息英文 conventional（`feat(small-town): ...`）。

---

## 2. 共通原則（所有 worker 都適用）

### 2.1 step 粒度

- **不要過度拆分。** Subphase 可視需要拆成少數大步（例：A1、A2），一步之內不再列子項，也不為子項建紀錄；指揮者以節省自身 token 為準。
- 單回合有硬性時間上限的 worker（ChatGPT）：一個 step = 15～20 分鐘內能收斂到「瀏覽器可跑、可 commit」的量。大 step 一定失敗，拆小再送。
- step 命名接在 Subphase 後面（A1a、A1b…），寫進 `docs/<Phase>/<Subphase>實作紀錄.md` 的「步驟進度」表，這張表是唯一的進度真相；`PROJECT_BRIEF.md` 只記 Subphase。

### 2.2 prompt 骨架

prompt 寫成檔案，存 `C:\_work\AI_Work\Tools\agy-runs\<worker>-small-town-<step>.prompt.txt`（session 中斷後可從這裡與實作紀錄接手）。固定段落：

1. **身分與狀態**：step 名、branch、HEAD hash、已完成的 step。agy 的第一行固定：「YOU MUST DO THIS STEP YOURSELF. 不得交給 subagent／background task／parallel worker。」
2. **MANDATORY READING**：`small-town/PROJECT_BRIEF.md` → 該 Subphase 接手摘要／步驟板與自己的 step 檔 → 三份 Phase 文件對應段 → **要動的每個程式檔（列檔名＋要動的區段名，如 `main.js`「// ---------- traffic ----------」）**。只列要改的檔，不要求整份讀 brief 以外的歷史。續做同一步時不重讀未變更的背景文件，但**寫檔前一定重讀該檔最新內容**。
3. **SCOPE**：A/B/C… 條列，含驗收方式（瀏覽器裡看到什麼、哪個數值）。
4. **Do not touch**：明列不可碰的檔案／區段（例如 `assets/`、`wardrobe.js`、與本步無關的 `main.js` 區段）。
5. **CODE QUALITY**：沿用 `main.js` 既有寫法——ES module、2 空白縮排、單引號、有分號、區段以「// ---------- 名稱 ----------」分隔、註解密度與口吻同周圍；點名要共用的既有函式（例如 `box()`、`place()`、`editable()`、`applyState()`、`settleTown()`、`pathThrough()`）；禁止整段複製既有函式、沒人呼叫的參數、為不可能情況寫防禦式分支、假資料佔位；貼超過 ~20 行就抽函式。
6. **VERIFICATION**：寫明指揮者會怎麼驗（見 §2.3），worker 能自己開瀏覽器時一併要求。
7. **HARD RULES / GIT**：agy／OpenCode Muse 不得 git 寫入；ChatGPT 的 commit message、禁 force push / 開新 branch / 動 main。**parent 一律寫「你動手前 fetch 到的 branch HEAD」，不要寫死 hash**。
8. **FINAL REPORT**：固定五項（commit 或改動檔案 / 新增或修改的函式 / 每個驗收項怎麼確認的 / 已知問題 / 契約疑點）。

### 2.3 指揮者驗證 gate（每個 step）

```
git pull --ff-only（ChatGPT／網頁版 Muse）或 git diff（agy／OpenCode Muse 直接改本機）
→ node --check small-town/main.js（及改到的其他 .js）
→ 瀏覽器實測（http://localhost:8766/，見 docs/P1/測試指南.md 的測試原則）：
   強制重抓改過的檔、帶新 ?v= 重載、主控台無錯誤、跑該步驗收項、截圖
→ 第 1 關回歸（測試指南指定的基準截圖對照）
→ 讀 diff（§5 checklist）
→ 修小錯（幾行、單一目的）
→ 刪掉暫時的 window.__dbg 等除錯程式
→ 更新 <Subphase>實作紀錄.md 的接手摘要／步驟表＋該 step 詳細紀錄（§2.4）
→ 截圖給使用者、回報；使用者說 commitpush 才 commit + push
```

### 2.4 實作紀錄格式

`docs/<Phase>/<Subphase>實作紀錄.md` 只放：

- **接手摘要**（頂部，≤ 3,000 UTF-8 bytes）：更新日期、目標與邊界、最近已驗證 commit、下一步、阻礙／未審 worker 產出、必要跨步依賴與正式契約入口。覆寫，不追加日誌。
- **步驟進度**：唯一 step 狀態來源。每步一列：step id、短標題、狀態（待做／進行中／待驗證／完成）、依賴、詳細紀錄連結。

每步另存 `docs/<Phase>/<Subphase>_steps/<step>.md`。派工前先寫該步 scope、對應契約標題、前置依賴與驗收方式；結束後補齊：起始（日期、worker、回合數與時長）、交付（函式／區段）、**指揮者審核修正**、驗證（做了什麼、結果、驗證 commit）、未解問題與下一步。

小專案彈性：指揮者自己做、沒有派工的 Subphase 可以不建實作紀錄，進度只記在 `PROJECT_BRIEF.md`。

---

## 3. agy（Antigravity CLI）流程

啟動指令、`--add-dir`、`-p` 單行限制、背景執行、`--conversation` 接續、model 名稱：全部見 [local-tools.md](local-tools.md)「Antigravity CLI」。

指揮者要做的：

1. 寫 prompt 檔 → 背景啟動 → 被喚醒後用 `C:\_work\AI_Work\Tools\agy-runs\report.py <step>.json` 讀結果（status / duration / denied_actions / response）。
2. `git status` / `git diff` 看它實際改了什麼（不要只信 final report）。
3. 跑 §2.3 gate。失敗把錯誤訊息餵回**同一個** `--conversation`；換 step 開新對話。
4. 審完剩餘修改很小 → 自己改，不再開 agy 回合。

### 3.1 中途監看與判死（不要傻等 print-timeout）

背景啟動後立刻掛一個 `Monitor`（或等價的背景 loop），每 4～5 分鐘印一行：

```bash
git status --short --untracked-files=all -- small-town | wc -l   # 改動檔數
ls -t small-town/*.js | head -1                                    # 最新被改的檔
```

輸出檔（`<步驟>.json`）非空即結束，loop 退出。判斷規則：

| 觀察 | 判定 | 動作 |
|---|---|---|
| 檔數在增加、或最新檔 mtime 在變 | 正常 | 不打擾 |
| 前 5 分鐘 0 檔改動 | 正常（讀檔階段） | 不打擾 |
| 連續 2 次（≈8～10 分鐘）檔數與 mtime 都不變 | 卡住 | 殺 agy 程序，讀輸出檔與已寫的檔，小則自己收尾、大則開新對話重送 |
| 輸出檔開頭 `print timeout after ... with turn in progress` | 已死 | 同上 |

重送時 prompt 加一句硬規則：「所有指令前景執行並等它回來；不得把工作丟到背景再等。」

**agy 必須自己做，不得交給 subagent**：曾發生 agy 把工作交給自己開的背景子任務後空等。第一行的固定句每個 agy prompt 都要保留。

**agy 已知缺陷（adventure-table 統計，prompt 裡點名禁止）**

| 類型 | 實例 |
|---|---|
| 越界改寫既有程式 | 順手改寫不相關的文案、重寫既有函式 |
| 壞掉的半成品 | 引用未定義變數、不存在的分支 |
| 防禦式寫法 | 到處加 fallback、try/catch 當控制流、props 全 optional + 空值 guard |
| 假資料 | 用寫死的值偽造結果讓畫面看起來對 |
| 執行穩定度 | quota 429、print-timeout、stream 中斷；大 step 常收不了尾 |

淨效益：prompt 把要動的區段、要共用的函式與 Do-not-touch 寫死時，審核量很小。

---

## 4. ChatGPT Web 流程

使用者說「gpt」指的就是這個（Chrome 網頁版 chatgpt.com）。

### 4.1 前置

- 對話必須由**有 GitHub connector 且對 repo 有寫入權的帳號**開。
- 用 **Claude in Chrome**（使用者的真 Chrome，已登入）驅動，不是內建瀏覽器（隔離、未登入，且指揮者不得代替登入）。
- ChatGPT 讀／寫 repo 走 GitHub connector：讀檔、建 blob / tree / commit、更新 branch ref。它**開不了瀏覽器驗證**，驗證一律在本機。

### 4.2 送 prompt 的技術細節（全部踩過坑）

composer 是 ProseMirror `div#prompt-textarea`，不是 textarea：

- `form_input` 只會填到一個隱藏 textarea，畫面上什麼都沒有。
- `type` 動作對長文本與換行不可靠。
- **可用方法**：`javascript_tool` 派 paste 事件，再點送出鈕：

```js
const pm = document.querySelector('#prompt-textarea'); pm.focus();
const dt = new DataTransfer(); dt.setData('text/plain', text);
pm.dispatchEvent(new ClipboardEvent('paste', {clipboardData: dt, bubbles: true, cancelable: true}));
await new Promise(r => setTimeout(r, 800));
const btn = document.querySelector('button[data-testid="send-button"], button[aria-label="傳送提示詞"]');
if (btn && !btn.disabled) btn.click();
```

`text` 直接以 JS 字串嵌進呼叫（6～7 KB 沒問題）。內含 `${}` 時不要用 template literal。

- **不要用附件送任務。** 附件會讓之後的 GitHub 寫入工具被 OpenAI 擋（「由於 OpenAI 無法確定要求的安全狀態…」），回合在 timeout 時無聲死亡。改貼對話。
- `fetch('http://127.0.0.1:…')` 被 chatgpt.com CSP 擋，不能用本機 HTTP server 傳 prompt。
- 讀回覆：`[...document.querySelectorAll('[data-message-author-role]')]` 取最後一則；`innerText` 被擋時改截圖。

### 4.3 檢查節奏與死回合判斷

- **固定間隔（15 分鐘）檢查一次，不要分鐘級輪詢**。用 `Monitor`（`sleep 900; echo tick`）當喚醒訊號。
- 每次檢查：`git fetch` 看 remote branch → 沒新 commit 就重載頁面看最後一則訊息與 stop button。
- **「連線中斷。正在等待完整回覆」= 回合已死**。直接 `navigate` 到同一個對話 URL，重載後若最後一則是自己的訊息、沒有回覆也沒有 stop button，重送即可。
- **stop button 會騙人**：
  - 串流中且送出未滿 30 分鐘 → 不打擾。
  - 超過 30 分鐘無輸出、或回合已結束但沒 push → 送**不呼叫工具的診斷**：「不要呼叫任何工具，只回答：(1) 上回合做到哪 (2) 最後一次工具呼叫是什麼、有無被封鎖、錯誤訊息 (3) 手上有沒有已建好的 blob / tree」。
- 每次檢查後都要給它下一個指示（繼續 / 修列出的問題 / 下一步）。

### 4.4 ChatGPT 已知缺陷

| 現象 | 原因 | 對策 |
|---|---|---|
| 回合 30 分鐘 timeout、零輸出 | 附件觸發寫入封鎖；或 step 太大在 `create_blob` 途中被切 | 貼對話；拆 step |
| 回合全部花在讀檔 | MANDATORY READING 列太多「read fully」 | 只列要改的檔與區段；契約重點直接寫進 prompt |
| 整份檔案被壓縮、大量刪行 | 指揮者叫它「不用重讀、沿用 blobs」，它憑記憶重生檔案 | **永遠不要叫它跳過重讀**；每次寫檔以 HEAD 新鮮讀取為底、最小 diff。`main.js` 約 3,000 行，特別要盯 diff 的刪除行數 |
| FINAL REPORT 不照格式 | — | 不依賴 report，自己看 diff |

品質面：比 agy 高，但吞吐低——含死回合平均 45 分鐘一步。

---

## 4b. Muse 網頁版流程

### 4b.1 前置

- Muse（muse.ai）thread 由使用者指定，**可能因 context 上限隨時重開**；當前 thread URL 只記在該 Subphase 實作紀錄的接手摘要。派工時若使用者沒提供 thread，**先問使用者**。新 thread 不帶前一 thread 的脈絡，prompt 必須自足。用 **Claude in Chrome** 驅動。
- Muse 有自己的 Linux 環境；小鎮在那邊要 clone `shellpig/my-little-tools`，它可以用 `python -m http.server` 起站但**看不到畫面**，驗證仍以本機瀏覽器為準。
- **`git push` 不通**：Muse 在本機 commit 後用 Git Data API（blob→tree→commit→update ref）推同一 tree，推完 `git fetch` 核對 diff 為空。
- **權限核可**：Muse 要連新網域時會跳「允許Muse與…分享資訊？」並暫停；使用者授權指揮者一律按「這個網站一律允許」。

### 4b.2 送 prompt 與讀回覆

composer 是一般 React textarea：

```js
const ta = document.querySelector('textarea[placeholder="傳送訊息"]'); ta.focus();
Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(ta, text);
ta.dispatchEvent(new Event('input', {bubbles: true}));
await new Promise(r => setTimeout(r, 600));
document.querySelector('button[aria-label="傳送"]').click();
```

- 長 prompt（~5 KB）直接以 JS template literal 嵌入即可。
- 讀回覆：`document.body.innerText` 以上一則自己訊息的結尾定位後切片；JS 工具回傳約 1.4 KB 會截斷，分段讀。
- 回合中送的訊息會排隊，等它本回合結束才回（出現 👍 表示已收到）。

### 4b.3 檢查節奏

- **每 10～20 分鐘檢查一次**。喚醒訊號用背景 `git ls-remote origin refs/heads/<branch>` 迴圈。
- 「蒐集我的想法／正在處理／執行中」都代表還在跑。**還在跑時只問進度，不催「繼續、不要停」**——催促會被理解成「不要驗證」。只有它閒置時才要它繼續做完。

### 4b.4 Muse 已知缺陷

| 現象 | 對策 |
|---|---|
| 「必須」類結論講得很肯定但有錯 | 逐條對照程式碼 |
| 漏驗收項 | 把測試指南每條對應到它的回報，缺的當場補或退回 |
| 寫了函式但沒有呼叫者 | 每個新函式 grep 呼叫位置 |
| 前端無法自我驗證 | 網頁版 Muse 看不到畫面；畫面相關的步驟改派 OpenCode Muse、agy 或指揮者自己做 |

### 4b.5 prompt 必備

- **允許回報 blocker**：「發現契約有缺口或既有程式不支援，停下來回報，不要自己補假資料。」
- **FINAL REPORT 要可核對**：每個新函式的呼叫位置；每條流程從哪個操作開始、依序經過哪些函式。

## 4c. Muse 1.3 via OpenCode CLI

啟動指令見 [local-tools.md](local-tools.md)「Muse Spark 1.3 via OpenCode CLI」。

### 4c.1 與網頁版 Muse 的差別

| | 網頁版 Muse（§4b） | OpenCode Muse 1.3（本節） |
|---|---|---|
| 執行環境 | muse.ai 的 Linux VM | 使用者本機 Windows 工作樹 |
| 派工與讀回報 | Claude in Chrome 操作網頁 | `opencode-cli.exe run` 背景執行，讀 log 尾段 |
| commit | worker 自己用 Git Data API 推 | **指揮者 commit／push**；prompt 禁止所有 git 寫入 |

### 4c.2 送 prompt 與檢查節奏

- prompt 照 §2.2 骨架寫成檔案，存 `C:\_work\AI_Work\Tools\agy-runs\opencode-muse-small-town-<step>.prompt.txt`，以 `Get-Content -Raw` 傳入；輸出重導到同名 `.log`。
- 一律 `run_in_background`。送出後先看 log 有沒有開始出現讀檔動作，確認後每 10 分鐘檢查一次（log 位元組是否增加與最後幾行）。結束時讀 log 中 FINAL REPORT 之後的內容。
- 同一步要修正時開新回合、送自足的修正 prompt。

### 4c.3 prompt 必備

- 第一段寫明：在本機工作樹直接改檔；**不得任何 git 寫入**（add／commit／push／checkout／stash／reset／rebase／branch）、不開 subagent 或背景任務、不刪除非本次新增的檔案、不動 `assets/`。
- §4b.5 的 blocker 條款與可核對 FINAL REPORT 同樣適用。

---

## 5. diff 審核 checklist

每個 step 至少看這些，看到就修或退回：

1. **契約對照**：關卡資料欄位、儲存 key、佈局格式與 `docs/P1/開發設計方針.md` 一致。
2. **沒有越界**：`git diff --stat` 的檔案清單對照 prompt 的 Do not touch；`main.js` 只動到指定區段。
3. **刪除行數合理**：大量刪行先確認不是憑記憶重生檔案（§4.4）。
4. **重用而非複製**：新函式是否已有同義既有函式；貼超過 20 行的重複。
5. **防禦式寫法與假資料**：§3 / §4 缺陷表。
6. **每個新函式都有呼叫者**；每個新的 localStorage 讀寫都包 try/catch（沿用既有寫法）。
7. **常數放對區段**：`main.js` 區段之間有 TDZ 順序（後面區段的 `const` 不能在前面區段的頂層使用，只能在函式內）。
8. **排版**：風格與周圍一致（2 空白、單引號、有分號）；註解口吻同周圍。
9. **除錯殘留**：`window.__dbg`、`console.log` 已刪。
10. **實作紀錄**：把上述發現寫進「指揮者審核修正」。

---

## 6. 選哪個 worker

| 情況 | 建議 |
|---|---|
| 範圍清楚的單一區段改動（例：一個建造函式、一段資料搬移） | agy（快、省 Claude 用量） |
| 需要讀懂大段既有程式的重構 | ChatGPT 或 OpenCode Muse；指揮者審 diff 要特別細 |
| 畫面效果、擺設、需要邊看邊調 | 指揮者自己做（需要瀏覽器實測） |
| 使用者在意時間 | agy 為主 |
| 使用者在意審核成本 | ChatGPT 為主 |

指揮者自己做的判準：剩餘修改幾行、單一區段、不需重新理解脈絡 → 直接改；否則退回 worker。

---

## 7. 接手流程（新指揮者 session）

1. 讀 `small-town/PROJECT_BRIEF.md` → 本檔共通段落與所選 worker 段落 → 當前 Subphase 接手摘要／步驟板（若有）→ 本步及必要前置紀錄。
2. `git fetch` + `git log origin/main --oneline -5`，確認 remote 與本機一致；有未審的 worker 產出先走 §2.3 gate。
3. 看 `C:\_work\AI_Work\Tools\agy-runs\` 最新的 `*-small-town-*` prompt 檔，知道上一步送了什麼。
4. Muse thread 依 §4b.1 先問使用者；agy conversation id 遺失不影響，開新對話讀實作紀錄即可。
5. 依所選 worker 的檢查節奏繼續（ChatGPT §4.3、Muse §4b.3）。
