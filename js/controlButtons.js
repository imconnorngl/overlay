const electron = require('electron')
const { remote } = electron

const closeWindow = () => {
    window.close();
    proccess.exit()
}

var maximized = false;

const maximizeWindow = () => {
    document.getElementById("body").classList.remove("hidden");
    body.style.backgroundColor = `rgba(0, 0, 0, ${readFromStorage("opacity") || 0.4})`
    header.style.backgroundColor = `rgba(0, 0, 0, ${(readFromStorage("opacity") || 0.4) + 0.05})`
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
    if (readFromStorage("toggleNotifs")) {
        const hideNotif = new Notification('Statsify', {
            body: 'Overlay has been hidden.\nType \'/w .show\' to show it again.',
            icon: './img/statsify.png',
            silent: true
         });
    }

    var window = remote.getCurrentWindow();
    window.hide() 

}

const showWindow = () => {
   var window = remote.getCurrentWindow();
   if (window.isVisible() == false) window.showInactive()
}