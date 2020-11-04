const fs = require('fs');
var ks = require('node-key-sender');

ks.setOption('globalDelayPressMillisec', 18);

var mostRecentSize = 0
var fileLocation;
var timesRead = 0
var lobbyMode = false;

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

const processLine = async line => {
    if (!line.includes('[Client thread/INFO]: [CHAT]')) return;
    if (line.includes("spooked into the lobby!") || line.includes("Sending you to mini")) {
        if (lobbyMode == false) {
            resetPlayers()
            resetCache()
        }

        var autoWhoToggle = readFromStorage("autoWho")
        if (line.includes("Sending you to mini")) {
            lobbyMode = false;
            if(autoWhoToggle && autoWhoToggle == true) {
                setTimeout(() => {
                    ks.startBatch()
                    .batchTypeKey('slash')
                    .batchTypeText('who')
                    .batchTypeKey('enter')
                    .sendBatch();
                }, 600)    
            }
        }
    } else if (line.includes(" has joined (")) {
        lobbyMode = false;
        var player = line.split(" [CHAT] ")[1].split(" has joined")[0]
        addPlayer(player)
    } else if (line.includes(" has quit!")) {
        lobbyMode = false;
        var player = line.split(" [CHAT] ")[1].split(" has quit!")[0]
        removePlayer(player)
    } else if (line.includes(" ONLINE: ")) {
        var players = line.split(" [CHAT] ONLINE: ")[1].split(", ")
        resetPlayers()
        players.forEach(player => {
            addPlayer(player)
        })
    } else if (line.includes("Online Players(")) {
        lobbyMode = true;
        resetPlayers()
        resetCache()
        
        var players = line.split(" [CHAT] Online Players(");
        players.shift()

        players = players[0].split(", ")
        players.shift()

        players.forEach(player => {
            if (player.includes(" ")) player = player.split(" ")[player.split(" ").length - 1]
            addPlayer(player) 
        })
    }else if (line.includes(" Can't find a player by the name of '.hide'")) {
        hideWindow()
    } else if (line.includes(" Can't find a player by the name of '.show'")) {
        showWindow()
    } else if (line.includes(" Can't find a player by the name of '")) {
        var player = line.split(" Can't find a player by the name of '")[1]
        player = player.slice(1, -1)
        addPlayer(player)
    } else if (line.includes("[CHAT] Your new API key is ")) {
        var key = line.split("[CHAT] Your new API key is ")[1];
        document.getElementById("apiKeyField").value = key;
        writeToStorage("api", key);
    }
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

if (readFromStorage("path")) readLogs()
else{
    var logFiles = [
        { name: "lunar", path: `${app.getPath("home").replace(/\\/g, "\/")}/.lunarclient/offline/files/1.8.9/logs/latest.log` },
        { name: "vanilla", path: `${app.getPath("home").replace(/\\/g, "\/")}/AppData/Roaming/.minecraft/logs/latest.log` },
        { name: "badlion", path: `${app.getPath("home").replace(/\\/g, "\/")}/AppData/Roaming/.minecraft/logs/blclient/minecraft/latest.log` }, 
        { name: "pvplongue", path: `${app.getPath("home").replace(/\\/g, "\/")}/AppData/Roaming/.pvplounge/logs/latest.log` }
    ]

    logFiles = logFiles.sort((a, b) => {
        b.time = getFileAccessDate(a.path) || null
        a.time = getFileAccessDate(b.path)  || null
        
        return a.time - b.time
    })

    if (logFiles[0].time) {
        writeToStorage("path", logFiles[0].path)
        switch(logFiles[0].name) {
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

