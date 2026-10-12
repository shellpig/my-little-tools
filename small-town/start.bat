@echo off
chcp 65001 >nul
rem Serve the town over http (browsers block loading models from file://)
rem and open it in the default browser. Close this window to stop.
cd /d "%~dp0"

set PORT=8766
set PY=python
where python >nul 2>nul || set PY=py
where %PY% >nul 2>nul || (
  echo 找不到 Python，請先安裝 https://www.python.org/downloads/
  pause
  exit /b 1
)

echo 小鎮：http://localhost:%PORT%/
echo 關閉這個視窗即可停止。
start "" cmd /c "timeout /t 1 >nul & start http://localhost:%PORT%/"
%PY% -m http.server %PORT% --bind 127.0.0.1
pause
