from media_fetch import backend


def test_base_options_configures_deno_when_available(monkeypatch) -> None:
    monkeypatch.setattr(backend, "_deno_location", lambda: r"C:\\MediaFetch\\deno.exe")

    options = backend.MediaBackend._base_options()

    assert options["js_runtimes"] == {"deno": {"path": r"C:\\MediaFetch\\deno.exe"}}


def test_base_options_omits_deno_when_unavailable(monkeypatch) -> None:
    monkeypatch.setattr(backend, "_deno_location", lambda: None)

    options = backend.MediaBackend._base_options()

    assert "js_runtimes" not in options
