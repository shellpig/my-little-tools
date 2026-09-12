"""Threads (threads.com) support.

yt-dlp has no Threads extractor. Threads server-renders the post, including the
signed CDN video URLs, into ``<script type="application/json">`` blocks — but only
for requests that look like a browser navigation. This module fetches the page
with those headers and turns the embedded post into a yt-dlp info dict.
"""

from __future__ import annotations

import gzip
import json
import re
import urllib.request
from typing import Any
from urllib.parse import urlparse, urlunparse

THREADS_HOSTS: frozenset[str] = frozenset(
    {"threads.com", "www.threads.com", "threads.net", "www.threads.net"}
)

# The server returns an empty JS shell unless all three are present.
_NAVIGATION_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Sec-Fetch-Mode": "navigate",
}

_POST_CODE = re.compile(r"/post/([A-Za-z0-9_-]+)")
# Sub-routes such as /media render the post differently (no caption); fetch the canonical page.
_POST_SUFFIX = re.compile(r"(/post/[A-Za-z0-9_-]+)/.*$")
_JSON_BLOCK = re.compile(r'<script type="application/json"[^>]*>(.*?)</script>', re.S)


class ThreadsPostNotFound(RuntimeError):
    pass


def is_threads_url(url: str) -> bool:
    return urlparse(url).netloc.lower() in THREADS_HOSTS


def extract_post_code(url: str) -> str | None:
    match = _POST_CODE.search(urlparse(url).path)
    return match.group(1) if match else None


def canonical_post_url(url: str) -> str:
    parsed = urlparse(url)
    path = _POST_SUFFIX.sub(lambda match: match.group(1), parsed.path)
    return urlunparse(parsed._replace(path=path))


def fetch_threads_info(url: str) -> dict[str, Any]:
    """Resolve a Threads post or share link to a yt-dlp info dict."""
    request = urllib.request.Request(canonical_post_url(url), headers=_NAVIGATION_HEADERS)
    with urllib.request.urlopen(request, timeout=20) as response:
        final_url = response.geturl()
        raw = response.read()
        if response.headers.get("Content-Encoding") == "gzip":
            raw = gzip.decompress(raw)
    code = extract_post_code(final_url)
    if code is None:
        raise ThreadsPostNotFound("這不是 Threads 貼文網址。")
    return parse_threads_info(raw.decode("utf-8", "replace"), code, final_url)


def parse_threads_info(html: str, code: str, webpage_url: str) -> dict[str, Any]:
    post = _find_post(html, code)
    if post is None:
        raise ThreadsPostNotFound("找不到這則 Threads 貼文，它可能需要登入或已被刪除。")
    media = _first_video_item(post)
    if media is None:
        raise ThreadsPostNotFound("這則 Threads 貼文沒有影片。")
    versions = media["video_versions"]
    caption = (post.get("caption") or {}).get("text")
    user = (post.get("user") or {}).get("username")
    return {
        "id": str(media.get("pk") or post.get("pk") or code),
        "title": str(caption or f"Threads 貼文 {code}"),
        "uploader": user,
        "webpage_url": webpage_url,
        "extractor": "threads",
        "extractor_key": "Threads",
        "duration": media.get("video_duration"),
        "width": media.get("original_width"),
        "height": media.get("original_height"),
        "formats": [
            {
                "format_id": str(version.get("type", index)),
                "url": version["url"],
                "ext": "mp4",
                "width": media.get("original_width") if index == 0 else None,
                "height": media.get("original_height") if index == 0 else None,
                "quality": -index,
                "http_headers": {"User-Agent": _NAVIGATION_HEADERS["User-Agent"]},
            }
            for index, version in enumerate(versions)
            if version.get("url")
        ],
    }


def _find_post(html: str, code: str) -> dict[str, Any] | None:
    marker = re.compile(r'"code"\s*:\s*"' + re.escape(code) + '"')
    for block in _JSON_BLOCK.findall(html):
        if not marker.search(block):
            continue
        try:
            data = json.loads(block)
        except ValueError:
            continue
        post = _walk_for_post(data, code)
        if post is not None:
            return post
    return None


def _walk_for_post(node: Any, code: str) -> dict[str, Any] | None:
    if isinstance(node, dict):
        if node.get("code") == code and "media_type" in node:
            return node
        for value in node.values():
            found = _walk_for_post(value, code)
            if found is not None:
                return found
    elif isinstance(node, list):
        for value in node:
            found = _walk_for_post(value, code)
            if found is not None:
                return found
    return None


def _first_video_item(post: dict[str, Any]) -> dict[str, Any] | None:
    candidates = [post, *(post.get("carousel_media") or [])]
    for item in candidates:
        if isinstance(item, dict) and item.get("video_versions"):
            return item
    return None
