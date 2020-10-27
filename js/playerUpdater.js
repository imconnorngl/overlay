const fs = require('fs');
var ks = require('node-key-sender');

ks.setOption('globalDelayBetweenMillisec', 30);

var mostRecentSize = 0
var fileLocation;
var timesRead = 0

const readLogFile = async () => {
    var newSize = fs.fstatSync(fileLocation).size
    if (timesRead == 0) {
        mostRecentSize = newSize
        timesRead++
        setTimeout(readLogFile, 10)
    } else if (newSize < mostRecentSize + 1) {
        setTimeout(readLogFile, 10)
    } else {
        fs.read(fileLocation, Buffer.alloc(256), 0, 256, mostRecentSize, (err, bytecount, buff) => {
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
        resetPlayers()
        if(line.includes("Sending you to mini")) setTimeout(() => ks.sendKeys(['slash', 'w', 'h', 'o', 'enter']), 600)    
    } else if (line.includes(" has joined (")) {
        var player = line.split(" [CHAT] ")[1].split(" has joined")[0]
        addPlayer(player)
    } else if (line.includes(" has quit!")) {
        var player = line.split(" [CHAT] ")[1].split(" has quit!")[0]
        removePlayer(player)
    } else if (line.includes(" ONLINE: ")) {
        var players = line.split(" [CHAT] ONLINE: ")[1].split(", ")
        resetPlayers()
        players.forEach(player => {
            addPlayer(player)
        })
    } else if (line.includes(" Can't find a player by the name of '")) {
        var player = line.split(" Can't find a player by the name of '")[1]
        player = player.slice(1, -1)
        addPlayer(player)
    }
}

fs.open('C:/Users/conno/AppData/Roaming/.minecraft/logs/latest.log', 'r', (err, fd) => {
    fileLocation = fd
    readLogFile()
})
