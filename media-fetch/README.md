# MediaFetch

MediaFetch 是 `my-little-tools` 裡的一個獨立 Windows 桌面小工具，用來下載你有權存取與保存的公開媒體。

目前版本：**V0.1 開發版**

## V0.1 功能

- 貼上影片 URL，貼上後自動解析；「清空」清掉網址欄。
- 解析來源、標題、長度與解析度。
- 下載預設：
  - MP4 最高畫質。
  - MP4 1080p 以下。
  - MP4 720p 以下。
  - MP3 192 kbps。
- 提供登入 Cookies：從瀏覽器讀取，或指定 Netscape 格式的 cookies.txt。
- 選擇並記住下載資料夾。
- 顯示下載進度、速度與剩餘時間。
- 取消下載。
- 下載完成後開啟檔案或資料夾。
- 下載核心使用 `yt-dlp`，FFmpeg 由 `imageio-ffmpeg` 提供。
- YouTube 的 JavaScript challenge 支援使用 Deno；開發/打包腳本會準備固定版本的 Windows x64 Deno。

目標網站包含 YouTube、Instagram、Facebook、X、TikTok、Bilibili 與 Threads；實際可下載內容仍取決於網站當下版本、登入權限、地區限制與 DRM。Bilibili 與 Threads 有專案內的額外適配。

## 一般使用

若手邊已有打包版本，雙擊 `MediaFetch.cmd` 或 `dist/MediaFetch.exe` 即可，不必另外安裝 Python、Deno 或 FFmpeg。Git 原始碼不包含 EXE；首次使用原始碼請依下方「執行開發版」或「建立 Windows EXE」操作。

1. 貼上影片網址，等待自動解析；也可以按「解析」重試。
2. 選擇格式與儲存位置。首次預設為使用者家目錄下的 `Downloads`，之後會記住選擇。
3. 若內容需要登入，先設定 Cookies，再重新解析。
4. 按「開始下載」，完成後可開啟檔案或資料夾。

### Bilibili 與 Threads

- **Bilibili 分集影片**：網址保留 `?p=2` 即代表第 2 集，例如 `https://www.bilibili.com/video/BV1MKHQ62EL3/?p=2`；只下載指定分集，不會批次下載全集。登入與會員畫質仍取決於帳號權限。「最高畫質」指目前可取得的 MP4 格式。
- **Bilibili HTTP 567**：部分影音 CDN 拒絕一般請求；目前已針對 Bilibili 啟用分段下載，但不能保證所有節點或網路環境都可用，排錯見下表。
- **Threads**：目前只處理可公開讀取的影片貼文；貼文頁面解析不使用所選的登入 Cookies。私人或登入後才可見的貼文不支援，純圖片貼文也不能下載。
- **Threads 畫質**：目前所有 MP4 預設均選擇來源提供的最佳單檔影片，不套用 1080p／720p 上限；MP3 仍會抽取音訊。

## 登入 Cookies

需要登入才看得到的內容，可以在「登入 Cookies」提供登入狀態，有兩種來源：

- **從瀏覽器讀取**：選擇對應的瀏覽器。讀取前請先完全關閉該瀏覽器，否則 cookies 資料庫會被鎖住。
- **cookies.txt 檔案**：指定 Netscape 格式的 cookies.txt。

Windows 的新版 Chrome、Edge 可能因 App-Bound Encryption 而無法直接解密 Cookies；若關閉瀏覽器後仍失敗，改用 cookies.txt。Firefox 可嘗試直接讀取。

### 準備 cookies.txt

