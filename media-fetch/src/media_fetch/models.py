from __future__ import annotations

from dataclasses import dataclass
from enum import Enum


class DownloadPreset(str, Enum):
    BEST_MP4 = "best_mp4"
    MP4_1080 = "mp4_1080"
    MP4_720 = "mp4_720"
    MP3 = "mp3"

    @property
    def label(self) -> str:
        return {
            self.BEST_MP4: "MP4 影片 - 最高畫質",
            self.MP4_1080: "MP4 影片 - 1080p 以下",
            self.MP4_720: "MP4 影片 - 720p 以下",
            self.MP3: "MP3 音訊",
        }[self]


@dataclass(frozen=True, slots=True)
class MediaInfo:
    title: str
    extractor: str
    duration_seconds: int | None
    width: int | None
    height: int | None
    webpage_url: str

    @property
    def platform_label(self) -> str:
        key = self.extractor.lower()
        if "youtube" in key:
            return "YouTube"
        if "instagram" in key:
            return "Instagram"
        if "facebook" in key:
            return "Facebook"
        if key in {"twitter", "x"} or "twitter" in key:
            return "X"
        if "tiktok" in key:
            return "TikTok"
        return self.extractor or "未知網站"

    @property
    def resolution_label(self) -> str:
        if self.width and self.height:
            return f"{self.width}×{self.height}"
        if self.height:
            return f"{self.height}p"
        return "未知"
