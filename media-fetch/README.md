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

目標網站包含 YouTube、Instagram、Facebook、X、TikTok；實際可下載內容仍取決於 `yt-dlp` 對網站當下版本的支援，以及內容是否需要登入、是否有地區限制或 DRM。

## 登入 Cookies

需要登入才看得到的內容，可以在「登入 Cookies」提供登入狀態，有兩種來源：

- **從瀏覽器讀取**：選擇對應的瀏覽器。讀取前請先完全關閉該瀏覽器，否則 cookies 資料庫會被鎖住。
- **cookies.txt 檔案**：指定 Netscape 格式的 cookies.txt。

Chrome 127 起以 App-Bound Encryption 保護 cookies 的加密金鑰，yt-dlp 無法解密，Edge 也一樣；這兩個瀏覽器即使完全關閉仍讀不到，只能改用 cookies.txt。Firefox 的 cookies 未經作業系統加密，可直接讀取。

cookies.txt 等同帳號登入憑證，請勿分享，也不要提交到版本控制。

## 使用限制

MediaFetch 不提供 DRM 繞過，也不保證能下載私人、登入限定、付費或受平台技術保護的內容。請只下載你有權存取、保存與使用的內容，並遵守來源網站的條款與適用法律。

## 開發環境

- Windows 10 / 11
- Python 3.11+
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

## 測試

```powershell
cd <repo>\media-fetch
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

`build.ps1` 會準備 Deno、跑單元測試與 Ruff static check，通過後才執行 PyInstaller，並把 Deno 與 FFmpeg 一起封裝到 `MediaFetch.exe`。目前打包目標為 Windows x64。

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
