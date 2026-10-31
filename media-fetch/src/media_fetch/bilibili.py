from urllib.parse import urlsplit, urlunsplit

from yt_dlp.extractor.bilibili import BiliBiliIE as BaseBiliBiliIE


class BiliBiliIE(BaseBiliBiliIE):
    """Use Bilibili's localized player page with the upstream extractor."""

    _VALID_URL = BaseBiliBiliIE._VALID_URL.replace(
        "(?:video/", "(?:(?:(?:en|zh-Hans|zh-Hant)/)?video/"
    )

    def _real_extract(self, url):
        parsed = urlsplit(url)
        if parsed.path.startswith("/video/"):
            url = urlunsplit(parsed._replace(path="/zh-Hans" + parsed.path))
        info = super()._real_extract(url)
        # Some Bilibili CDNs reject requests without a bounded byte range (HTTP 567).
        for fmt in info.get("formats", []):
            fmt.setdefault("downloader_options", {})["http_chunk_size"] = 1024 * 1024
        return info
