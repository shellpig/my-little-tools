# Downloads the pinned mpv and ImageMagick builds next to this script.
# Run: powershell -ExecutionPolicy Bypass -File setup.ps1

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'   # the progress bar makes downloads very slow on PowerShell 5.1
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$mpvUrl    = 'https://github.com/shinchiro/mpv-winbuild-cmake/releases/download/20261021/mpv-x86_64-v3-20261021-git-e471496c56.7z'
$magickUrl = 'https://github.com/ImageMagick/ImageMagick/releases/download/7.1.2-34/ImageMagick-7.1.2-34-portable-Q16-x64.7z'

$root = $PSScriptRoot
$tmp = Join-Path $root '_download'
New-Item -ItemType Directory -Force $tmp | Out-Null

function Install-Archive($name, $url, $dest, $check) {
    if (Test-Path (Join-Path $dest $check)) {
        Write-Host "$name already installed, skipping."
        return
    }
    $file = Join-Path $tmp ([IO.Path]::GetFileName($url))
    Write-Host "Downloading $name ..."
    Invoke-WebRequest $url -OutFile $file -UseBasicParsing
    New-Item -ItemType Directory -Force $dest | Out-Null
    # Windows 10 1803+ ships bsdtar, which can read .7z.
    & "$env:SystemRoot\System32\tar.exe" -xf $file -C $dest
    if ($LASTEXITCODE -ne 0) { throw "Extracting $name failed." }
    Write-Host "$name installed."
}

try {
    Install-Archive 'mpv' $mpvUrl $root 'mpv.exe'
    Install-Archive 'ImageMagick' $magickUrl (Join-Path $root 'magick') 'magick.exe'
} finally {
    Remove-Item -Recurse -Force $tmp
}

Write-Host ''
Write-Host 'Done. Next: run mpv-register.bat, then set mpv as the default app (see README.md).'
