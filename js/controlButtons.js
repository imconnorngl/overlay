const electron = require('electron')
const { remote } = electron

const closeWindow = () => {
    window.close();
}

var maximized = false;

const maximizeWindow = () => {
    var window = remote.getCurrentWindow()
    if(!window.isMaximized() && !maximized) {
        window.maximize()
        maximized = true;
    }
    else {
        maximized = false;
        window.unmaximize()
    }
}

const minimizeWindow = () => {
    var window = remote.BrowserWindow.getFocusedWindow();
    window.minimize();
}