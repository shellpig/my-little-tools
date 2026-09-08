from __future__ import annotations

from pathlib import Path
from typing import Any

from PySide6.QtCore import QSettings, QThread, QUrl, Slot
from PySide6.QtGui import QDesktopServices
from PySide6.QtWidgets import (
    QComboBox,
    QFileDialog,
    QGridLayout,
    QGroupBox,
    QHBoxLayout,
    QLabel,
    QLineEdit,
    QMainWindow,
    QMessageBox,
    QProgressBar,
    QPushButton,
    QSizePolicy,
    QVBoxLayout,
    QWidget,
)

from ..backend import MediaBackend
from ..core import format_bytes, format_duration, normalize_url
from ..models import DownloadPreset, MediaInfo
from .workers import DownloadWorker, InspectWorker


class MainWindow(QMainWindow):
    def __init__(self) -> None:
        super().__init__()
        self.setWindowTitle("MediaFetch")
        self.resize(760, 520)
        self.setMinimumSize(680, 470)

        self._settings = QSettings("shellpig", "MediaFetch")
        self._backend = MediaBackend()
        self._thread: QThread | None = None
        self._worker: object | None = None
        self._last_file: Path | None = None

        self._build_ui()
        self._load_settings()
        self._set_idle_state()

    def _build_ui(self) -> None:
        root = QWidget(self)
        layout = QVBoxLayout(root)
        layout.setContentsMargins(24, 22, 24, 22)
        layout.setSpacing(16)

        title = QLabel("MediaFetch")
        title.setStyleSheet("font-size: 26px; font-weight: 700;")
        subtitle = QLabel("貼上公開影片網址，解析後選擇格式並下載到電腦。")
        subtitle.setStyleSheet("color: #666;")
        layout.addWidget(title)
        layout.addWidget(subtitle)

        url_box = QGroupBox("影片網址")
        url_layout = QHBoxLayout(url_box)
        self.url_edit = QLineEdit()
        self.url_edit.setPlaceholderText("https://www.youtube.com/watch?v=... 或其他支援網站")
        self.url_edit.returnPressed.connect(self.start_inspect)
        self.paste_button = QPushButton("貼上")
        self.paste_button.clicked.connect(self.paste_url)
        self.inspect_button = QPushButton("解析")
        self.inspect_button.clicked.connect(self.start_inspect)
        url_layout.addWidget(self.url_edit, 1)
        url_layout.addWidget(self.paste_button)
        url_layout.addWidget(self.inspect_button)
        layout.addWidget(url_box)

        info_box = QGroupBox("影片資訊")
        info_layout = QGridLayout(info_box)
        self.platform_value = QLabel("—")
        self.title_value = QLabel("尚未解析")
        self.title_value.setWordWrap(True)
        self.duration_value = QLabel("—")
        self.resolution_value = QLabel("—")
        info_layout.addWidget(QLabel("來源"), 0, 0)
        info_layout.addWidget(self.platform_value, 0, 1)
        info_layout.addWidget(QLabel("標題"), 1, 0)
        info_layout.addWidget(self.title_value, 1, 1)
        info_layout.addWidget(QLabel("長度"), 2, 0)
        info_layout.addWidget(self.duration_value, 2, 1)
        info_layout.addWidget(QLabel("解析度"), 3, 0)
        info_layout.addWidget(self.resolution_value, 3, 1)
        info_layout.setColumnStretch(1, 1)
        layout.addWidget(info_box)

        options_box = QGroupBox("下載設定")
        options_layout = QGridLayout(options_box)
        self.preset_combo = QComboBox()
        for preset in DownloadPreset:
            self.preset_combo.addItem(preset.label, preset.value)
        self.directory_edit = QLineEdit()
        self.directory_edit.setReadOnly(True)
        self.browse_button = QPushButton("瀏覽")
        self.browse_button.clicked.connect(self.choose_directory)
        options_layout.addWidget(QLabel("格式"), 0, 0)
        options_layout.addWidget(self.preset_combo, 0, 1, 1, 2)
        options_layout.addWidget(QLabel("儲存位置"), 1, 0)
        options_layout.addWidget(self.directory_edit, 1, 1)
        options_layout.addWidget(self.browse_button, 1, 2)
        options_layout.setColumnStretch(1, 1)
        layout.addWidget(options_box)

        self.progress_bar = QProgressBar()
        self.progress_bar.setRange(0, 100)
        self.progress_bar.setValue(0)
        self.progress_bar.setTextVisible(True)
        layout.addWidget(self.progress_bar)

        self.status_label = QLabel("準備就緒")
        self.status_label.setWordWrap(True)
        self.status_label.setStyleSheet("color: #555;")
        layout.addWidget(self.status_label)

        actions = QHBoxLayout()
        self.download_button = QPushButton("開始下載")
        self.download_button.setMinimumHeight(38)
        self.download_button.setSizePolicy(QSizePolicy.Policy.Expanding, QSizePolicy.Policy.Fixed)
        self.download_button.clicked.connect(self.start_download)
        self.cancel_button = QPushButton("取消")
        self.cancel_button.clicked.connect(self.cancel_download)
        self.open_file_button = QPushButton("開啟檔案")
        self.open_file_button.clicked.connect(self.open_last_file)
        self.open_folder_button = QPushButton("開啟資料夾")
        self.open_folder_button.clicked.connect(self.open_download_folder)
        actions.addWidget(self.download_button, 1)
        actions.addWidget(self.cancel_button)
        actions.addWidget(self.open_file_button)
        actions.addWidget(self.open_folder_button)
        layout.addLayout(actions)

        disclaimer = QLabel("請只下載你有權存取與保存的內容；MediaFetch 不處理 DRM 繞過。")
        disclaimer.setStyleSheet("color: #777; font-size: 11px;")
        disclaimer.setWordWrap(True)
        layout.addWidget(disclaimer)
        layout.addStretch(1)

        self.setCentralWidget(root)

    def _load_settings(self) -> None:
        default_dir = str(Path.home() / "Downloads")
        saved_dir = str(self._settings.value("download_dir", default_dir))
        self.directory_edit.setText(saved_dir)
        saved_preset = str(self._settings.value("preset", DownloadPreset.MP4_1080.value))
        index = self.preset_combo.findData(saved_preset)
        self.preset_combo.setCurrentIndex(index if index >= 0 else 0)

    def _save_settings(self) -> None:
        self._settings.setValue("download_dir", self.directory_edit.text())
        self._settings.setValue("preset", self.preset_combo.currentData())

    @Slot()
    def paste_url(self) -> None:
        from PySide6.QtWidgets import QApplication

        self.url_edit.setText(QApplication.clipboard().text().strip())
        self.url_edit.setFocus()

    @Slot()
    def choose_directory(self) -> None:
        current = self.directory_edit.text() or str(Path.home() / "Downloads")
        chosen = QFileDialog.getExistingDirectory(self, "選擇下載資料夾", current)
        if chosen:
            self.directory_edit.setText(chosen)
            self._save_settings()

    @Slot()
    def start_inspect(self) -> None:
        if self._thread is not None:
            return
        try:
            url = normalize_url(self.url_edit.text())
        except ValueError as exc:
            self._show_error(str(exc))
            return

        self._set_busy_state("正在解析影片資訊…", cancellable=False)
        thread = QThread(self)
        worker = InspectWorker(self._backend, url)
        worker.moveToThread(thread)
        thread.started.connect(worker.run)
        worker.finished.connect(self._inspect_succeeded)
        worker.failed.connect(self._operation_failed)
        worker.finished.connect(worker.deleteLater)
        worker.failed.connect(worker.deleteLater)
        worker.finished.connect(thread.quit)
        worker.failed.connect(thread.quit)
        thread.finished.connect(self._clear_worker)
        self._thread = thread
        self._worker = worker
        thread.start()

    @Slot(object)
    def _inspect_succeeded(self, info: object) -> None:
        if not isinstance(info, MediaInfo):
            self._operation_failed("解析結果格式不正確。")
            return
        self.platform_value.setText(info.platform_label)
        self.title_value.setText(info.title)
        self.duration_value.setText(format_duration(info.duration_seconds))
        self.resolution_value.setText(info.resolution_label)
        self.status_label.setText("解析完成，可以開始下載。")
        self.progress_bar.setRange(0, 100)
        self.progress_bar.setValue(0)

    @Slot()
    def start_download(self) -> None:
        if self._thread is not None:
            return
        try:
            url = normalize_url(self.url_edit.text())
        except ValueError as exc:
            self._show_error(str(exc))
            return

        directory = Path(self.directory_edit.text().strip())
        if not self.directory_edit.text().strip():
            self._show_error("請先選擇下載資料夾。")
            return
        try:
            directory.mkdir(parents=True, exist_ok=True)
        except OSError as exc:
            self._show_error(f"無法使用下載資料夾：{exc}")
            return

        self._save_settings()
        self._backend.reset_cancel()
        preset = DownloadPreset(str(self.preset_combo.currentData()))
        self._set_busy_state("準備下載…", cancellable=True)
        self.progress_bar.setRange(0, 0)

        thread = QThread(self)
        worker = DownloadWorker(self._backend, url, preset, directory)
        worker.moveToThread(thread)
        thread.started.connect(worker.run)
        worker.progress.connect(self._download_progress)
        worker.finished.connect(self._download_succeeded)
        worker.cancelled.connect(self._download_cancelled)
        worker.failed.connect(self._operation_failed)
        worker.finished.connect(worker.deleteLater)
        worker.cancelled.connect(worker.deleteLater)
        worker.failed.connect(worker.deleteLater)
        worker.finished.connect(thread.quit)
        worker.cancelled.connect(thread.quit)
        worker.failed.connect(thread.quit)
        thread.finished.connect(self._clear_worker)
        self._thread = thread
        self._worker = worker
        thread.start()

    @Slot(object)
    def _download_progress(self, data: object) -> None:
        if not isinstance(data, dict):
            return
        status = data.get("status")
        if status == "downloading":
            total = data.get("total_bytes") or data.get("total_bytes_estimate")
            downloaded = data.get("downloaded_bytes") or 0
            speed = data.get("speed")
            eta = data.get("eta")
            if total:
                percent = max(0, min(100, int(downloaded * 100 / total)))
                self.progress_bar.setRange(0, 100)
                self.progress_bar.setValue(percent)
            else:
                self.progress_bar.setRange(0, 0)

            parts = ["下載中"]
            if total:
                parts.append(f"{format_bytes(downloaded)} / {format_bytes(total)}")
            elif downloaded:
                parts.append(format_bytes(downloaded))
            if speed:
                parts.append(f"{format_bytes(speed)}/s")
            if eta is not None:
                parts.append(f"剩餘約 {format_duration(eta)}")
            self.status_label.setText(" · ".join(parts))
        elif status == "finished":
            self.progress_bar.setRange(0, 0)
            self.status_label.setText("下載完成，正在合併或轉檔…")

    @Slot(str)
    def _download_succeeded(self, path_text: str) -> None:
        self._last_file = Path(path_text)
        self.progress_bar.setRange(0, 100)
        self.progress_bar.setValue(100)
        self.status_label.setText(f"下載完成：{self._last_file.name}")
        self.open_file_button.setEnabled(True)
        self.open_folder_button.setEnabled(True)

    @Slot(str)
    def _download_cancelled(self, message: str) -> None:
        self.progress_bar.setRange(0, 100)
        self.progress_bar.setValue(0)
        self.status_label.setText(message or "下載已取消。")

    @Slot(str)
    def _operation_failed(self, message: str) -> None:
        self.progress_bar.setRange(0, 100)
        self.progress_bar.setValue(0)
        self.status_label.setText("操作失敗。")
        self._show_error(message)

    @Slot()
    def _clear_worker(self) -> None:
        thread = self._thread
        self._thread = None
        self._worker = None
        if thread is not None:
            thread.deleteLater()
        self._set_idle_state()

    @Slot()
    def cancel_download(self) -> None:
        self.cancel_button.setEnabled(False)
        self.status_label.setText("正在取消…")
        self._backend.cancel()

    @Slot()
    def open_last_file(self) -> None:
        if self._last_file and self._last_file.exists():
            QDesktopServices.openUrl(QUrl.fromLocalFile(str(self._last_file)))
        elif self._last_file:
            self._show_error("找不到剛才下載的檔案。")

    @Slot()
    def open_download_folder(self) -> None:
        folder = Path(self.directory_edit.text().strip())
        if folder.exists():
            QDesktopServices.openUrl(QUrl.fromLocalFile(str(folder)))
        else:
            self._show_error("下載資料夾不存在。")

    def _set_busy_state(self, message: str, *, cancellable: bool) -> None:
        self.status_label.setText(message)
        self.url_edit.setEnabled(False)
        self.paste_button.setEnabled(False)
        self.inspect_button.setEnabled(False)
        self.preset_combo.setEnabled(False)
        self.browse_button.setEnabled(False)
        self.download_button.setEnabled(False)
        self.cancel_button.setEnabled(cancellable)
        self.open_file_button.setEnabled(False)

    def _set_idle_state(self) -> None:
        self.url_edit.setEnabled(True)
        self.paste_button.setEnabled(True)
        self.inspect_button.setEnabled(True)
        self.preset_combo.setEnabled(True)
        self.browse_button.setEnabled(True)
        self.download_button.setEnabled(True)
        self.cancel_button.setEnabled(False)
        self.open_file_button.setEnabled(bool(self._last_file and self._last_file.exists()))
        self.open_folder_button.setEnabled(True)

    def _show_error(self, message: str) -> None:
        QMessageBox.critical(self, "MediaFetch", message)

    def closeEvent(self, event: Any) -> None:  # noqa: N802 - Qt API name
        if self._thread is not None:
            QMessageBox.information(self, "MediaFetch", "請先等待目前的操作完成或取消下載。")
            event.ignore()
            return
        self._save_settings()
        event.accept()
