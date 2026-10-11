# 本機工具與執行規則

本檔是小鎮在使用者本機 Windows 環境的執行方式與外部 reviewer／worker 指令。不是開場必讀；執行相關工作前只讀對應段落。來源：改寫自 adventure-table `docs/others/local-tools.md`。

| 工作 | 先讀本檔段落 |
|---|---|
| 本機起站、瀏覽器實測 | 本機執行 |
| 外部 reviewer／worker | 本機工具、外部 Reviewer / Worker CLI；實作派工另讀 [指揮者手冊](conductor-handbook.md) 共通段落與所選 worker 段落 |

## 本機 Windows 環境專用

> 本段僅適用於使用者本機 Windows 環境。**remote / CI / Linux session 沒有這些路徑與工具，跳過本段。**

Repo 路徑：`E:\AI_Work\projects\my-little-tools`；小鎮在 `small-town\`。

### 本機執行

- 起站：`small-town\start.bat`（`python -m http.server 8765 --bind 127.0.0.1`，工作目錄 `small-town`），網址 `http://localhost:8765/`；停站：`stop.bat`。Claude Code 的 preview 設定在 `.claude/launch.json`（不 commit）。
- 小鎮沒有建置、沒有測試框架；Python 只用來起站與跑一次性的字串替換腳本。repo 沒有 `.venv`，這兩種用途使用系統 Python。
- 語法檢查：`node --check small-town/main.js`。
- 瀏覽器實測步驟見 `docs/P1/測試指南.md`「測試原則」。

### 本機工具

外部工具不放進本 repo。

| 工具 | 路徑 | 用途 |
|---|---|---|
| Codex DeepSeek home | `C:\_work\AI_Work\Tools\codex-deepseek-home` | DS reviewer 環境 |
| Antigravity CLI | `C:\Users\User\AppData\Local\agy\bin\agy.exe` | agy reviewer／worker |
| OpenCode CLI | `C:\Users\User\AppData\Local\Programs\@opencodedesktop\resources\opencode-cli.exe` | Muse 1.3 worker |
| worker 執行紀錄 | `C:\_work\AI_Work\Tools\agy-runs\` | prompt 檔、輸出、`report.py` |

### 外部 Reviewer / Worker CLI

把 agy、ChatGPT 或 Muse 當 **worker**（實作而非 review）時，流程、step 粒度、檢查節奏與踩坑一律看 [conductor-handbook.md](conductor-handbook.md)；本段只保留啟動指令。

reviewer 共通：**預設 read-only**——不寫檔、不刪檔、不 stage、不 commit、不 push，不讀 `C:\_work\AI_Work\Tools\` 裡的設定；非互動呼叫必須 `< NUL` 關閉 stdin，否則會停在等待輸入永久卡死；輸出重導到檔案保留；結果只當第二意見，回報前先自己審一遍，並以 `git status` / `git diff` 確認實際改動。

| 觸發語 | 走哪個 |
|---|---|
| 「要 ds4 / ds4 pro / ds4 flash 做 XXX」 | DeepSeek via Codex CLI |
| 「要 agy 做 XXX」「用 agy 審 / 驗證 XXX」 | Antigravity CLI |
| 「要 codex 做 XXX」（不帶 `ds4`） | Codex CLI (OpenAI) |
| 「要 opencode muse 做 XXX」 | Muse Spark 1.3 via OpenCode CLI（worker） |
| 「要 gpt 做 XXX」 | ChatGPT Web（Claude in Chrome），見指揮者手冊 §4 |

**DeepSeek via Codex CLI**：用 `CODEX_HOME=C:\_work\AI_Work\Tools\codex-deepseek-home`。Model：`ds4 pro` → `deepseek-v4-pro`；`ds4 flash` → `deepseek-v4-flash`；只說 `ds4` 用 `deepseek-v4-pro`。

**Antigravity CLI**：直接用完整路徑最穩。兩種用法：**review**（沿用上方 read-only 規則）與 **worker**（可寫程式，但不得 stage / commit / push；commit 權在 Claude）。

```powershell
cmd /c "C:\Users\User\AppData\Local\agy\bin\agy.exe -p `\"Your full task is in C:\_work\AI_Work\Tools\agy-runs\<步驟>.prompt.txt. Read it first, then follow every instruction in it.`\" --model `\"<模型>`\" --add-dir `\"E:\AI_Work\projects\my-little-tools`\" --add-dir `\"C:\_work\AI_Work\Tools\agy-runs`\" --dangerously-skip-permissions --output-format json --print-timeout 20m < NUL > C:\_work\AI_Work\Tools\agy-runs\<步驟>.json 2>&1"
```

- `--add-dir` 讓 agy 讀到專案與 prompt 檔，`--dangerously-skip-permissions` 單次生效，兩者都不可省。
- **`-p` 只能放單行短句，任務本文寫進檔案讓 agy 自己讀**。多行 prompt 經 `cmd /c` 會在第一個換行截斷，後面的 flag 與重導全部遺失，agy 會以無權限狀態靜默結束。
- **一律 `run_in_background` 啟動**，結束時 Claude 會被喚醒，直接讀輸出檔。
- `--output-format json` 回傳 `conversation_id`／`status`／`duration_seconds`／`usage`。**同一步驟的修改回合用 `--conversation <id>` 接續**；換下一步驟一律開新對話。
- prompt 骨架見指揮者手冊 §2.2（`C:\_work\AI_Work\Tools\agy-runs\TEMPLATE.prompt.txt` 是 adventure-table 用的，小鎮照手冊 §2.2 寫，不要整份沿用）。
- Model：`--model` 用 `agy models` 列出的完整顯示字串，未指定時預設 `"Gemini 3.8 Flash (High)"`。

**Muse Spark 1.3 via OpenCode CLI**（worker）：用 OpenCode 桌面版內建的 CLI；不要裝 npm 版 `opencode`（資料庫與桌面版不相容）。

```powershell
$c = "C:\Users\User\AppData\Local\Programs\@opencodedesktop\resources\opencode-cli.exe"
Set-Location E:\AI_Work\projects\my-little-tools
& $c run -m "opencode/muse-spark-1.3-contributor-free#high" --auto --title "<步驟>" (Get-Content -Raw -Encoding utf8 "C:\_work\AI_Work\Tools\agy-runs\opencode-muse-small-town-<步驟>.prompt.txt") *> "C:\_work\AI_Work\Tools\agy-runs\opencode-muse-small-town-<步驟>.log"
```

- `#high` 是 effort variant；`opencode-cli.exe models` 可列出可用模型。這個免費方案會分享資料；小鎮 repo 本身是 public，用於本專案沒有額外疑慮，但使用前仍以使用者當次指示為準。
- 加 `--auto` 才能寫檔與跑 shell，代價是 shell 指令不會被擋，禁止事項必須寫進 prompt。
- **prompt 一律寫成檔案再傳入**；長文字直接放在 PowerShell 命令列，引號會被轉壞。
- 一律 `run_in_background` 啟動，工作目錄是 repo root。

**Codex CLI (OpenAI)**：用預設 `CODEX_HOME`。

```powershell
cmd /c "codex exec `\"<任務>`\" --sandbox read-only -C `\"E:\AI_Work\projects\my-little-tools`\" --ephemeral -o `\"<結果檔>`\" < NUL > `\"<過程log檔>`\" 2>&1"
```

`--sandbox read-only` 是引擎層強制唯讀，寫入任務才改 `--sandbox workspace-write`；`-o <結果檔>` 只寫最終回覆。Model：要換用 `-m <model>`，專注程度用 `-c model_reasoning_effort="low/medium/high"`。
