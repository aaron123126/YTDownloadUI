const blessed = require('blessed');
const { spawn } = require('child_process');
const { showSettingsScreen, getSettings } = require('./settings');
const { showTorrentScreen } = require('./torrent');

// Create a screen object.
const screen = blessed.screen({
  smartCSR: true,
  title: 'ytdl-tui',
  fullUnicode: true // For better rendering of some characters
});

// --- Global Status and Log Boxes ---
const globalLogBox = blessed.log({
    parent: screen,
    bottom: 0,
    left: 0,
    width: '100%',
    height: 5,
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        border: {
            fg: '#888'
        }
    },
    label: ' Global Log ',
    tags: true,
    scrollable: true,
    alwaysScroll: true,
    scrollbar: {
        ch: ' ',
        inverse: true
    }
});

const statusOverlay = blessed.box({
    parent: screen,
    top: 1,
    right: 1,
    width: 40,
    height: 5,
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        border: {
            fg: 'yellow'
        }
    },
    label: ' Status ',
    tags: true,
    hidden: true // Initially hidden
});

// Helper to update status overlay
const updateStatusOverlay = (message, hide = false) => {
    statusOverlay.setContent(message);
    if (hide) {
        statusOverlay.hide();
    } else {
        statusOverlay.show();
    }
    screen.render();
};

// --- Main Layout --- 
const mainContainer = blessed.box({
    parent: screen,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%-5', // Account for globalLogBox
});

const leftPanel = blessed.box({
    parent: mainContainer,
    top: 0,
    left: 0,
    width: 25,
    height: '100%',
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        border: {
            fg: 'cyan'
        }
    },
    label: ' Menu '
});

const contentPanel = blessed.box({
    parent: mainContainer,
    top: 0,
    left: 25,
    width: '100%-25',
    height: '100%',
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        border: {
            fg: 'blue'
        }
    },
    label: ' Content '
});

// --- Main Menu ---
const menu = blessed.list({
    parent: leftPanel,
    top: 'center',
    left: 1,
    width: '100%-2',
    height: 'shrink',
    items: ['Download', 'Settings', 'Torrent', 'Quit'],
    keys: true,
    mouse: true,
    vi: true,
    style: {
        fg: 'white
        selected: {
            bg: 'blue'
        }
    }
});

