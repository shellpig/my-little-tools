$ErrorActionPreference = "Stop"

$ToolRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ToolRoot

& "$PSScriptRoot\prepare-deno.ps1"

if (-not (Test-Path ".venv\Scripts\python.exe")) {
    py -3 -m venv .venv
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

.\.venv\Scripts\python.exe -m pip install --upgrade pip
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

.\.venv\Scripts\python.exe -m pip install -e ".[dev]"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

.\.venv\Scripts\python.exe -m pytest
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

.\.venv\Scripts\python.exe -m ruff check src tests
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

.\.venv\Scripts\python.exe -m PyInstaller `
    --noconfirm `
    --clean `
    --onefile `
    --windowed `
    --name MediaFetch `
    --paths src `
    --collect-binaries imageio_ffmpeg `
    --add-binary "vendor\deno.exe;." `
    src\media_fetch\__main__.py
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Build complete: $ToolRoot\dist\MediaFetch.exe"
