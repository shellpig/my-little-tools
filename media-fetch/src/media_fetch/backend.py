from __future__ import annotations

import threading
from collections.abc import Callable
from pathlib import Path
from typing import Any

from .core import build_format_selector, build_output_template, media_info_from_ydl, normalize_url
from .models import DownloadPreset, MediaInfo

ProgressCallback = Callable[[dict[str, Any]], None]


class DownloadCancelled(RuntimeError):
    pass


class MediaBackend:
    """Thin wrapper around yt-dlp so UI code stays independent from extractor details."""

    def __init__(self) -> None:
        self._cancel_event = threading.Event()

    def cancel(self) -> None:
        self._cancel_event.set()

    def reset_cancel(self) -> None:
        self._cancel_event.clear()

    def inspect(self, raw_url: str) -> MediaInfo:
        url = normalize_url(raw_url)
        yt_dlp = _import_yt_dlp()
        with yt_dlp.YoutubeDL(self._base_options()) as ydl:
            info = ydl.extract_info(url, download=False)
        if not isinstance(info, dict):
            raise RuntimeError("無法取得影片資訊。")
        return media_info_from_ydl(info)

    def download(
        self,
        raw_url: str,
        preset: DownloadPreset,
        download_dir: Path,
        progress_callback: ProgressCallback | None = None,
    ) -> Path:
        url = normalize_url(raw_url)
        download_dir = download_dir.expanduser().resolve()
        download_dir.mkdir(parents=True, exist_ok=True)
        self.reset_cancel()

        yt_dlp = _import_yt_dlp()
        final_path: Path | None = None

        def progress_hook(data: dict[str, Any]) -> None:
            nonlocal final_path
            if self._cancel_event.is_set():
                raise DownloadCancelled("下載已取消。")
            filename = data.get("filename")
            if filename:
                final_path = Path(str(filename))
            if progress_callback:
                progress_callback(data)

        options = self._base_options()
        options.update(
            {
                "format": build_format_selector(preset),
                "outtmpl": build_output_template(download_dir),
                "windowsfilenames": True,
                "continuedl": True,
                "overwrites": False,
                "noplaylist": True,
                "progress_hooks": [progress_hook],
                "ffmpeg_location": _ffmpeg_location(),
            }
        )

        if preset is DownloadPreset.MP3:
            options["postprocessors"] = [
                {
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": "mp3",
                    "preferredquality": "192",
                }
            ]
        else:
            options["merge_output_format"] = "mp4"

        try:
            with yt_dlp.YoutubeDL(options) as ydl:
                info = ydl.extract_info(url, download=True)
                if self._cancel_event.is_set():
                    raise DownloadCancelled("下載已取消。")
                if isinstance(info, dict):
                    final_path = self._resolve_final_path(ydl, info, preset)
        except DownloadCancelled:
            raise
        except Exception as exc:
            if self._cancel_event.is_set():
                raise DownloadCancelled("下載已取消。") from exc
            raise

        if final_path is None:
            raise RuntimeError("下載完成，但無法判斷輸出檔案位置。")
        return final_path

    @staticmethod
    def _resolve_final_path(
        ydl: Any,
        info: dict[str, Any],
        preset: DownloadPreset,
    ) -> Path:
        prepared = Path(str(ydl.prepare_filename(info)))
        if preset is DownloadPreset.MP3:
            return prepared.with_suffix(".mp3")
        if prepared.suffix.lower() != ".mp4":
            return prepared.with_suffix(".mp4")
        return prepared

    @staticmethod
    def _base_options() -> dict[str, Any]:
        return {
            "quiet": True,
            "no_warnings": True,
            "noplaylist": True,
        }


def _ffmpeg_location() -> str:
    try:
        import imageio_ffmpeg

        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception as exc:  # pragma: no cover - environment-specific dependency failure
        raise RuntimeError("找不到 FFmpeg。請重新安裝 MediaFetch。") from exc


def _import_yt_dlp() -> Any:
    try:
        import yt_dlp

        return yt_dlp
    except ImportError as exc:  # pragma: no cover - packaging/environment failure
        raise RuntimeError("找不到 yt-dlp 下載核心。請重新安裝 MediaFetch。") from exc
