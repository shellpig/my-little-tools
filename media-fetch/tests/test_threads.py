import json

import pytest

from media_fetch.threads import (
    ThreadsPostNotFound,
    canonical_post_url,
    extract_post_code,
    is_threads_url,
    parse_threads_info,
)

POST_URL = "https://www.threads.com/@someone/post/AbC123-_x"


def _page(*posts: dict) -> str:
    """Wrap posts the way Threads embeds them: one JSON block per script tag."""
    blocks = "".join(
        f'<script type="application/json" data-sjs>{json.dumps({"require": [[post]]})}</script>'
        for post in posts
    )
    return f"<html><body>{blocks}</body></html>"


def _video_post(code: str = "AbC123-_x", **overrides: object) -> dict:
    post = {
        "pk": "111",
        "code": code,
        "media_type": 2,
        "caption": {"text": "值嗎？"},
        "user": {"username": "someone"},
        "video_duration": 12.5,
        "original_width": 1276,
        "original_height": 720,
        "video_versions": [
            {"type": 101, "url": "https://cdn.example/high.mp4"},
            {"type": 102, "url": "https://cdn.example/low.mp4"},
        ],
    }
    post.update(overrides)
    return post


@pytest.mark.parametrize(
    ("url", "expected"),
    [
        ("https://www.threads.com/@a/post/xyz", True),
        ("https://threads.net/@a/post/xyz", True),
        ("https://www.threads.com/share/FGYadqpJC/", True),
        ("https://x.com/a/status/1", False),
    ],
)
def test_is_threads_url(url: str, expected: bool) -> None:
    assert is_threads_url(url) is expected


def test_extract_post_code() -> None:
    assert extract_post_code(POST_URL + "/media?xmt=abc") == "AbC123-_x"
    assert extract_post_code("https://www.threads.com/share/FGYadqpJC/") is None


@pytest.mark.parametrize(
    ("url", "expected"),
    [
        (POST_URL + "/media?xmt=abc", POST_URL + "?xmt=abc"),
        (POST_URL + "/", POST_URL),
        (POST_URL, POST_URL),
        ("https://www.threads.com/share/FGYadqpJC/", "https://www.threads.com/share/FGYadqpJC/"),
    ],
)
def test_canonical_post_url_drops_sub_routes(url: str, expected: str) -> None:
    assert canonical_post_url(url) == expected


def test_parse_threads_info_builds_yt_dlp_dict() -> None:
    info = parse_threads_info(_page(_video_post()), "AbC123-_x", POST_URL)

    assert info["id"] == "111"
    assert info["title"] == "值嗎？"
    assert info["extractor_key"] == "Threads"
    assert info["duration"] == 12.5
    assert (info["width"], info["height"]) == (1276, 720)
    assert [f["format_id"] for f in info["formats"]] == ["101", "102"]
    assert info["formats"][0]["url"] == "https://cdn.example/high.mp4"
    assert info["formats"][0]["height"] == 720
    assert info["formats"][0]["quality"] > info["formats"][1]["quality"]


def test_parse_threads_info_picks_target_post_among_related() -> None:
    other = _video_post(code="OTHER", video_versions=[{"type": 101, "url": "https://x/no.mp4"}])
    info = parse_threads_info(_page(other, _video_post()), "AbC123-_x", POST_URL)

    assert info["formats"][0]["url"] == "https://cdn.example/high.mp4"


def test_parse_threads_info_uses_first_carousel_video() -> None:
    post = _video_post(
        video_versions=[],
        carousel_media=[
            {"pk": "p1", "image_versions2": {}},
            {"pk": "p2", "video_versions": [{"type": 101, "url": "https://cdn.example/c.mp4"}]},
        ],
    )
    info = parse_threads_info(_page(post), "AbC123-_x", POST_URL)

    assert info["id"] == "p2"
    assert info["formats"][0]["url"] == "https://cdn.example/c.mp4"


def test_parse_threads_info_falls_back_to_placeholder_title() -> None:
    info = parse_threads_info(_page(_video_post(caption=None)), "AbC123-_x", POST_URL)

    assert info["title"] == "Threads 貼文 AbC123-_x"


def test_parse_threads_info_rejects_photo_only_post() -> None:
    post = _video_post(video_versions=[], image_versions2={"candidates": []})
    with pytest.raises(ThreadsPostNotFound, match="沒有影片"):
        parse_threads_info(_page(post), "AbC123-_x", POST_URL)


def test_parse_threads_info_rejects_missing_post() -> None:
    with pytest.raises(ThreadsPostNotFound, match="找不到"):
        parse_threads_info(_page(_video_post(code="OTHER")), "AbC123-_x", POST_URL)
