import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import pytest

from media_fetch.bilibili import BaseBiliBiliIE, BiliBiliIE


@pytest.mark.parametrize("locale", ["", "zh-Hans/", "zh-Hant/", "en/"])
def test_localized_video_preserves_part_and_query(monkeypatch, locale):
    seen = []
    monkeypatch.setattr(
        BaseBiliBiliIE, "_real_extract", lambda self, url: seen.append(url) or {"formats": []}
    )
    url = f"https://www.bilibili.com/{locale}video/BV1jLug6LEgp/?p=2"
    assert BiliBiliIE.suitable(url)
    BiliBiliIE()._real_extract(url)
    expected_locale = locale or "zh-Hans/"
    assert seen == [f"https://www.bilibili.com/{expected_locale}video/BV1jLug6LEgp/?p=2"]


def test_registration_overrides_builtin_before_generic():
    from yt_dlp import YoutubeDL

    with YoutubeDL({"quiet": True}) as ydl:
        ydl.add_info_extractor(BiliBiliIE())
        extractor = next(
            ie for ie in ydl._ies.values()
            if ie.suitable("https://www.bilibili.com/zh-Hans/video/BV1jLug6LEgp/")
        )
        assert isinstance(extractor, BiliBiliIE)


@pytest.mark.parametrize("resume", [False, True])
def test_download_uses_ranges_and_preserves_all_bytes(monkeypatch, tmp_path, resume):
    from yt_dlp import YoutubeDL

    payload = bytes(range(256)) * 8193
    ranges = []

    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            requested = self.headers.get("Range")
            if not requested:
                self.send_error(567)
                return
            start, end = requested.removeprefix("bytes=").split("-")
            start = int(start)
            end = min(int(end), len(payload) - 1) if end else len(payload) - 1
            ranges.append((start, end))
            self.send_response(206)
            self.send_header("Content-Range", f"bytes {start}-{end}/{len(payload)}")
            self.send_header("Content-Length", str(end - start + 1))
            self.end_headers()
            self.wfile.write(payload[start:end + 1])

        def log_message(self, *args):
            pass

    server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    output = tmp_path / "video.mp4"
    resume_size = 32768 if resume else 0
    if resume:
        output.with_suffix(".mp4.part").write_bytes(payload[:resume_size])
    monkeypatch.setattr(BaseBiliBiliIE, "_real_extract", lambda self, url: {
        "id": "BV1MKHQ62EL3_p2",
        "title": "Range download regression",
        "formats": [{
            "format_id": "test",
            "url": f"http://127.0.0.1:{server.server_port}/video.mp4",
            "ext": "mp4",
        }],
    })
    try:
        with YoutubeDL({
            "quiet": True, "noprogress": True, "retries": 0,
            "outtmpl": str(output), "cachedir": False,
        }) as ydl:
            ydl.add_info_extractor(BiliBiliIE())
            ydl.extract_info("https://www.bilibili.com/video/BV1MKHQ62EL3/?p=2")
        assert output.read_bytes() == payload
        assert ranges[0][0] == resume_size
        assert len(ranges) >= 3
    finally:
        server.shutdown()
        server.server_close()
        thread.join()
