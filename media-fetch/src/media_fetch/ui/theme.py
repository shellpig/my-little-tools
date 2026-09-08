from __future__ import annotations

"""Theme configuration and Qt Style Sheets for MediaFetch.

Palette (4-color hierarchy):
  1. Canvas Background: #181B22 (Deep soft slate black)
  2. Card Surface:      #222734 (Slate blue card with #303848 border)
  3. Accent Blue:       #2563EB / #3B82F6 (Vibrant blue for primary actions & progress)
  4. Text & Feedback:   #F1F5F9 (Primary text), #94A3B8 (Muted labels), #38BDF8 (Status & badges)
"""

APP_STYLESHEET = """
QMainWindow, QWidget#centralWidget {
    background-color: #181B22;
    color: #F1F5F9;
    font-family: "Segoe UI", "Microsoft JhengHei UI", sans-serif;
}

/* Header typography */
QLabel#titleLabel {
    color: #FFFFFF;
    font-size: 24px;
    font-weight: 700;
}

QLabel#subtitleLabel {
    color: #94A3B8;
    font-size: 13px;
}

QLabel#statusLabel {
    color: #38BDF8;
    font-size: 13px;
    font-weight: 500;
}

QLabel#disclaimerLabel {
    color: #7E8B9F;
    font-size: 11px;
}

/* General Labels & Info Grid */
QLabel {
    color: #E2E8F0;
    font-size: 13px;
}

QLabel#infoKey {
    color: #94A3B8;
    font-size: 13px;
}

QLabel#infoValue {
    color: #F1F5F9;
    font-size: 13px;
    font-weight: 500;
}

QLabel#platformBadge {
    color: #38BDF8;
    font-size: 13px;
    font-weight: 600;
}

/* GroupBox as modern rounded cards */
QGroupBox {
    background-color: #222734;
    border: 1px solid #303848;
    border-radius: 8px;
    margin-top: 10px;
    padding-top: 14px;
    padding-bottom: 10px;
    padding-left: 12px;
    padding-right: 12px;
    font-size: 12px;
    font-weight: 600;
    color: #93C5FD;
}

QGroupBox::title {
    subcontrol-origin: margin;
    subcontrol-position: top left;
    left: 12px;
    padding: 0 4px;
    background-color: #181B22;
    color: #93C5FD;
}

/* Text inputs */
QLineEdit {
    background-color: #161920;
    border: 1px solid #3A4458;
    border-radius: 6px;
    min-height: 28px;
    padding: 2px 10px;
    color: #F1F5F9;
    font-size: 13px;
    selection-background-color: #2563EB;
}

QLineEdit:hover {
    border-color: #4D5A75;
}

QLineEdit:focus {
    border: 1px solid #3B82F6;
    background-color: #191E28;
}

QLineEdit:read-only {
    background-color: #1A1D26;
    color: #CBD5E1;
}

QLineEdit:disabled {
    background-color: #14171E;
    color: #556073;
    border-color: #242936;
}

/* ComboBox */
QComboBox {
    background-color: #161920;
    border: 1px solid #3A4458;
    border-radius: 6px;
    min-height: 28px;
    padding: 2px 10px;
    color: #F1F5F9;
    font-size: 13px;
}

QComboBox:hover {
    border-color: #4D5A75;
}

QComboBox:focus {
    border: 1px solid #3B82F6;
}

QComboBox:disabled {
    background-color: #14171E;
    color: #556073;
    border-color: #242936;
}

QComboBox QAbstractItemView {
    background-color: #222734;
    border: 1px solid #3A4458;
    border-radius: 6px;
    color: #F1F5F9;
    selection-background-color: #2563EB;
    selection-color: #FFFFFF;
    outline: none;
    padding: 4px;
}

/* Push buttons */
QPushButton {
    background-color: #2D3444;
    border: 1px solid #3D465C;
    border-radius: 7px;
    min-height: 26px;
    padding: 6px 16px;
    color: #E2E8F0;
    font-size: 13px;
    font-weight: 500;
}

QPushButton:hover {
    background-color: #373F52;
    border-color: #4E5974;
    color: #FFFFFF;
}

QPushButton:pressed {
    background-color: #232938;
}

QPushButton:disabled {
    background-color: #1B1F2A;
    border-color: #252A38;
    color: #4D5668;
}

/* Primary Call-To-Action Button */
QPushButton#primaryButton {
    background-color: #2563EB;
    border: 1px solid #3B82F6;
    border-radius: 8px;
    color: #FFFFFF;
    font-size: 14px;
    font-weight: 600;
}

QPushButton#primaryButton:hover {
    background-color: #3B82F6;
    border-color: #60A5FA;
}

QPushButton#primaryButton:pressed {
    background-color: #1D4ED8;
}

QPushButton#primaryButton:disabled {
    background-color: #1D2638;
    border-color: #27344E;
    color: #556885;
}

/* Progress bar */
QProgressBar {
    background-color: #161920;
    border: 1px solid #2D3546;
    border-radius: 6px;
    height: 18px;
    text-align: center;
    color: #F1F5F9;
    font-size: 11px;
    font-weight: 600;
}

QProgressBar::chunk {
    background: qlineargradient(x1:0, y1:0, x2:1, y2:0, stop:0 #2563EB, stop:1 #38BDF8);
    border-radius: 5px;
}

/* Tooltips & Message Boxes */
QToolTip {
    background-color: #222734;
    border: 1px solid #3A4458;
    color: #F1F5F9;
    padding: 6px 8px;
    font-size: 12px;
    border-radius: 4px;
}

QMessageBox {
    background-color: #181B22;
}

QMessageBox QLabel {
    color: #F1F5F9;
    font-size: 13px;
}
"""
