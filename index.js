
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

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

// Render the screen.
screen.render();
