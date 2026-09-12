from media_fetch.models import DownloadPreset, MediaInfo


def test_preset_labels_are_unique() -> None:
    labels = [preset.label for preset in DownloadPreset]
    assert len(labels) == len(set(labels))


def test_platform_labels_cover_v01_targets() -> None:
    cases = {
        "Youtube": "YouTube",
        "Instagram": "Instagram",
        "Facebook": "Facebook",
        "Twitter": "X",
        "TikTok": "TikTok",
        "Threads": "Threads",
    }
    for extractor, expected in cases.items():
        info = MediaInfo("x", extractor, None, None, None, "")
        assert info.platform_label == expected
