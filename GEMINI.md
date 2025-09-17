Always Update this file, for the next ai. the next should be awlays informend what you did and what before that. so the ai after you should always know whats the project about, what the user told you to do and not do to. You can fill out or update the stuff under this text, be sure to use the edit or write file command when you want to do that.


User instructions:
Always Update changes with the Git Add and Git Commit command.
Never type any build, install, run, push, deploy or similar commands, the user does that for you.
Always Update this file on Project changes you did, and what works, and what not.
If some command or something else fails, inform the user and ask to try again. If the user then says so, write into this file, that this something doesnt work, but the user is informed, so no need to try that again.
Always Update the README.md file for GitHub, IMPORTANT: write that file in a perspective the user that sees the GitHub repo understands it. if there some issues you come along, dont say its not working, say that the user must be sure to install "" or say something similar.
Never comment your  code!

Project ToDos:
- Implement torrenting feature (create torrents, select files, real-time seeding progress).

Overall Project Goal:
To create a nice, interactive CLI/TUI for the python module yt-dlp, with features like navigation, animations, progress bars, and many settings. The UI should be visually appealing with colors, menus, and rounded corners, built using Node.js.

Other Notes.
Current Project Status:
- Initial project setup complete with `package.json`, `node_modules`, and `index.js`.
- Basic `blessed` TUI scaffolding implemented with a title, main layout, URL input, log box, and a main menu.
- Menu logic implemented for "Download", "Settings", and "Quit" options.
- Download functionality integrated using `yt-dlp` as a child process.
- Real-time download progress displayed via a `blessed` progress bar.
- Settings module (`settings.js`) created to manage configurable options (download path, format, quality, subtitles, output template).
- Settings are loaded from and saved to a `.ytdl-tui-settings.json` file in the user's home directory.
- Settings UI (`showSettingsScreen`) implemented using `blessed` forms and input fields.
- `index.js` now integrates the settings module, using saved settings for `yt-dlp` arguments and calling the settings UI.
- Comprehensive `README.md` created and updated.