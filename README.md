# ytdl-tui: A Terminal User Interface for yt-dlp

`ytdl-tui` is a sleek and interactive Terminal User Interface (TUI) built with Node.js for the powerful `yt-dlp` video downloader. It provides a user-friendly way to download videos and audio from various platforms, offering real-time progress updates, customizable settings, and a modern terminal experience.

## Features

*   **Interactive TUI:** Navigate with keyboard (Tab, Shift+Tab, Arrow Keys) and mouse.
*   **URL Input:** Easily paste video URLs for download.
*   **Real-time Download Progress Bar:** Visual feedback on download progress.
*   **Configurable Settings:**
    *   Set custom download paths.
    *   Choose desired video/audio formats.
    *   Specify quality preferences.
    *   Option to download subtitles.
    *   Customize output filename template.
*   **Torrenting (Seeding):** Create and seed torrents directly from the TUI with real-time progress updates.
*   **Clean Log Output:** View detailed `yt-dlp` messages and application status.

## Installation

The recommended way to install ytdl-tui is by using the provided installation scripts. These scripts will automatically handle dependencies (like `yt-dlp` and `Node.js`) and add the `ytd` command to your system's path, making it runnable from anywhere.

### For Linux

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/aaron123126/YTDownloadUI.git
    cd YTDownloadUI
    ```

2.  **Run the installation script:**
    ```bash
    # Make the script executable
    chmod +x install.sh
    # Run with sudo for system-wide installation
    sudo ./install.sh
    ```
    The script will install the application to `/usr/local/lib/ytdl` and place the `ytd` command in `/usr/local/bin`. To remove the application, you can run `sudo ./uninstall.sh`.

### For Windows

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/aaron123126/YTDownloadUI.git
    cd YTDownloadUI
    ```

2.  **Run the installation script:**
    *   Right-click on the PowerShell icon and select **"Run as Administrator"**.
    *   Navigate to the repository directory (`cd YTDownloadUI`).
    *   Run the installer script. You may need to bypass the PowerShell execution policy.
    ```powershell
    PowerShell -ExecutionPolicy Bypass -File .\install.ps1
    ```
    The script will install the application to `C:\Program Files\ytdl-tui` and add its `bin` directory to the system's PATH. To remove the application, run `uninstall.ps1` (also as Administrator).

## Usage

After a successful installation, open a **new** terminal or PowerShell window (to ensure the updated PATH is loaded) and simply run:

```bash
ytd
```

### Navigating the TUI

*   **Tab / Shift+Tab:** Cycle focus between the URL input and the menu.
*   **Arrow Keys (in menu):** Navigate menu items.
*   **Enter (in menu):** Select a menu item.
*   **Escape / q / Ctrl+C:** Exit the application.

### Downloading a Video

1.  Paste your video URL into the URL input box.
2.  Navigate to the `Download` option in the menu and press Enter.
3.  Observe the real-time download progress in the progress bar and detailed logs.

### Configuring Settings

1.  Navigate to the `Settings` option in the menu and press Enter.
2.  Adjust your preferred download path, format, quality, subtitle options, and output filename template.
3.  Press `Save` to apply changes or `Escape` to cancel.

### Creating and Seeding Torrents

1.  Navigate to the `Torrent` option in the menu and press Enter.
2.  Use the `Browse` button to select a file or directory you wish to share.
3.  Click `Create and Seed Torrent` to generate a `.torrent` file and start seeding it.
4.  The seeding status box will show real-time upload speed and peer information.

## Settings File

`ytdl-tui` saves your settings in a JSON file named `.ytdl-tui-settings.json` in your user's home directory (e.g., `/home/youruser/.ytdl-tui-settings.json` on Linux/macOS, or `C:\Users\youruser\.ytdl-tui-settings.json` on Windows). You can manually edit this file if needed, but it's recommended to use the in-app settings menu.