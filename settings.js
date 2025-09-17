
const fs = require('fs');
const path = require('path');
const blessed = require('blessed');

const SETTINGS_FILE = path.join(process.env.HOME || process.env.USERPROFILE, '.ytdl-tui-settings.json');

let currentSettings = {
    downloadPath: path.join(process.env.HOME || process.env.USERPROFILE, 'Downloads'),
    format: 'bestvideo+bestaudio/best',
    quality: 'best',
    subtitles: false,
    outputTemplate: '%(title)s.%(ext)s'
};

// Load settings from file
const loadSettings = () => {
    try {
        if (fs.existsSync(SETTINGS_FILE)) {
            const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
            currentSettings = { ...currentSettings, ...JSON.parse(data) };
        }
    } catch (error) {
        console.error('Error loading settings:', error.message);
    }
};

// Save settings to file
const saveSettings = () => {
    try {
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(currentSettings, null, 2), 'utf8');
    } catch (error) {
        console.error('Error saving settings:', error.message);
    }
};

// Initialize settings on module load
loadSettings();

const showSettingsScreen = (contentPanel, globalLogBox, onSettingsSaved) => {
    // Clear contentPanel before rendering settings form
    contentPanel.children.forEach(child => child.destroy());

    const settingsForm = blessed.form({
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
                fg: 'yellow'
            }
        },
        content: 'Settings',
        scrollable: true,
        alwaysScroll: true,
        scrollbar: {
            ch: ' ',
            inverse: true
        }
    });

    // Download Path
    blessed.text({
        parent: settingsForm,
        top: 2,
        left: 2,
        content: 'Download Path:',
        style: { fg: 'white' }
    });
    const downloadPathInput = blessed.textbox({
        parent: settingsForm,
        top: 2,
        left: 18,
        height: 1,
        width: '70%',
        value: currentSettings.downloadPath,
        keys: true,
        mouse: true,
        inputOnFocus: true,
        style: {
            bg: 'grey',
            fg: 'white',
            focus: { bg: 'blue' }
        }
    });

    // Format
    blessed.text({
        parent: settingsForm,
        top: 4,
        left: 2,
        content: 'Format (e.g., bestvideo+bestaudio/best):',
        style: { fg: 'white' }
    });
    const formatInput = blessed.textbox({
        parent: settingsForm,
        top: 4,
        left: 40,
        height: 1,
        width: '48%',
        value: currentSettings.format,
        keys: true,
        mouse: true,
        inputOnFocus: true,
        style: {
            bg: 'grey',
            fg: 'white',
            focus: { bg: 'blue' }
        }
    });

    // Quality
    blessed.text({
        parent: settingsForm,
        top: 6,
        left: 2,
        content: 'Quality (e.g., best, 1080p):',
        style: { fg: 'white' }
    });
    const qualityInput = blessed.textbox({
        parent: settingsForm,
        top: 6,
        left: 30,
        height: 1,
        width: '58%',
        value: currentSettings.quality,
        keys: true,
        mouse: true,
        inputOnFocus: true,
        style: {
            bg: 'grey',
            fg: 'white',
            focus: { bg: 'blue' }
        }
    });

    // Subtitles
    blessed.text({
        parent: settingsForm,
        top: 8,
        left: 2,
        content: 'Download Subtitles:',
        style: { fg: 'white' }
    });
    const subtitlesCheckbox = blessed.checkbox({
        parent: settingsForm,
        top: 8,
        left: 25,
        height: 1,
        width: 3,
        checked: currentSettings.subtitles,
        mouse: true,
        keys: true,
        style: {
            bg: 'grey',
            fg: 'white',
            focus: { bg: 'blue' }
        }
    });

    // Output Template
    blessed.text({
        parent: settingsForm,
        top: 10,
        left: 2,
        content: 'Output Filename Template:',
        style: { fg: 'white' }
    });
    const outputTemplateInput = blessed.textbox({
        parent: settingsForm,
        top: 10,
        left: 28,
        height: 1,
        width: '60%',
        value: currentSettings.outputTemplate,
        keys: true,
        mouse: true,
        inputOnFocus: true,
        style: {
            bg: 'grey',
            fg: 'white',
            focus: { bg: 'blue' }
        }
    });


    const saveButton = blessed.button({
        parent: settingsForm,
        mouse: true,
        keys: true,
        shrink: true,
        padding: {
            left: 1,
            right: 1
        },
        left: 'center',
        bottom: 2,
        name: 'save',
        content: 'Save',
        style: {
            bg: 'green',
            fg: 'white',
            focus: { bg: 'lightgreen' },
            hover: { bg: 'lightgreen' }
        }
    });

    settingsForm.on('submit', (data) => {
        currentSettings.downloadPath = downloadPathInput.getValue();
        currentSettings.format = formatInput.getValue();
        currentSettings.quality = qualityInput.getValue();
        currentSettings.subtitles = subtitlesCheckbox.checked;
        currentSettings.outputTemplate = outputTemplateInput.getValue();
        saveSettings();
        globalLogBox.log('Settings saved successfully!');
        settingsForm.destroy();
        // screen.render(); // Render will be handled by the callback
        if (onSettingsSaved) onSettingsSaved();
    });

    saveButton.on('press', () => {
        settingsForm.submit();
    });

    settingsForm.key(['escape'], () => {
        settingsForm.destroy();
        // screen.render(); // Render will be handled by the callback
        if (onSettingsSaved) onSettingsSaved(); // Call callback even if cancelled
    });

    contentPanel.append(settingsForm);
    downloadPathInput.focus();
    contentPanel.screen.render(); // Render the content panel
};

const getSettings = () => currentSettings;

module.exports = {
    showSettingsScreen,
    getSettings
};
