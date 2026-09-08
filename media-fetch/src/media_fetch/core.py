from __future__ import annotations

from pathlib import Path
from urllib.parse import urlparse

from .models import DownloadPreset, MediaInfo


class InvalidMediaUrl(ValueError):
    pass


def normalize_url(raw_url: str) -> str:
    url = raw_url.strip()
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise InvalidMediaUrl("請輸入有效的 http(s) 影片網址。")
    return url


def format_duration(seconds: int | float | None) -> str:
    if seconds is None or seconds < 0:
        return "未知"
    total = int(seconds)
    hours, remainder = divmod(total, 3600)
    minutes, secs = divmod(remainder, 60)
    if hours:
        return f"{hours}:{minutes:02d}:{secs:02d}"
    return f"{minutes}:{secs:02d}"


def format_bytes(value: int | float | None) -> str:
    if value is None or value < 0:
        return ""
    amount = float(value)
    units = ("B", "KB", "MB", "GB", "TB")
    for unit in units:
        if amount < 1024 or unit == units[-1]:
            if unit == "B":
                return f"{int(amount)} {unit}"
            return f"{amount:.1f} {unit}"
        amount /= 1024
    return ""


def build_format_selector(preset: DownloadPreset) -> str:
    if preset is DownloadPreset.BEST_MP4:
        return "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best"
    if preset is DownloadPreset.MP4_1080:
        return (
            "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/"
            "best[height<=1080][ext=mp4]/best[height<=1080]"
        )
    if preset is DownloadPreset.MP4_720:
        return (
            "bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/"
            "best[height<=720][ext=mp4]/best[height<=720]"
        )
    if preset is DownloadPreset.MP3:
        return "bestaudio/best"
    raise ValueError(f"Unsupported preset: {preset}")


def build_output_template(download_dir: Path) -> str:
    return str(download_dir / "%(title).180B [%(id)s].%(ext)s")


def media_info_from_ydl(data: dict) -> MediaInfo:
    requested = data.get("requested_downloads") or []
    selected = requested[0] if requested else data
    return MediaInfo(
        title=str(data.get("title") or "未命名影片"),
        extractor=str(data.get("extractor_key") or data.get("extractor") or ""),
        duration_seconds=_as_int(data.get("duration")),
        width=_as_int(selected.get("width") or data.get("width")),
        height=_as_int(selected.get("height") or data.get("height")),
        webpage_url=str(data.get("webpage_url") or data.get("original_url") or ""),
    )


def _as_int(value: object) -> int | None:
    if value is None:
        return None
    try:
        return int(value)
    except (TypeError, ValueError):
        return None
