const electron = require('electron')
const { remote } = electron

const closeWindow = () => {
    window.close();
    // Fully close/terminate the process so it doesnt run in background 
    proccess.exit()
}

var maximized = false;

const maximizeWindow = () => {
    var window = remote.getCurrentWindow()
    if(!maximized) {
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

const hideWindow = () => {
    document.getElementById("body").classList.add("hidden");
}

const showWindow = () => {
    document.getElementById("body").classList.remove("hidden");
}