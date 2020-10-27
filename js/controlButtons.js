const electron = require('electron')
const { remote } = electron

const closeWindow = () => {
    window.close();
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

function toggleMenu() {
    console.log(`test`)
    document.getElementById("menu").classList.toggle("hidden");
}