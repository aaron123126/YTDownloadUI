#!/bin/bash

# ytdl-tui uninstaller script
# This script removes ytdl-tui and associated files.

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Starting ytdl-tui uninstallation..."

# --- Privilege Check ---
# The script needs to remove files from /usr/local/, which requires root.
if [ "$(id -u)" -ne 0 ]; then
    echo "This script must be run as root. Please use 'sudo ./uninstall.sh'." >&2
    exit 1
fi

# --- Define Paths ---
INSTALL_DIR="/usr/local/lib/ytdl"
YTD_CMD_PATH="/usr/local/bin/ytd"

# --- Remove 'ytd' command ---
if [ -f "$YTD_CMD_PATH" ]; then
    echo "Removing 'ytd' command: $YTD_CMD_PATH"
    rm -f "$YTD_CMD_PATH"
else
    echo "'ytd' command not found, skipping."
fi

# --- Remove Installation Directory ---
if [ -d "$INSTALL_DIR" ]; then
    echo "Removing application directory: $INSTALL_DIR"
    rm -rf "$INSTALL_DIR"
else
    echo "Application directory not found, skipping."
fi

echo ""
echo "ytdl-tui uninstallation complete."
echo "Note: Dependencies like Node.js, npm, and yt-dlp were not removed, as they may be used by other applications."

exit 0
