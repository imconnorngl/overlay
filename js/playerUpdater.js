const fs = require('fs');
var ks = require('node-key-sender');

ks.setOption('globalDelayPressMillisec', 20);

var mostRecentSize = 0
var fileLocation;
var timesRead = 0
var lobbyMode = false;
var previousLines = [];
var autoWhoed = false;

const autoTypeWho = () => {
    var autoWhoToggle = readFromStorage("autoWho")
    lobbyMode = false;
    autoWhoed = true;
    if (autoWhoToggle && autoWhoToggle == true) {
        setTimeout(() => {
            ks.startBatch()
                .batchTypeKey('slash')
                .batchTypeText('who')
                .batchTypeKey('enter')
                .sendBatch();
        }, 750)
    }
}

const readLogFile = async () => {
    var newSize = fs.fstatSync(fileLocation).size
    if (timesRead == 0) {
        mostRecentSize = newSize
        timesRead++
        setTimeout(readLogFile, 10)
    } else if (newSize < mostRecentSize + 1) {
        setTimeout(readLogFile, 10)
    } else {
        fs.read(fileLocation, Buffer.alloc(2056), 0, 2056, mostRecentSize, (err, bytecount, buff) => {
            mostRecentSize += bytecount

            const lines = buff.toString().split(/\r?\n/).slice(0, -1);
            lines.forEach(line => processLine(line))
            readLogFile()
        });
    }
}

