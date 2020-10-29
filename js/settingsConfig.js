const Store = require('electron-store');
const { app } = require('electron').remote
const dialog = require('electron').remote.dialog

const store = new Store();

const toggleMenu = () => document.getElementById("menu").classList.toggle("hidden");

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

const pathBtn = document.getElementById("path-input");

pathBtn.onclick = () => {
    var options = {
        title: 'Select the latest.log file you wish to use.',
        buttonLabel: 'Select',
        filters: [{ name: 'Log Files', extensions: ['log'] }],
        properties: ['openFile']
    }

    if (process.platform !== 'darwin') options.properties.push('OpenDirectory')

    dialog.showOpenDialog(options, filePath_obj => {
        if (filePath_obj) {
            document.getElementById("bannerMessage").innerHTML = `
        <div class="success">
            <img class="success-img" src="./img/icons/check.png" />
            <div class="success-header">Operation Successful</div>
            <br>
            <div class="success-content">
            <p>Your log file has been switched. Refreshing for these changes to take place...</p>
            </div>
        </div>
      `

            writeToStorage('path', filePath_obj[0].replace(/\\/g, "\/"))

            var window = remote.getCurrentWindow()
            window.reload()
        }
    });
}

var api = readFromStorage("api")
if (api) document.getElementById("apiKeyField").value = api

const apiKeySubmitter = async () => {
    var key = document.getElementById("apiKeyField").value
    if (!key) return;
    var keyStatus = await getKey(key)
    if (keyStatus.valid == false) {
        document.getElementById("bannerMessage").innerHTML = `
        <div class="error">
            <img class="error-img" src="./img/icons/error.png" />
            <div class="error-header">An Unexpected Error Occured</div>
            <br>
            <div class="error-content">
            <p>The key you provided was not a valid API key.</p>
            </div>
        </div>
      `

        return;
    } else {
        document.getElementById("bannerMessage").innerHTML = `
        <div class="success">
            <img class="success-img" src="./img/icons/check.png" />
            <div class="success-header">Operation Successful</div>
            <br>
            <div class="success-content">
            <p>Your API key has been set successfully.</p>
            </div>
        </div>
      `
        writeToStorage("api", key)
    }
}

var authors = ["imconnorngl", "VideoGameKing"]
var authorRandom = Math.round(Math.random());
document.getElementById("creditFooter").innerHTML = `Made by ${authors[authorRandom]} & ${authors.find(a => a != authors[authorRandom])} © Statsify Inc.`

var autoWho = readFromStorage("autoWho")
if (!autoWho || autoWho == false) document.getElementById("whoSwitchOption").checked = false
else document.getElementById("whoSwitchOption").checked = true

const whoSwitch = () => {
    var whoStatus = document.getElementById("whoSwitchOption").checked

    if (whoStatus == true) writeToStorage("autoWho", true)
    else writeToStorage("autoWho", false)
}

var autoHide = readFromStorage("autoHide")
if (autoHide == undefined || autoHide == true) document.getElementById("hideSwitchOption").checked = true
else document.getElementById("hideSwitchOption").checked = false

const hideSwitch = () => {
    var hideStatus = document.getElementById("hideSwitchOption").checked

    if (hideStatus == true) writeToStorage("autoHide", true)
    else writeToStorage("autoHide", false)
}

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
            document.getElementById("bannerMessage").innerHTML = `
            <div class="error">
                <img class="error-img" src="./img/icons/error.png" />
                <div class="error-header">An Unexpected Error Occured</div>
                <br>
                <div class="error-content">
                <p>There is no log file associated with that client. Try manually selecting the log file.</p>
                </div>
            </div>
          `

            return;
        } else {
            document.getElementById("bannerMessage").innerHTML = `
        <div class="success">
            <img class="success-img" src="./img/icons/check.png" />
            <div class="success-header">Operation Successful</div>
            <br>
            <div class="success-content">
            <p>Your log file has been switched. Refreshing for these changes to take place...</p>
            </div>
        </div>
      `

            writeToStorage("path", path)

            var window = remote.getCurrentWindow()
            window.reload()
        }
    })
}

var sortMode = readFromStorage("sort") || "threat"

if (sortMode == "threat") document.getElementById("threatOption").selected = "selected"
else if (sortMode == "level") document.getElementById("levelOption").selected = "selected"
else document.getElementById("fkdrOption").selected = "selected"

const sortSwitcher = () => {
    var newSortMode = document.getElementById("sortMode").value
    if (newSortMode == sortMode) return;
    sortMode = newSortMode;

    writeToStorage("sort", newSortMode)
    tableUpdater()
}

var mode = readFromStorage("mode") || "overall"
document.getElementById(`${mode}Option`).selected = "selected"

const modeSwitcher = () => {
    var newMode = document.getElementById("modeSwitch").value
    if (newMode == mode) return;
    mode = newMode;

    writeToStorage("mode", mode)
    tableUpdater()
}