// --- Download Screen Function ---
const showDownloadScreen = () => {
    contentPanel.children.forEach(child => child.destroy()); // Clear content

    const downloadForm = blessed.form({
        parent: contentPanel,
        keys: true,
        mouse: true,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        content: 'Download Video/Audio',
        scrollable: true,
        alwaysScroll: true,
        scrollbar: {
            ch: ' ',
            inverse: true
        }
    });

    blessed.text({
        parent: downloadForm,
        top: 2,
        left: 2,
        content: 'URL:',
        style: { fg: 'white' }
    });
    const urlInput = blessed.textbox({
        parent: downloadForm,
        top: 2,
        left: 7,
        height: 1,
        width: '80%',
        value: '',
        keys: true,
        mouse: true,
        inputOnFocus: true,
        style: {
            bg: 'grey',
            fg: 'white',
            focus: { bg: 'blue' }
        }
    });

    const downloadButton = blessed.button({
        parent: downloadForm,
        mouse: true,
        keys: true,
        shrink: true,
        padding: {
            left: 1,
            right: 1
        },
        top: 4,
        left: 2,
        name: 'download',
        content: 'Download',
        style: {
            bg: 'green',
            fg: 'white',
            focus: { bg: 'lightgreen' },
            hover: { bg: 'lightgreen' }
        }
    });

    const downloadProgressBar = blessed.progressbar({
        parent: downloadForm,
        top: 6,
        left: 2,
        width: '90%',
        height: 1,
        pch: '━',
        style: {
            bar: {
                bg: 'blue'
            },
            bg: 'black'
        },
        border: {
            type: 'line'
        },
        hidden: true // Initially hidden
    });

    const downloadLogBox = blessed.log({
        parent: downloadForm,
        top: 8,
        left: 2,
        width: '90%',
        height: '100%-10',
        border: {
            type: 'line'
        },
        style: {
            fg: 'white',
            border: {
                fg: 'cyan'
            }
        },
        label: ' Download Log ',
        scrollable: true,
        alwaysScroll: true,
        scrollbar: {
            ch: ' ',
            inverse: true
        }
    });

    downloadButton.on('press', () => {
        const url = urlInput.getValue();
        if (!url) {
            globalLogBox.log('Please enter a URL first.');
            return;
        }

        globalLogBox.log(`Starting download for: ${url}`);
        downloadProgressBar.show();
        downloadProgressBar.setProgress(0);
        updateStatusOverlay('Downloading: 0%');
        screen.render();

        const settings = getSettings();
        const ytdlpArgs = [
            url,
            '--progress',
            '--newline',
            '--no-warnings',
            '-o', `${settings.downloadPath}/${settings.outputTemplate}`,
            '-f', settings.format
        ];

        if (settings.subtitles) {
            ytdlpArgs.push('--write-subs');
            ytdlpArgs.push('--all-subs');
        }

        if (settings.quality && settings.quality !== 'best') {
            ytdlpArgs.push('-S', `res:${settings.quality.replace('p', '')}`);
        }

        globalLogBox.log(`Executing: yt-dlp ${ytdlpArgs.join(' ')}`);

        const ytdlp = spawn('yt-dlp', ytdlpArgs);

        ytdlp.stdout.on('data', (data) => {
            const output = data.toString();
            downloadLogBox.log(output);

            const progressMatch = output.match(/\s(\d+\.\d+)% of/);
            if (progressMatch && progressMatch[1]) {
                const progress = parseFloat(progressMatch[1]);
                downloadProgressBar.setProgress(progress);
                updateStatusOverlay(`Downloading: ${progress}%`);
                screen.render();
            }
        });

        ytdlp.stderr.on('data', (data) => {
            const errorOutput = data.toString();
            globalLogBox.log(`Error: ${errorOutput}`);
            downloadLogBox.log(`Error: ${errorOutput}`);
            updateStatusOverlay(`Download Error!`, true);
            screen.render();
        });

        ytdlp.on('close', (code) => {
            if (code === 0) {
                globalLogBox.log('Download complete!');
                downloadProgressBar.setProgress(100);
                updateStatusOverlay('Download Complete!', true);
            } else {
                globalLogBox.log(`yt-dlp exited with code ${code}`);
                updateStatusOverlay(`Download Failed (Code: ${code})`, true);
            }
            downloadProgressBar.hide();
            screen.render();
        });
    });

    downloadForm.focus();
    screen.render();
};

// --- Menu Selection Logic ---
menu.on('select', (item) => {
    const selected = item.getText();
    if (selected === 'Quit') {
        return process.exit(0);
    }
    if (selected === 'Download') {
        showDownloadScreen();
    }
    if (selected === 'Settings') {
        contentPanel.children.forEach(child => child.destroy()); // Clear content
        showSettingsScreen(contentPanel, globalLogBox, () => {
            // Callback after settings screen is closed
            screen.render(); // Re-render main screen
            menu.focus(); // Restore focus to main menu
        });
    }
    if (selected === 'Torrent') {
        contentPanel.children.forEach(child => child.destroy()); // Clear content
        showTorrentScreen(contentPanel, globalLogBox, updateStatusOverlay, () => {
            // Callback after torrent screen is closed
            screen.render(); // Re-render main screen
            menu.focus(); // Restore focus to main menu
        });
    }
});

// --- Initial Setup and Keybindings ---
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

// Initial screen setup
screen.append(mainContainer);
screen.append(globalLogBox);
screen.append(statusOverlay);
menu.focus();
showDownloadScreen(); // Show download screen by default
screen.render();