from __future__ import annotations

from pathlib import Path
from typing import Any

from PySide6.QtCore import QObject, Signal, Slot

from ..backend import DownloadCancelled, MediaBackend
from ..models import DownloadPreset, MediaInfo


class InspectWorker(QObject):
    finished = Signal(object)
    failed = Signal(str)

    def __init__(self, backend: MediaBackend, url: str) -> None:
        super().__init__()
        self._backend = backend
        self._url = url

    @Slot()
    def run(self) -> None:
        try:
            info: MediaInfo = self._backend.inspect(self._url)
        except Exception as exc:
            self.failed.emit(str(exc))
            return
        self.finished.emit(info)


class DownloadWorker(QObject):
    progress = Signal(object)
    finished = Signal(str)
    cancelled = Signal(str)
    failed = Signal(str)

    def __init__(
        self,
        backend: MediaBackend,
        url: str,
        preset: DownloadPreset,
        download_dir: Path,
    ) -> None:
        super().__init__()
        self._backend = backend
        self._url = url
        self._preset = preset
        self._download_dir = download_dir

    @Slot()
    def run(self) -> None:
        try:
            path = self._backend.download(
                self._url,
                self._preset,
                self._download_dir,
                self._emit_progress,
            )
        except DownloadCancelled as exc:
            self.cancelled.emit(str(exc))
            return
        except Exception as exc:
            self.failed.emit(str(exc))
            return
        self.finished.emit(str(path))

    def _emit_progress(self, data: dict[str, Any]) -> None:
        self.progress.emit(data)
