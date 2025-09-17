# ytdl-tui Windows Installer Script

# --- 1. Administrator Check ---
Write-Host "Checking for Administrator privileges..."
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "This script requires Administrator privileges to install software and modify the system PATH." -ForegroundColor Red
    Write-Host "Please re-run this script in a PowerShell window that is 'Run as Administrator'." -ForegroundColor Red
    # Pause to allow user to read the message before the window closes.
    if ($Host.Name -eq "ConsoleHost") {
        Write-Host "Press any key to exit..."
        $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null
    }
    exit 1
}
Write-Host "Administrator privileges confirmed." -ForegroundColor Green

# --- 2. Dependency Management ---

# Helper function to check for a command
function Command-Exists {
    param([string]$command)
    return [bool](Get-Command $command -ErrorAction SilentlyContinue)
}

# --- Install Node.js and npm ---
if (-not (Command-Exists "node") -or -not (Command-Exists "npm")) {
    Write-Host "Node.js and/or npm not found. Attempting installation..."
    if (Command-Exists "winget") {
        try {
            Write-Host "Attempting to install Node.js via winget..."
            winget install --id OpenJS.NodeJS.LTS -e --accept-package-agreements --accept-source-agreements
        } catch {
            Write-Warning "winget install failed. You may need to install Node.js manually."
            exit 1
        }
    } else {
        Write-Warning "winget not found. Please install Node.js manually from https://nodejs.org/ and re-run this script."
        exit 1
    }
} else {
    Write-Host "Node.js and npm are already installed." -ForegroundColor Green
}

# --- 3. Application Installation ---
$InstallDir = "C:\Program Files\ytdl-tui"
$BinDir = Join-Path $InstallDir "bin"

Write-Host "Installing application to $InstallDir"
New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
New-Item -ItemType Directory -Force -Path $BinDir | Out-Null

# --- Install yt-dlp ---
if (-not (Command-Exists "yt-dlp")) {
    Write-Host "yt-dlp not found. Attempting installation..."
    if (Command-Exists "winget") {
        try {
            Write-Host "Attempting to install yt-dlp via winget..."
            winget install --id Gyan.yt-dlp -e --accept-package-agreements --accept-source-agreements
        } catch {
            Write-Warning "winget install failed. Attempting direct download."
            # Fallback to direct download into our bin directory
            $ytDlpPath = Join-Path $BinDir "yt-dlp.exe"
            Invoke-WebRequest -Uri "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe" -OutFile $ytDlpPath
            Write-Host "yt-dlp.exe downloaded to $ytDlpPath"
        }
    } else {
        Write-Warning "winget not found. Downloading yt-dlp directly."
        $ytDlpPath = Join-Path $BinDir "yt-dlp.exe"
        Invoke-WebRequest -Uri "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe" -OutFile $ytDlpPath
        Write-Host "yt-dlp.exe downloaded to $ytDlpPath"
    }
} else {
    Write-Host "yt-dlp is already installed." -ForegroundColor Green
}


# Copy application files
$SourceDir = $PSScriptRoot
Write-Host "Copying application files from $SourceDir"
$filesToCopy = Get-ChildItem -Path $SourceDir -Exclude "install.ps1", "uninstall.ps1", "install.sh", "uninstall.sh"
foreach ($file in $filesToCopy) {
    Copy-Item -Path $file.FullName -Destination $InstallDir -Recurse -Force
}

# Install Node.js dependencies
Write-Host "Installing Node.js dependencies..."
Push-Location -Path $InstallDir
npm install
Pop-Location

# --- 4. Create Wrapper and Add to PATH ---
Write-Host "Creating 'ytd.bat' command wrapper..."
$wrapperPath = Join-Path $BinDir "ytd.bat"
$wrapperContent = @"
@echo off
node "%~dp0..\index.js" %*
"@
Set-Content -Path $wrapperPath -Value $wrapperContent

# Add BinDir to system PATH if it's not already there
Write-Host "Updating system PATH..."
$machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
if ($machinePath -notlike "*$BinDir*") {
    $newPath = $machinePath + ";" + $BinDir
    [Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
    $env:Path += ";$BinDir" # Update current session PATH
    Write-Host "$BinDir has been added to the system PATH." -ForegroundColor Green
} else {
    Write-Host "$BinDir is already in the system PATH."
}

Write-Host "`nInstallation complete!" -ForegroundColor Cyan
Write-Host "Please restart your terminal or open a new one to use the 'ytd' command." -ForegroundColor Cyan
