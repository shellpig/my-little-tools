import pytest

from media_fetch.bilibili import BaseBiliBiliIE, BiliBiliIE


@pytest.mark.parametrize("locale", ["", "zh-Hans/", "zh-Hant/", "en/"])
def test_localized_video_preserves_part_and_query(monkeypatch, locale):
    seen = []
    monkeypatch.setattr(BaseBiliBiliIE, "_real_extract", lambda self, url: seen.append(url))
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
