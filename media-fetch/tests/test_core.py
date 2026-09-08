from pathlib import Path

import pytest

from media_fetch.core import (
    InvalidMediaUrl,
    build_format_selector,
    build_output_template,
    format_bytes,
    format_duration,
    media_info_from_ydl,
    normalize_url,
)
from media_fetch.models import DownloadPreset


def test_normalize_url_trims_valid_http_url() -> None:
    assert normalize_url("  https://example.com/video  ") == "https://example.com/video"


@pytest.mark.parametrize("value", ["", "example.com/video", "ftp://example.com/file"])
def test_normalize_url_rejects_invalid_values(value: str) -> None:
    with pytest.raises(InvalidMediaUrl):
        normalize_url(value)


def test_format_duration() -> None:
    assert format_duration(65) == "1:05"
    assert format_duration(3661) == "1:01:01"
    assert format_duration(None) == "未知"


def test_format_bytes() -> None:
    assert format_bytes(1024) == "1.0 KB"
    assert format_bytes(5 * 1024 * 1024) == "5.0 MB"
    assert format_bytes(None) == ""


def test_build_format_selector_limits_resolution() -> None:
    assert "height<=1080" in build_format_selector(DownloadPreset.MP4_1080)
    assert "height<=720" in build_format_selector(DownloadPreset.MP4_720)
    assert build_format_selector(DownloadPreset.MP3) == "bestaudio/best"


def test_output_template_is_inside_requested_directory(tmp_path: Path) -> None:
    template = build_output_template(tmp_path)
    assert str(tmp_path) in template
    assert "%(title).180B" in template


def test_media_info_from_ydl_prefers_requested_dimensions() -> None:
    info = media_info_from_ydl(
        {
            "title": "Example",
            "extractor_key": "Youtube",
            "duration": 61.9,
            "width": 640,
            "height": 360,
            "webpage_url": "https://example.com/watch/1",
            "requested_downloads": [{"width": 1920, "height": 1080}],
        }
    )
    assert info.title == "Example"
    assert info.platform_label == "YouTube"
    assert info.duration_seconds == 61
    assert info.resolution_label == "1920×1080"
