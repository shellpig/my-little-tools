@echo off
chcp 65001 >nul
set "EXE=%~dp0dist\MediaFetch.exe"
if not exist "%EXE%" goto :missing
start "" "%EXE%"
exit /b 0

:missing
echo 找不到 %EXE%
echo 請先在 PowerShell 執行 scripts\build.ps1 打包。
pause
exit /b 1
