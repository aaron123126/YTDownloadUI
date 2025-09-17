
const blessed = require('blessed');
const WebTorrent = require('webtorrent');
const path = require('path');
const fs = require('fs');

let client = null; // WebTorrent client instance

const showTorrentScreen = (screen, logBox, onBack) => {
    const torrentForm = blessed.form({
        parent: screen,
        keys: true,
        mouse: true,
        left: 'center',
        top: 'center',
        width: '80%',
        height: '80%',
        border: {
            type: 'line'
        },
        style: {
            bg: 'black',
            border: {
                fg: 'magenta'
            }
        },
        content: 'Torrent Operations',
        scrollable: true,
        alwaysScroll: true,
        scrollbar: {
            ch: ' ',
            inverse: true
        }
    });

    blessed.text({
        parent: torrentForm,
        top: 2,
        left: 2,
        content: 'Path to file/directory to torrent:',
        style: { fg: 'white' }
    });
    const filePathInput = blessed.textbox({
        parent: torrentForm,
        top: 2,
        left: 38,
        height: 1,
        width: '50%',
        value: '',
        keys: true,
        mouse: true,
        inputOnFocus: true,
        style: {
            bg: 'grey',
            fg: 'white
            focus: { bg: 'blue' }
        }
    });

    const browseButton = blessed.button({
        parent: torrentForm,
        mouse: true,
        keys: true,
        shrink: true,
        padding: {
            left: 1,
            right: 1
        },
        top: 4,
        left: 2,
        name: 'browse',
        content: 'Browse',
        style: {
            bg: 'blue',
            fg: 'white',
            focus: { bg: 'lightblue' },
            hover: { bg: 'lightblue' }
        }
    });

    const createSeedButton = blessed.button({
        parent: torrentForm,
        mouse: true,
        keys: true,
        shrink: true,
        padding: {
            left: 1,
            right: 1
        },
        top: 4,
        left: 12,
        name: 'createSeed',
        content: 'Create and Seed Torrent',
        style: {
            bg: 'green',
            fg: 'white',
            focus: { bg: 'lightgreen' },
            hover: { bg: 'lightgreen' }
        }
    });

    const backButton = blessed.button({
        parent: torrentForm,
        mouse: true,
        keys: true,
        shrink: true,
        padding: {
            left: 1,
            right: 1
        },
        bottom: 2,
        left: 'center',
        name: 'back',
        content: 'Back to Main Menu',
        style: {
            bg: 'red',
            fg: 'white',
            focus: { bg: 'lightred' },
            hover: { bg: 'lightred' }
        }
    });

    backButton.on('press', () => {
        torrentForm.destroy();
        screen.render();
        if (onBack) onBack();
    });

    createSeedButton.on('press', () => {
        const filePath = filePathInput.getValue();
        if (!filePath) {
            logBox.log('Please enter a file or directory path to torrent.');
            return;
        }

        logBox.log(`Attempting to create and seed torrent for: ${filePath}`);

        if (!client) {
            client = new WebTorrent();
        }

        client.seed(filePath, (torrent) => {
            logBox.log(`Torrent created: ${torrent.name}`);
            logBox.log(`Magnet URI: ${torrent.magnetURI}`);
            logBox.log(`Torrent file saved to: ${torrent.path}`);

            // Display seeding progress (placeholder for now)
            logBox.log('Seeding started...');
            logBox.log(`Download speed: ${torrent.downloadSpeed}`);
            logBox.log(`Upload speed: ${torrent.uploadSpeed}`);
            logBox.log(`Peers: ${torrent.numPeers}`);

            torrent.on('upload', () => {
                logBox.log(`Uploading: ${torrent.uploadSpeed / 1000} KB/s, Peers: ${torrent.numPeers}`);
                screen.render();
            });

            torrent.on('error', (err) => {
                logBox.log(`Torrent error: ${err.message}`);
                screen.render();
            });

            screen.render();
        });
    });

    screen.append(torrentForm);
    filePathInput.focus();
    screen.render();
};

module.exports = {
    showTorrentScreen
};
