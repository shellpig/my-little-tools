@echo off
chcp 65001 >nul
rem Stop the server start.bat launched: Python's http.server on this port.
set PORT=8766

powershell -NoProfile -Command "$p = Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -match 'http\.server %PORT%' }; if (-not $p) { exit 1 }; $p | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"
if errorlevel 1 (
  echo 沒有正在執行的小鎮伺服器。
) else (
  echo 小鎮伺服器已停止。
)
pause
