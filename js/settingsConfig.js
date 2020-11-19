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

/* In Settings */
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

const toggleMenu = () => {
    document.getElementById("menu").classList.toggle("hidden");

    if (!document.getElementById("faq-tooltip").classList.contains("hidden")) 
    document.getElementById("faq-tooltip").classList.add("hidden");

    if (readFromStorage("resizeEnabled") && (document.getElementById("menu").classList.item(1) || "None") == "None") {
        var size = { x: 750, y: 460 }
        var window = remote.getCurrentWindow()
        window.setSize(size.x, size.y)
    }
}

/* Button to open file explorer to set custom log path for overlay to read */
const customPathSubmitter = () => {
    var options = {
        title: 'Select the \'latest.log\' file you wish to use.',
        buttonLabel: 'Select',
        filters: [{ name: 'Log Files', extensions: ['log'] }],
        properties: ['openFile']
    }

    if (process.platform !== 'darwin') options.properties.push('OpenDirectory')

    dialog.showOpenDialog(options, filePath_obj => {
        if (filePath_obj) {
            sendHeader("Your log file has been switched. Refreshing for these changes to take place...", true)
            writeToStorage('path', filePath_obj[0].replace(/\\/g, "\/"))

            setTimeout(() => {
                var window = remote.getCurrentWindow()
                window.reload()
            }, 3250)
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
        document.getElementById("apiKeyField").value = key;
        writeToStorage("api", key)
    }
}

var searchField = document.getElementById("playerSearchField")
searchField.addEventListener('keyup', event => {
    if (event.keyCode === 13) playerSearch()
})

/* Player Search Bar in Header */
const playerSearch = async () => {
    const form = document.getElementById("playerSearchField")
    var player = form.value
    if (!player || player.length > 16) return;
    addPlayer(player)
    
    form.value = ""
}

/* Toggle for auto who */
var autoWho = readFromStorage("autoWho")
if (!autoWho || autoWho == false) document.getElementById("whoSwitchOption").checked = false
else document.getElementById("whoSwitchOption").checked = true

writeToStorage("autoWho", document.getElementById("whoSwitchOption").checked)

const whoSwitch = () => {
    var whoStatus = document.getElementById("whoSwitchOption").checked

    if (whoStatus == true) writeToStorage("autoWho", true)
    else writeToStorage("autoWho", false)
}

/* Toggle for auto hide */
var autoHide = readFromStorage("autoHide")
if (autoHide == undefined || autoHide == true) document.getElementById("hideSwitchOption").checked = true
else document.getElementById("hideSwitchOption").checked = false

writeToStorage("autoHide", document.getElementById("hideSwitchOption").checked)

const hideSwitch = () => {
    var hideStatus = document.getElementById("hideSwitchOption").checked

    if (hideStatus == true) writeToStorage("autoHide", true)
    else writeToStorage("autoHide", false)
}

/* Toggle for Guild Tags /* */
var guildTags = readFromStorage("guildEnabled")
if (guildTags == undefined || guildTags == true) document.getElementById("guildSwitchOption").checked = true
else document.getElementById("guildSwitchOption").checked = false

writeToStorage("guildEnabled", document.getElementById("guildSwitchOption").checked)

const guildSwitch = () => {
    var guildStatus = document.getElementById("guildSwitchOption").checked

    if (guildStatus == true) writeToStorage("guildEnabled", true)
    else writeToStorage("guildEnabled", false)
}

/* Toggle for Lobby Chat */
var lobbyChat = readFromStorage("lobbyEnabled")
if (!lobbyChat || lobbyChat == false) document.getElementById("lobbyChatOption").checked = false
else document.getElementById("lobbyChatOption").checked = true

writeToStorage("lobbyEnabled", document.getElementById("lobbyChatOption").checked)

const lobbySwitch = () => {
    var lobbyStatus = document.getElementById("lobbyChatOption").checked

    if (lobbyStatus == true) writeToStorage("lobbyEnabled", true)
    else writeToStorage("lobbyEnabled", false)
}

/* Toggle for Party Info */
var partyStuff = readFromStorage("partyEnabled")
if (!partyStuff || partyStuff == false) document.getElementById("partyStuffOption").checked = false
else document.getElementById("partyStuffOption").checked = true

writeToStorage("partyEnabled", document.getElementById("partyStuffOption").checked)

const partySwitch = () => {
    var partyInfo = document.getElementById("partyStuffOption").checked

    if (partyInfo == true) writeToStorage("partyEnabled", true)
    else writeToStorage("partyEnabled", false)
}

/* Toggle for Auto Resize */
var autoSize = readFromStorage("resizeEnabled")
if (!autoSize || autoSize == false) document.getElementById("resizeOption").checked = false
else document.getElementById("resizeOption").checked = true

writeToStorage("resizeEnabled", document.getElementById("resizeOption").checked)

const autoResize = () => {
    var resizeStatus = document.getElementById("resizeOption").checked

    if (resizeStatus == true) writeToStorage("resizeEnabled", true)
    else {
        var window = remote.getCurrentWindow();
        window.setSize(750, 460)
        writeToStorage("resizeEnabled", false)
    }
}

/* Toggle for Notifications */
var dnd = readFromStorage("toggleNotifs")
if (dnd == undefined || dnd == true) document.getElementById("doNotDisturb").checked = true
else document.getElementById("doNotDisturb").checked = false

writeToStorage("toggleNotifs", document.getElementById("doNotDisturb").checked)

const doNotDisturb = () => {
    var notifSetting = document.getElementById("doNotDisturb").checked

    if (notifSetting == true) writeToStorage("toggleNotifs", true)
    else writeToStorage("toggleNotifs", false)
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
    else if (client == "lc") path += "/.lunarclient/offline/files/1.8/logs/";
    else if (client == "plc") path += "/AppData/Roaming/.pvplounge/logs/";

    path += "latest.log"

    fs.open(path, 'r', (err, fd) => {
        if (!fd) {
            return sendHeader("There is no log file associated with that client. Try manually selecting the log file.", false)   
        } else {
            sendHeader("Your log file has been switched. Refreshing for these changes to take place...", true)  
            writeToStorage("path", path)
            
            setTimeout(() => {
                var window = remote.getCurrentWindow()
                window.reload()
            }, 3250)
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

/* Opacity Settings */
const body = document.getElementById("body")
const header = document.getElementById("topnav")

const opacitySlider = document.getElementById("opacitySlider")
const opacityValue = document.getElementById("opacityValue")

opacitySlider.value = readFromStorage("opacity") || readFromStorage("opacity") != false ? (readFromStorage("opacity") || 40) : 0
opacityValue.innerHTML = `Opacity: ${readFromStorage("opacity") == false ? 0 : readFromStorage("opacity") || 40}%`

body.style.backgroundColor = `rgba(0, 0, 0, ${opacitySlider.value/100})`
header.style.backgroundColor = `rgba(0, 0, 0, ${(opacitySlider.value/100)+0.05})`

opacitySlider.oninput = () => {
    opacityValue.innerHTML = `Opacity: ${opacitySlider.value}%`
    body.style.backgroundColor = `rgba(0, 0, 0, ${opacitySlider.value/100})`
    header.style.backgroundColor = `rgba(0, 0, 0, ${(opacitySlider.value/100)+0.05})`
    
    writeToStorage("opacity", (opacitySlider.value))
}