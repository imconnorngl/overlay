const electron = require('electron')
const { remote } = electron

const closeWindow = () => {
    window.close();
}

const minimizeWindow = () => {
    var window = remote.BrowserWindow.getFocusedWindow();
    window.minimize();
}