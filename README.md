# ytdl-tui: A Terminal User Interface for yt-dlp

`ytdl-tui` is a sleek and interactive Terminal User Interface (TUI) built with Node.js for the powerful `yt-dlp` video downloader. It provides a user-friendly way to download videos and audio from various platforms, offering real-time progress updates, customizable settings, and a modern terminal experience.

## Features

*   **Interactive TUI:** Navigate with keyboard (Tab, Shift+Tab, Arrow Keys) and mouse.
*   **URL Input:** Easily paste video URLs for download.
*   **Real-time Progress Bar:** Visual feedback on download progress.
*   **Configurable Settings:**
    *   Set custom download paths.
    *   Choose desired video/audio formats.
    *   Specify quality preferences.
    *   Option to download subtitles.
    *   Customize output filename template.
*   **Clean Log Output:** View detailed `yt-dlp` messages and application status.

## Prerequisites

Before you can run `ytdl-tui`, ensure you have the following installed on your system:

*   **Node.js & npm:** `ytdl-tui` is a Node.js application. You can download them from [nodejs.org](https://nodejs.org/).
*   **yt-dlp:** The core video downloading engine. Make sure `yt-dlp` is installed and accessible in your system's PATH. You can find installation instructions on the [yt-dlp GitHub page](https://github.com/yt-dlp/yt-dlp).

    *Example installation for Linux/macOS:*
    ```bash
    sudo wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -O /usr/local/bin/yt-dlp
    sudo chmod a+rx /usr/local/bin/yt-dlp  # Give execute permissions
    ```

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/aaron123126/YTDownloadUI.git
    cd YTDownloadUI
    ```

2.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```

## Usage

To start the `ytdl-tui` application, run:

```bash
node index.js
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

## Settings File

`ytdl-tui` saves your settings in a JSON file named `.ytdl-tui-settings.json` in your user's home directory (e.g., `/home/youruser/.ytdl-tui-settings.json` on Linux/macOS, or `C:\Users\youruser\.ytdl-tui-settings.json` on Windows). You can manually edit this file if needed, but it's recommended to use the in-app settings menu.
