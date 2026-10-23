# media-player

雙擊就開的輕量播放器：看影片（mp4，含 HEVC）、看圖（jpg / png）、聽音樂（mp3 / wav），圖片可裁切另存。底層是 [mpv](https://mpv.io)，這個資料夾只管設定與腳本。

## 安裝

執行檔不進 git，第一次要自己放：

| 檔案 | 來源 | 放到 |
|---|---|---|
| mpv | [shinchiro/mpv-winbuild-cmake releases](https://github.com/shinchiro/mpv-winbuild-cmake/releases)，`mpv-x86_64-v3-*.7z`（舊 CPU 用不帶 `v3` 的） | 解壓到本資料夾，`mpv.exe` 與 `portable_config/` 同層 |
| ImageMagick | [ImageMagick releases](https://github.com/ImageMagick/ImageMagick/releases)，`ImageMagick-*-portable-Q16-x64.7z` | 解壓到 `magick/`，即 `magick/magick.exe` |

### 檔案關聯

1. 執行 `mpv-register.bat`（把 mpv 登記為可選的預設程式）。
2. 對 `.mp4 .jpg .png .mp3 .wav` 各做一次：右鍵 → 開啟檔案 → 選擇其他應用程式 → mpv → 一律使用。

Windows 11 不允許腳本直接改預設程式，第 2 步只能手動。

## 操作

| 按鍵 | 圖片 | 影片 | 音訊 |
|---|---|---|---|
| ← → | 上 / 下一張 | 倒退 / 快轉 | 上 / 下一首 |
| PgUp PgDn | 上 / 下一個檔案 | 同左 | 同左 |
| 滾輪 | 縮放 | mpv 預設 | mpv 預設 |
| `c` | 裁切模式 | — | — |
| Esc | 關閉（裁切模式中為取消裁切） | 關閉 | 關閉 |

切換只在同一資料夾、同一類型（影片 / 圖片 / 音訊）之間。其餘按鍵為 mpv 預設，例如空白鍵暫停、`f` 全螢幕。

### 裁切

按 `c` 進入，畫面底部會顯示提示。拖拉畫框，拖控制點調大小、拖框內移動；`1` 自由、`2` 1:1、`3` 4:3、`4` 16:9、`R` 直橫互換；Enter 存檔、Esc 取消。

存成同資料夾的 `原檔名_crop.jpg`（已存在則 `_crop_2`、`_crop_3`…），JPEG 品質 95，不會覆蓋原檔。EXIF 旋轉會先轉正，PNG 透明處填白。

## 檔案

```
portable_config/
  mpv.conf          播放設定
  input.conf        PgUp / PgDn、Esc
  script-opts/osc.conf  底部列標題加上解析度
  scripts/keys.lua  依檔案類型切換 ← → 與滾輪
  scripts/crop.lua  圖片裁切
```
