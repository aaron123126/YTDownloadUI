
const blessed = require('blessed');
const path = require('path');
const fs = require('fs');

let client = null; // WebTorrent client instance

const showTorrentScreen = (contentPanel, globalLogBox, updateStatusOverlay, onBack) => {
    // Clear contentPanel before rendering torrent form
    contentPanel.children.forEach(child => child.destroy());

    const torrentForm = blessed.form({
        parent: contentPanel,
        keys: true,
        mouse: true,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
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
            fg: 'white',
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
        top: 2,
        left: '89%',
        name: 'browse',
        content: 'Browse',
        style: {
            bg: 'blue',
            fg: 'white',
            focus: { bg: 'lightblue' },
            hover: { bg: 'lightblue' }
        }
    });

    const seedingStatusBox = blessed.box({
        parent: torrentForm,
        top: 6,
        left: 2,
        width: '96%',
        height: 5,
        border: {
            type: 'line'
        },
        style: {
            fg: 'white',
            border: {
                fg: 'green'
            }
        },
        label: 'Seeding Status',
        hidden: true
    });

    browseButton.on('press', () => {
        const fileManager = blessed.filemanager({
            parent: contentPanel.screen, // Still parent to the main screen for overlay effect
            border: 'line',
            style: {
                bg: 'black',
                fg: 'white',
                border: { fg: 'green' },
                selected: { bg: 'green' }
            },
            height: '70%',
            width: '70%',
            top: 'center',
            left: 'center',
            label: 'Select File/Directory',
            keys: true,
            mouse: true,
            vi: true
        });

        fileManager.on('select', (item) => {
            filePathInput.setValue(item);
            fileManager.destroy();
            contentPanel.screen.render();
            torrentForm.focus(); // Return focus to the form
        });

        fileManager.on('cancel', () => {
            fileManager.destroy();
            contentPanel.screen.render();
            torrentForm.focus(); // Return focus to the form
        });

        contentPanel.screen.append(fileManager);
        fileManager.refresh();
        fileManager.focus();
        contentPanel.screen.render();
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
        left: 2,
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
        contentPanel.screen.render();
        if (onBack) onBack();
    });

    createSeedButton.on('press', async () => {
        const filePath = filePathInput.getValue();
        if (!filePath) {
            globalLogBox.log('Please enter a file or directory path to torrent.');
            return;
        }

        globalLogBox.log(`Attempting to create and seed torrent for: ${filePath}`);
        seedingStatusBox.setContent('Initializing WebTorrent client...');
        seedingStatusBox.show();
        contentPanel.screen.render();

        try {
            const WebTorrent = (await import('webtorrent')).default;
            if (!client) {
                client = new WebTorrent();
            }

            client.seed(filePath, (torrent) => {
                globalLogBox.log(`Torrent created: ${torrent.name}`);
                globalLogBox.log(`Magnet URI: ${torrent.magnetURI}`);
                globalLogBox.log('Torrent file created in a temporary location.');

                updateStatusOverlay(`Seeding: ${torrent.name}`);

                seedingStatusBox.setContent(
                    `Torrent: ${torrent.name}
` +
                    `Status: Seeding (0% uploaded)
` +
                    `Upload Speed: 0 B/s | Peers: 0`
                );
                contentPanel.screen.render();

                torrent.on('upload', () => {
                    const uploadSpeed = (torrent.uploadSpeed / 1024).toFixed(2);
                    const progress = (torrent.progress * 100).toFixed(2);
                    seedingStatusBox.setContent(
                        `Torrent: ${torrent.name}
` +
                        `Status: Seeding (${progress}% uploaded)
` +
                        `Upload Speed: ${uploadSpeed} KB/s | Peers: ${torrent.numPeers}`
                    );
                    updateStatusOverlay(`Seeding: ${torrent.name} (${uploadSpeed} KB/s)`);
                    contentPanel.screen.render();
                });

                torrent.on('error', (err) => {
                    globalLogBox.log(`Torrent error: ${err.message}`);
                    seedingStatusBox.setContent(`Error: ${err.message}`);
                    updateStatusOverlay(`Seeding Error!`, true);
                    contentPanel.screen.render();
                });

                torrent.on('done', () => {
                    globalLogBox.log('Torrent seeding complete (all pieces uploaded).');
                    seedingStatusBox.setContent('Seeding complete!');
                    updateStatusOverlay('Seeding Complete!', true);
                    contentPanel.screen.render();
                });

                contentPanel.screen.render();
            });
        } catch (error) {
            globalLogBox.log(`Failed to initialize WebTorrent: ${error.message}`);
            seedingStatusBox.setContent(`Error: ${error.message}`);
            seedingStatusBox.hide();
            updateStatusOverlay(`Torrent Init Error!`, true);
            contentPanel.screen.render();
        }
    });

    contentPanel.append(torrentForm);
    filePathInput.focus();
    contentPanel.screen.render();
};

module.exports = {
    showTorrentScreen
};
