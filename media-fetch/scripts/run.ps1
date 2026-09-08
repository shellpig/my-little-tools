$ErrorActionPreference = "Stop"

$ToolRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ToolRoot

& "$PSScriptRoot\prepare-deno.ps1"

if (-not (Test-Path ".venv\Scripts\python.exe")) {
    py -3 -m venv .venv
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

.\.venv\Scripts\python.exe -m pip install -e .
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

.\.venv\Scripts\python.exe -m media_fetch