// line.includes("[CHAT]                                      ")
const processLine = async line => {
    if (!line.includes('[Client thread/INFO]: [CHAT]')) return;

 
    if (line.includes("Sending you to mini") || line.includes("[CHAT]                                      ")) {
        autoWhoed = false;
        if (lobbyMode == false) {
            resetPlayers()
            resetCache()
        }
    } else if (line.includes(" has joined (")) {
        var player = line.split(" [CHAT] ")[1].split(" has joined")[0]
        addPlayer(player)
        lobbyMode = false;
        if (autoWhoed == false) autoTypeWho()
    } else if (line.includes(" has quit!")) {
        lobbyMode = false;
        var player = line.split(" [CHAT] ")[1].split(" has quit!")[0]
        removePlayer(player)
        if (autoWhoed == false) autoTypeWho()
    } else if (line.includes(" ONLINE: ")) {
        var players = line.split(" [CHAT] ONLINE: ")[1].split(", ")
        resetPlayers()
        players.forEach(player => {
            addPlayer(player)
        })
    } else if (line.includes("Online Players(")) {
        lobbyMode = true;
        resetPlayers()

        var players = line.split(" [CHAT] Online Players(");
        players.shift()

        players = players[0].split(", ")
        players.shift()

        players.forEach((player, index) => {
            setTimeout(() => {
                if (player.includes(" ")) player = player.split(" ")[player.split(" ").length - 1]
                addPlayer(player)
            }, index * 25)
        })
    } else if (line.toLowerCase().includes(" can't find a player by the name of '.hide'") || line.toLowerCase().includes(" can't find a player by the name of '.h'")) {
        hideWindow()
    } else if (line.toLowerCase().includes(" can't find a player by the name of '.show'") || line.toLowerCase().includes(" can't find a player by the name of '.s'")) {
        showWindow()
    } else if (line.toLowerCase().includes(" can't find a player by the name of '.clear'") || line.toLowerCase().includes(" can't find a player by the name of '.c'")) {
        resetPlayers()
        resetCache()
    } else if (line.includes(" Can't find a player by the name of '")) {
        var player = line.split(" Can't find a player by the name of '")[1]
        addPlayer(parseCompactChat(player, ".", '\''))
    } else if (readFromStorage("partyEnabled") && line.split(" [CHAT] ")[1].match(/\S*(?=( to the party! They have 60 seconds to accept.))/)) { // Invite (In Party)
        var player = line.split(" [CHAT] ")[1].match(/\S*(?=( to the party! They have 60 seconds to accept.))/)[0];

        addPlayer(player)
    } else if (readFromStorage("partyEnabled") && line.split(" [CHAT] ")[1].match(/\S*(?=( party!))/)) { // You Joining Party (Out of Party)
        var player = line.split(" [CHAT] ")[1].match(/\S*(?=('))/)[0];

        addPlayer(player)
    } else if (readFromStorage("partyEnabled") && line.split(" [CHAT] ")[1].match(/\S*(?=( joined the party.))/)) { // Someone Joining Party (Out of Party)
        var player = line.split(" [CHAT] ")[1].match(/\S*(?=( joined the party.))/)[0];

        addPlayer(player)
    } else if (readFromStorage("partyEnabled") && line.split(" [CHAT] ")[1].match(/Party Leader: (\S.*)/) && line.split(" [CHAT] ")[1].match(/Party Leader: (\S.*)/).length == 2) { // Party List (Leader)
        var player = line.split(" [CHAT] ")[1].match(/(?<=\: )(.*?)(?= \?)/)
        player = player[0].split(" ");

        addPlayer(player[player.length - 1]);
    } else if (readFromStorage("partyEnabled") && line.split(" [CHAT] ")[1].match(/Party Moderators: (\S.*)/) && line.split(" [CHAT] ")[1].match(/Party Moderators: (\S.*)/).length == 2) { // Party List (Moderators)
        var players = line.split(" [CHAT] ")[1].replace("Party Moderators: ", "").replace(/\[(.*?)\]/g, '');
        players = players.split(" ?");
        players.pop()
        players.forEach(user => {
            addPlayer(user.replace(/ /g, ""))
        })
    } else if (readFromStorage("partyEnabled") && line.split(" [CHAT] ")[1].match(/Party Members: (\S.*)/) && line.split(" [CHAT] ")[1].match(/Party Members: (\S.*)/).length == 2) { // Party List (Members)
        var players = line.split(" [CHAT] ")[1].replace("Party Members: ", "").replace(/\[(.*?)\]/g, '');
        players = players.split(" ?");
        players.pop()
        players.forEach(user => {
            addPlayer(user.replace(/ /g, ""))
            setTimeout(() => removePlayer(user.replace(/ /g, "")), 15000)
        })
    } else if (readFromStorage("partyEnabled") && line.split(" [CHAT] ")[1].match(/You'll be partying with: (\S.*)/)) { // Party Group Join (Out of Party)
        var players = line.split(" [CHAT] ")[1].replace("You'll be partying with: ", '').replace(/and \d* other players!/, "").replace(/\[(.*?)\]/g, '');
        players = players.split(", ");

        players.forEach(user => {
            addPlayer(user.replace(/ /g, ""))
            setTimeout(() => removePlayer(user.replace(/ /g, "")), 15000)
        })
    } else if (line.split(" [CHAT] ")[1].match(/\S+(?=\:)/) && (readFromStorage("lobbyEnabled") || false) == true) {
        if (line.split(" [CHAT] ")[1].includes("�2Guild > ") || line.split(" [CHAT] ")[1].includes("�9Party �8> ") || !line.split(" [CHAT] ")[1].replace(/�(\S)/g, '').includes("?] ")) return
        var player = line.split(" [CHAT] ")[1]
        player = player.match(/\S+(?=\:)/);
        player = player[0].replace(/�(\S)/g, '');

        addPlayer(player)
        setTimeout(() => removePlayer(player), 15000)
    } else if (line.includes("[CHAT] Your new API key is ")) {
        var key = line.split("[CHAT] Your new API key is ")[1];
        document.getElementById("apiKeyField").value = key;
        writeToStorage("api", key);
    }
}

const parseCompactChat = (line, startChar, endChar) => {
    newLine = line;
    newLine = newLine.split(endChar)[0]
    newLine = newLine.replace(startChar, "")

    return newLine
}

const readLogs = () => {
    fs.open((readFromStorage("path")), 'r', (err, fd) => {
        fileLocation = fd
        readLogFile()
    })
}

const getFileAccessDate = path => {
    try {
        var stats = fs.statSync(path)
    } catch {
        return null
    }

    if (!stats) return null
    return stats.mtimeMs
}

if (readFromStorage("path")) {
    if (readFromStorage("path") == `${app.getPath("home").replace(/\\/g, "\/")}/.lunarclient/offline/files/1.8.9/logs/latest.log`) {
        writeToStorage("path", `${app.getPath("home").replace(/\\/g, "\/")}/.lunarclient/offline/files/1.8/logs/latest.log`)
    }

    readLogs()
}
else {
    var logFiles = [
        { name: "lunar", path: `${app.getPath("home").replace(/\\/g, "\/")}/.lunarclient/offline/files/1.8/logs/latest.log` },
        { name: "vanilla", path: `${app.getPath("home").replace(/\\/g, "\/")}/AppData/Roaming/.minecraft/logs/latest.log` },
        { name: "badlion", path: `${app.getPath("home").replace(/\\/g, "\/")}/AppData/Roaming/.minecraft/logs/blclient/minecraft/latest.log` },
        { name: "pvplongue", path: `${app.getPath("home").replace(/\\/g, "\/")}/AppData/Roaming/.pvplounge/logs/latest.log` }
    ]

    logFiles = logFiles.sort((a, b) => {
        b.time = getFileAccessDate(a.path) || null
        a.time = getFileAccessDate(b.path) || null

        return a.time - b.time
    })

    if (logFiles[0].time) {
        writeToStorage("path", logFiles[0].path)
        switch (logFiles[0].name) {
            case "lunar":
                document.getElementById("lcOption").selected = "selected"
                break;
            case "vanilla":
                document.getElementById("vfOption").selected = "selected"
                break;
            case "badlion":
                document.getElementById("bcOption").selected = "selected"
                break;
            case "pvplongue":
                document.getElementById("plcOption").selected = "selected"
                break;
        }

        readLogs()

    } else toggleMenu()
}