1. 在瀏覽器登入**要下載影片的同一個網站**，確認該影片在此帳號下能播放。
2. 使用支援 Netscape 格式的 Cookies 匯出擴充功能，在該網站分頁匯出目前網站的 Cookies；工具選項可參考 [yt-dlp 官方 FAQ](https://github.com/yt-dlp/yt-dlp/wiki/FAQ#how-do-i-pass-cookies-to-yt-dlp)。不要只把單一 Cookie 值或 JSON 改名成 `.txt`。
3. 將檔案保存在 repo 外的私人資料夾。在 MediaFetch 的「登入 Cookies」選「cookies.txt 檔案」，再按「選擇」指定檔案。
4. 重新解析影片後下載。若登出、登入狀態過期或網站使憑證失效，重新登入並匯出新檔，再重新選取。

檔案第一行通常是 `# Netscape HTTP Cookie File` 或 `# HTTP Cookie File`。Bilibili 登入態通常需要有效的 `SESSDATA`；YouTube 或其他網站的 Cookies 不能代替 Bilibili 的登入狀態。

cookies.txt 等同帳號登入憑證，請勿分享，也不要提交到版本控制。

## 使用限制

MediaFetch 不提供 DRM 繞過，也不保證能下載私人、登入限定、付費或受平台技術保護的內容。請只下載你有權存取、保存與使用的內容，並遵守來源網站的條款與適用法律。

## 開發環境

- Windows 10 / 11
- Python 3.11+（包含 Windows 的 `py` 啟動器，腳本用 `py -3` 建立虛擬環境）
- PySide6-Essentials
- yt-dlp（含 `yt-dlp-ejs`）
- Deno 2.9.6（腳本自動下載並驗證 SHA-256）
- imageio-ffmpeg

### 執行開發版

在 Windows PowerShell 5.1 或更新版本中：

```powershell
cd <repo>\media-fetch
.\scripts\run.ps1
```

腳本會先準備 `vendor\deno.exe`，再建立 `.venv`、安裝相依套件並啟動 MediaFetch。Deno 壓縮檔會先驗證官方 release 的 SHA-256，`vendor/` 不會提交到 Git。

首次執行需能連線 GitHub 與 Python 套件來源。若 PowerShell 顯示禁止執行指令碼，可針對這次執行使用：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\run.ps1
```

## 測試

```powershell
cd <repo>\media-fetch
py -3 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -e ".[dev]"
.\.venv\Scripts\python.exe -m pytest
.\.venv\Scripts\python.exe -m ruff check src tests
```

## 建立 Windows EXE

```powershell
cd <repo>\media-fetch
.\scripts\build.ps1
```

成功後輸出：

```text
dist\MediaFetch.exe
```

打包後可直接執行 `MediaFetch.cmd` 啟動，它會找同層 `dist\MediaFetch.exe`，所以整個 `media-fetch` 目錄搬到任何位置都能用。

搬動後，先前記住的下載資料夾與 Cookies 檔案仍是原本的路徑，必要時請重新選擇。若打包腳本被執行原則阻擋，可使用 `powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\build.ps1`。

`build.ps1` 會準備 Deno、跑單元測試與 Ruff static check，通過後才執行 PyInstaller，並把 Deno 與 FFmpeg 一起封裝到 `MediaFetch.exe`。目前打包目標為 Windows x64。

## 更新下載核心

在 `media-fetch` 目錄執行：

```powershell
.\.venv\Scripts\python.exe -m pip install --upgrade "yt-dlp[default]"
```

這只更新開發環境；已打包 EXE 不會跟著更新。使用 EXE 時，先關閉 MediaFetch，再執行 `scripts/build.ps1` 重新打包，之後開啟新的 `dist/MediaFetch.exe`。取得 repo 的新修正後，也需要重新打包才會套用到 EXE。

## 疑難排解

| 狀況 | 處理 |
|---|---|
| 找不到 `py` | 安裝 Python 3.11 以上並包含 Python 啟動器，重新開 PowerShell 後確認 `py -3 --version` 可執行 |
| 禁止執行 PowerShell 指令碼 | 使用上方針對單次腳本的 `-ExecutionPolicy Bypass` 指令；受組織原則管理時請依管理規範處理 |
| 找不到 pytest 或 Ruff | 在 `media-fetch` 目錄安裝 `.[dev]`，使用上方測試指令，不要使用其他 Python 環境 |
| Cookies 資料庫被鎖住或無法解密 | 關閉對應瀏覽器；仍失敗時改用該網站新匯出的 cookies.txt |
| 提供 Cookies 後仍要求登入 | 確認匯出的是正確網站、帳號與有效登入狀態，再重新解析；Threads 不支援登入限定貼文 |
| Bilibili 解析成功但下載出現 HTTP 567 | 確認使用已包含分段下載修正的新版本；舊 EXE 需重建。仍失敗時確認瀏覽器能播放同一分集，稍後重新解析重試，並檢查代理／VPN 是否影響影音 CDN 連線 |
| 其他網站突然無法解析或下載 | 先確認瀏覽器可播放，必要時更新 Cookies、更新下載核心；EXE 需重建，不保證更新就能恢復所有網站 |
| 啟動 EXE 顯示 QtWidgets DLL 錯誤 | 使用目前的 `build.ps1` 重建；腳本會優先搜尋 Windows 系統 DLL，避免打包時收進其他工具的不相容 ICU DLL |
| `MediaFetch.cmd` 找不到程式 | 先完成打包，確認它旁邊存在 `dist/MediaFetch.exe`；不要只搬走 `.cmd` |

回報問題時附上來源網站、可公開分享的影片網址、格式選項、Cookies 來源類型與完整錯誤文字；不要附 Cookies 內容。

## 目錄

```text
media-fetch/
├─ src/media_fetch/        # 應用程式與 UI
├─ tests/                  # 不連外的單元測試
├─ scripts/                # Windows 執行 / 打包 / Deno 準備腳本
├─ vendor/                 # 建置時產生，不進 Git
├─ dist/                   # 打包產出，不進 Git
├─ MediaFetch.cmd          # 啟動已打包的 MediaFetch.exe
├─ pyproject.toml
└─ README.md
```

## V0.1 暫不處理

- 播放清單 / 批次下載。
- 字幕與縮圖下載。
- yt-dlp 核心自動更新按鈕。
- 應用程式自動更新。
