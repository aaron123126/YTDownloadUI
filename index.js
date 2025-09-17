
const blessed = require('blessed');
const { spawn } = require('child_process');
const { showSettingsScreen, getSettings } = require('./settings');

// Create a screen object.
const screen = blessed.screen({
  smartCSR: true,
  title: 'ytdl-tui'
});

// Create a box for the main title.
const titleBox = blessed.box({
  parent: screen,
  top: 0,
  left: 'center',
  width: '50%',
  height: 'shrink',
  content: '{bold}{cyan-fg}ytdl-tui{/cyan-fg}{/bold}',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    border: {
      fg: '#f0f0f0'
    }
  }
});

const mainLayout = blessed.layout({
    parent: screen,
    top: 5,
    left: 'center',
    width: '95%',
    height: '80%',
});

const urlInput = blessed.textbox({
    parent: mainLayout,
    name: 'urlInput',
    top: 0,
    left: 0,
    height: 3,
    width: '100%',
    keys: true,
    mouse: true,
    inputOnFocus: true,
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        border: {
            fg: 'cyan'
        },
        focus: {
            border: {
                fg: 'lime'
            }
        }
    }
});

const progressBar = blessed.progressbar({
    parent: mainLayout,
    top: 4,
    left: 0,
    width: '100%',
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

const logBox = blessed.log({
    parent: mainLayout,
    top: 6, // Adjusted position below progress bar
    left: 0,
    width: '100%',
    height: '100%-12', // Adjusted height
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        border: {
            fg: 'cyan'
        }
    },
    label: 'Log'
});

const menu = blessed.list({
    parent: mainLayout,
    bottom: 0,
    left: 0,
    width: '100%',
    height: 3,
    items: ['Download', 'Settings', 'Quit'],
    keys: true,
    mouse: true,
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        border: {
            fg: 'cyan'
        },
        selected: {
            bg: 'blue'
        }
    }
});

menu.on('select', (item) => {
    const selected = item.getText();
    if (selected === 'Quit') {
        return process.exit(0);
    }
    if (selected === 'Download') {
        const url = urlInput.getValue();
        if (url) {
            logBox.log(`Starting download for: ${url}`);
            progressBar.show();
            progressBar.setProgress(0);
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

            // Add quality if specified and not 'best' (which is default for -f bestvideo+bestaudio/best)
            if (settings.quality && settings.quality !== 'best') {
                // This part might need more sophisticated handling depending on yt-dlp's quality options
                // For simplicity, we'll just append it if it's not 'best'
                // A more robust solution would parse available formats and select based on quality
                ytdlpArgs.push('-S', `res:${settings.quality.replace('p', '')}`);
            }

            logBox.log(`Executing: yt-dlp ${ytdlpArgs.join(' ')}`);

            const ytdlp = spawn('yt-dlp', ytdlpArgs);

            ytdlp.stdout.on('data', (data) => {
                const output = data.toString();
                logBox.log(output);

                // Regex to parse yt-dlp progress output
                const progressMatch = output.match(/\s(\d+\.\d+)% of/);
                if (progressMatch && progressMatch[1]) {
                    const progress = parseFloat(progressMatch[1]);
                    progressBar.setProgress(progress);
                    screen.render();
                }
            });

            ytdlp.stderr.on('data', (data) => {
                logBox.log(`Error: ${data.toString()}`);
                screen.render();
            });

            ytdlp.on('close', (code) => {
                if (code === 0) {
                    logBox.log('Download complete!');
                    progressBar.setProgress(100);
                } else {
                    logBox.log(`yt-dlp exited with code ${code}`);
                }
                progressBar.hide();
                screen.render();
            });
        } else {
            logBox.log('Please enter a URL first.');
        }
    }
    if (selected === 'Settings') {
        showSettingsScreen(screen, logBox, () => {
            // Callback after settings screen is closed
            screen.render(); // Re-render main screen
            setFocus(); // Restore focus to main components
        });
    }
});

// Focus management
const components = [urlInput, menu];
let focusIndex = 0;

const setFocus = () => {
    components[focusIndex].focus();
    screen.render();
};

screen.key(['tab'], () => {
    focusIndex = (focusIndex + 1) % components.length;
    setFocus();
});

screen.key(['S-tab'], () => {
    focusIndex = (focusIndex - 1 + components.length) % components.length;
    setFocus();
});


// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

// Initial focus
setFocus();

// Render the screen.
screen.render();
