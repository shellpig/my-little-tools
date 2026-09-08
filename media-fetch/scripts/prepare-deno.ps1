$ErrorActionPreference = "Stop"

$DenoVersion = "2.9.6"
$ExpectedSha256 = "15e5300b0ba3c3695a7621d90160a746ec9e710228cee639afa9d580f6e3cd11"
$ToolRoot = Split-Path -Parent $PSScriptRoot
$VendorDir = Join-Path $ToolRoot "vendor"
$DenoExe = Join-Path $VendorDir "deno.exe"
$ZipPath = Join-Path $VendorDir "deno-x86_64-pc-windows-msvc.zip"
$DownloadUrl = "https://github.com/denoland/deno/releases/download/v$DenoVersion/deno-x86_64-pc-windows-msvc.zip"

if (Test-Path $DenoExe) {
    Write-Host "Deno runtime already prepared: $DenoExe"
    return
}

New-Item -ItemType Directory -Path $VendorDir -Force | Out-Null

# GitHub requires TLS 1.2 on older Windows PowerShell environments.
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

Write-Host "Downloading Deno $DenoVersion..."
Invoke-WebRequest -Uri $DownloadUrl -OutFile $ZipPath -UseBasicParsing

$ActualSha256 = (Get-FileHash -Path $ZipPath -Algorithm SHA256).Hash.ToLowerInvariant()
if ($ActualSha256 -ne $ExpectedSha256) {
    Remove-Item $ZipPath -Force -ErrorAction SilentlyContinue
    throw "Deno archive checksum mismatch. Expected $ExpectedSha256 but got $ActualSha256."
}

Expand-Archive -Path $ZipPath -DestinationPath $VendorDir -Force
Remove-Item $ZipPath -Force

if (-not (Test-Path $DenoExe)) {
    throw "Deno archive was extracted, but deno.exe was not found."
}

Write-Host "Deno runtime prepared: $DenoExe"
