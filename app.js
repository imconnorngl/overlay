const electron = require('electron')
const { app, BrowserWindow, globalShortcut } = electron
const path = require('path')
const url = require('url')

let window = null

const reload = () => window.reload()

app.once('ready', () => {
  const { width } = electron.screen.getPrimaryDisplay().workAreaSize
  window = new BrowserWindow({
    width: 750,
    height: 460,
    transparent: true,
    x: width - 750,
    y: 23,
    show: false,
    frame: false,
    icon: "./img/favicon.ico",
  })

  if (process.os == "darwin") app.dock.hide();
  window.setAlwaysOnTop(true, "floating", 1);
  window.setVisibleOnAllWorkspaces(true);

  window.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  window.once('ready-to-show', () => {
    window.show()
  })
});
