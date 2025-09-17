
const blessed = require('blessed');

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

const logBox = blessed.log({
    parent: mainLayout,
    top: 4,
    left: 0,
    width: '100%',
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
