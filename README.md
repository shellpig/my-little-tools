# my-little-tools

個人小工具與小作品合集。各子專案獨立執行，沒有共用的安裝或建置流程。

| 專案 | 用途 | 平台與入口 |
|---|---|---|
| [MediaFetch](media-fetch/README.md) | 下載公開影片或轉成 MP3，支援登入 Cookies | Windows x64；開發執行或自行打包 EXE |
| [media-player](media-player/README.md) | 播放影片、圖片、音訊，支援圖片裁切另存 | Windows x64；先執行安裝腳本下載 mpv 與 ImageMagick |
| [小鎮](small-town/README.md) | Three.js 迷你小鎮，可散步、編輯與經營火車小鎮 | 支援 WebGL 的瀏覽器；[線上體驗](https://small-town.wetwareassembly.com/)或本機起站 |

## 取得專案

有 Git 的話：

```powershell
git clone https://github.com/shellpig/my-little-tools.git
cd my-little-tools
```

也可以在 GitHub 選 **Code → Download ZIP**，解壓後進入要使用的子資料夾，依該專案 README 操作。小鎮的線上版不需要下載 repo。

## 從哪裡開始

- **下載影片**：進入 `media-fetch`，依 README 執行 `scripts/run.ps1`；若已有自行打包的 `dist/MediaFetch.exe`，可雙擊 `MediaFetch.cmd`。Git 原始碼不包含打包好的 EXE。
- **播放媒體**：進入 `media-player`，依 README 執行 `setup.ps1`，再設定檔案關聯。下載的執行檔不在 Git 裡。
- **玩小鎮**：直接開線上版；本機版在安裝 Python 後雙擊 `small-town/start.bat`，詳見小鎮 README。

各專案的系統需求、操作、測試與限制以對應 README 為準。桌面工具的首次安裝與小鎮載入 Three.js 都需要網路。

## 開發與文件

- MediaFetch 的 Python 虛擬環境在 `media-fetch/.venv/`；測試與打包指令見其 README。
- 播放器主要是 `portable_config/` 下的 mpv 設定與 Lua 腳本。
- 小鎮是純靜態網站，不需要 npm 建置；開發進度與規格索引見 [PROJECT_BRIEF.md](small-town/PROJECT_BRIEF.md)。

下載的媒體、Cookies、虛擬環境與打包產物不要提交到 Git；`.claude/`、`output/` 是本機工具設定與工作產物。
