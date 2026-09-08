from pathlib import Path

from media_fetch import backend


def test_base_options_configures_deno_when_available(monkeypatch) -> None:
    monkeypatch.setattr(backend, "_deno_location", lambda: r"C:\\MediaFetch\\deno.exe")

    options = backend.MediaBackend._base_options()

    assert options["js_runtimes"] == {"deno": {"path": r"C:\\MediaFetch\\deno.exe"}}


def test_base_options_omits_deno_when_unavailable(monkeypatch) -> None:
    monkeypatch.setattr(backend, "_deno_location", lambda: None)

    options = backend.MediaBackend._base_options()

    assert "js_runtimes" not in options


def test_base_options_adds_cookies_when_browser_selected(monkeypatch) -> None:
    monkeypatch.setattr(backend, "_deno_location", lambda: None)

    options = backend.MediaBackend._base_options("firefox")

    assert options["cookiesfrombrowser"] == ("firefox", None, None, None)


def test_base_options_omits_cookies_by_default(monkeypatch) -> None:
    monkeypatch.setattr(backend, "_deno_location", lambda: None)

    options = backend.MediaBackend._base_options()

    assert "cookiesfrombrowser" not in options


def test_base_options_adds_cookie_file_when_selected(monkeypatch, tmp_path: Path) -> None:
    monkeypatch.setattr(backend, "_deno_location", lambda: None)
    cookie_file = tmp_path / "cookies.txt"
    cookie_file.write_text("# Netscape HTTP Cookie File", encoding="utf-8")

    options = backend.MediaBackend._base_options(None, str(cookie_file))

    assert options["cookiefile"] == str(cookie_file)


def test_base_options_omits_cookie_file_by_default(monkeypatch) -> None:
    monkeypatch.setattr(backend, "_deno_location", lambda: None)

    options = backend.MediaBackend._base_options()

    assert "cookiefile" not in options
