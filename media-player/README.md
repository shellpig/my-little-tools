# media-player

雙擊就開的輕量播放器（Windows）：

- 看影片：mp4，包含手機常見的 HEVC / H.265
- 看圖：jpg、png，可以用滑鼠裁切另存
- 聽音樂：mp3、wav

底層是 [mpv](https://mpv.io)，裁切存檔用 [ImageMagick](https://imagemagick.org)。這個資料夾只放設定與腳本，兩個執行檔由安裝腳本下載。

## 安裝

需求：Windows 10（1803 以後）或 Windows 11，64 位元。

### 1. 下載 mpv 與 ImageMagick

在本資料夾開 PowerShell，執行：

```powershell
powershell -ExecutionPolicy Bypass -File setup.ps1
```

會下載約 47 MB，解壓到本資料夾（`mpv.exe`）與 `magick/`。已經裝過的會跳過，可以重複執行。

> 下載的是 `x86_64-v3` 版 mpv，需要支援 AVX2 的 CPU（約 2015 年以後）。舊電腦請把 `setup.ps1` 裡 `$mpvUrl` 的 `-v3` 拿掉（同一個 release 的 `mpv-x86_64-<日期>-git-<hash>.7z`）。

### 2. 讓 mpv 出現在「開啟檔案」清單

雙擊 `mpv-register.bat`，看到完成訊息後按任意鍵關閉。只寫入目前使用者的設定。

### 3. 設定預設程式

對 `.mp4`、`.jpg`、`.png`、`.mp3`、`.wav` 各做一次：

1. 對檔案按右鍵 → **開啟檔案** → **選擇其他應用程式**
2. 選 **mpv**（沒看到就按「在這部電腦上選擇應用程式」，選本資料夾的 `mpv.exe`）
3. 按 **一律使用**

Windows 11 不允許程式自動改預設程式，這一步只能手動。

完成後雙擊這些檔案就會用 mpv 開啟。

> 安裝後不要搬動資料夾；搬了的話重新做第 2 步。

## 操作

| 按鍵 | 圖片 | 影片 | 音訊 |
|---|---|---|---|
| ← → | 上 / 下一張 | 倒退 / 快轉 | 上 / 下一首 |
| PgUp PgDn | 上 / 下一個檔案 | 上 / 下一個檔案 | 上 / 下一個檔案 |
| 滾輪 | 縮放 | mpv 預設 | mpv 預設 |
| `c` | 進入裁切模式 | — | — |
| Esc | 關閉（裁切模式中是取消裁切） | 關閉 | 關閉 |

- 切換檔案只在同一個資料夾、同一類（影片 / 圖片 / 音訊）之間，依檔名的自然排序（`img2` 在 `img10` 前面）。
- 滑鼠移到畫面下方會出現控制列，標題列顯示 `[第幾個/共幾個] 解析度  檔名`。
- 其他按鍵是 mpv 預設：空白鍵暫停、`f` 全螢幕、`9` `0` 音量、`m` 靜音。
- 超過一分鐘的影片會記住播放位置，下次打開從上次停下的地方繼續。

### 裁切圖片

1. 看圖時按 `c`，畫面底部出現提示列。
2. 用滑鼠拖拉畫出裁切框。
3. 調整：拖四角或四邊的控制點改大小、拖框內移動、在框外拖拉重畫。
4. 比例：`1` 自由、`2` 1:1、`3` 4:3、`4` 16:9、`R` 直橫互換（例如 4:3 ↔ 3:4）。
5. Enter 存檔，Esc 取消。

存檔規則：

- 存成同資料夾的 `原檔名_crop.jpg`；已存在時依序為 `_crop_2`、`_crop_3`…，**不會覆蓋任何檔案**。
- JPEG 品質 95。
- 手機直拍照片的 EXIF 旋轉會先轉正；PNG 的透明部分填白色。

## 疑難排解

| 狀況 | 處理 |
|---|---|
| `setup.ps1` 說無法執行指令碼 | 用上面那行 `-ExecutionPolicy Bypass` 的指令執行，不要直接雙擊 |
| 裁切按 Enter 顯示「存檔失敗」 | 確認 `magick\magick.exe` 存在，沒有就重新執行 `setup.ps1` |
| 「開啟檔案」清單裡沒有 mpv | 重新執行 `mpv-register.bat` |

## 檔案

```
setup.ps1                      下載 mpv 與 ImageMagick
portable_config/
  mpv.conf                     播放設定
  input.conf                   PgUp / PgDn、Esc
  script-opts/osc.conf         控制列標題加上解析度
  scripts/keys.lua             依檔案類型決定 ← → 與滾輪的作用
  scripts/crop.lua             圖片裁切
```

要更新 mpv 或 ImageMagick：改 `setup.ps1` 裡的兩個網址，刪掉舊的 `mpv.exe` 或 `magick/`，再執行一次。
