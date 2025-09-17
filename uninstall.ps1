# ytdl-tui Windows Uninstaller Script

# --- 1. Administrator Check ---
Write-Host "Checking for Administrator privileges..."
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "This script requires Administrator privileges to remove software and modify the system PATH." -ForegroundColor Red
    Write-Host "Please re-run this script in a PowerShell window that is 'Run as Administrator'." -ForegroundColor Red
    if ($Host.Name -eq "ConsoleHost") {
        Write-Host "Press any key to exit..."
        $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null
    }
    exit 1
}
Write-Host "Administrator privileges confirmed." -ForegroundColor Green

# --- 2. Define Paths ---
$InstallDir = "C:\Program Files\ytdl-tui"
$BinDir = Join-Path $InstallDir "bin"

# --- 3. Remove from PATH ---
Write-Host "Checking system PATH for $BinDir..."
$machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
if ($machinePath -like "*$BinDir*") {
    Write-Host "Removing $BinDir from system PATH..."
    $newPath = ($machinePath.Split(';') | Where-Object { $_ -and $_ -ne $BinDir }) -join ';'
    [Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
    Write-Host "System PATH updated." -ForegroundColor Green
} else {
    Write-Host "$BinDir was not found in the system PATH."
}

# --- 4. Remove Installation Directory ---
if (Test-Path -Path $InstallDir) {
    Write-Host "Removing application directory: $InstallDir"
    Remove-Item -Path $InstallDir -Recurse -Force
    Write-Host "Application directory removed." -ForegroundColor Green
} else {
    Write-Host "Application directory not found at $InstallDir."
}

Write-Host "`nUninstallation complete!" -ForegroundColor Cyan
Write-Host "Please restart your terminal or open a new one for PATH changes to take full effect." -ForegroundColor Cyan
