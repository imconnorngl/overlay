const Store = require('electron-store');
const { app, dialog } = require('electron').remote

const store = new Store();

const writeToStorage = (key, value) => {
    store.set(key, value)
    return value;
}

const readFromStorage = key => {
    var val = store.get(key);
    if (val == false) return false
    else if (val == 0) return 0
    else return val || undefined
}

const deleteFromStorage = key => store.delete(key)

const sendHeader = (body, success = false) => {
    var type = success ? 'success' : 'error'
    document.getElementById("bannerMessage").innerHTML = `
    <div class="${type}">
        <img class="${type}-img" src="${success ? './img/icons/check.png' : './img/icons/error.png'}" />
        <div class="${type}-header">${success ? 'Operation Successful' : 'An Unexpected Error Occured'}</div>
        <br>
        <div class="${type}-content">
        <p>${body}</p>
        </div>
    </div>
  `

  setTimeout(() => document.getElementById("bannerMessage").innerHTML = `<h1>Settings</h1><br>`, 10000)
}

const toggleMenu = () => document.getElementById("menu").classList.toggle("hidden");

/* Button to open file explorer to set custom log path for overlay to read */
const customPathSubmitter = () => {
    var options = {
        title: 'Select the latest.log file you wish to use.',
        buttonLabel: 'Select',
        filters: [{ name: 'Log Files', extensions: ['log'] }],
        properties: ['openFile']
    }

    if (process.platform !== 'darwin') options.properties.push('OpenDirectory')

    dialog.showOpenDialog(options, filePath_obj => {
        if (filePath_obj) {
            sendHeader("Your log file has been switched. Refreshing for these changes to take place...", true)
            writeToStorage('path', filePath_obj[0].replace(/\\/g, "\/"))

            var window = remote.getCurrentWindow()
            window.reload()
        }
    });
}

/* Input field for manually setting API key */
const apiKeySubmitter = async () => {
    var key = document.getElementById("apiKeyField").value
    if (!key) return;
    var keyStatus = await getKey(key)
    if (keyStatus.valid == false) {
        return sendHeader("The key you provided was not a valid API key.", false)
    } else {
        sendHeader("Your API key has been set successfully.", true)
        writeToStorage("api", key)
    }
}

/* Toggle for auto who */
var autoWho = readFromStorage("autoWho")
if (!autoWho || autoWho == false) document.getElementById("whoSwitchOption").checked = false
else document.getElementById("whoSwitchOption").checked = true

const whoSwitch = () => {
    var whoStatus = document.getElementById("whoSwitchOption").checked

    if (whoStatus == true) writeToStorage("autoWho", true)
    else writeToStorage("autoWho", false)
}

/* Toggle for auto hide */
var autoHide = readFromStorage("autoHide")
if (autoHide == undefined || autoHide == true) document.getElementById("hideSwitchOption").checked = true
else document.getElementById("hideSwitchOption").checked = false

const hideSwitch = () => {
    var hideStatus = document.getElementById("hideSwitchOption").checked

    if (hideStatus == true) writeToStorage("autoHide", true)
    else writeToStorage("autoHide", false)
}

/* Drop down menu for picking what client logs to use */
var path = readFromStorage("path")
if (path) {
    if (path.includes("blclient")) {
        var lastClient = "bc"
        document.getElementById("bcOption").selected = "selected"
    } else if (path.includes("lunarclient")) {
        var lastClient = "lc"
        document.getElementById("lcOption").selected = "selected"
    } else if (path.includes("pvplounge")) {
        var lastClient = "plc"
        document.getElementById("plcOption").selected = "selected"
    } else {
        var lastClient = "vf"
        document.getElementById("vfOption").selected = "selected"
    }
} else var lastClient = ""

const clientSwitcher = () => {
    var client = document.getElementById("logMode").value
    if (client == lastClient) return;
    lastClient = client;

    var path = app.getPath("home").replace(/\\/g, "\/");

    if (client == "vf") path += "/AppData/Roaming/.minecraft/logs/";
    else if (client == "bc") path += "/AppData/Roaming/.minecraft/logs/blclient/minecraft/";
    else if (client == "lc") path += "/.lunarclient/offline/files/1.8.9/logs/";
    else if (client == "plc") path += "/AppData/Roaming/.pvplounge/logs/";

    path += "latest.log"

    fs.open(path, 'r', (err, fd) => {
        if (!fd) {
            return sendHeader("There is no log file associated with that client. Try manually selecting the log file.", false)   
        } else {
            sendHeader("Your log file has been switched. Refreshing for these changes to take place...", true)  
            writeToStorage("path", path)

            var window = remote.getCurrentWindow()
            window.reload()
        }
    })
}

/* Drop down menu for switching between what statistic to sort players by */
var sortMode = readFromStorage("sort") || "threat"

if (sortMode == "threat") document.getElementById("threatOption").selected = "selected"
else if (sortMode == "level") document.getElementById("levelOption").selected = "selected"
else if (sortMode == "fkdr") document.getElementById("fkdrOption").selected = "selected"
else document.getElementById("wsOption").selected = "selected"

const sortSwitcher = () => {
    var newSortMode = document.getElementById("sortMode").value
    if (newSortMode == sortMode) return;
    sortMode = newSortMode;

    writeToStorage("sort", newSortMode)
    tableUpdater()
}


/* Drop down menu for switching between game modes */
var mode = readFromStorage("mode") || "overall"
document.getElementById(`${mode}Option`).selected = "selected"

const modeSwitcher = () => {
    var newMode = document.getElementById("modeSwitch").value
    if (newMode == mode) return;
    mode = newMode;

    writeToStorage("mode", mode)
    tableUpdater()
}