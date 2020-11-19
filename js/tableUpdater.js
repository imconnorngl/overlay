var cachedPlayers = {}
var currentPlayers = {}
var cachedGuilds = new Map()

const addPlayer = async player => {
  if (player in currentPlayers) return;

  if (player in cachedPlayers) {
    currentPlayers[player] = cachedPlayers[player]
  } else {
    var playerObj = await getPlayer(player)
    if (playerObj.exists == false) playerObj["username"] = player
    else if (readFromStorage("guildEnabled")) {
      var guild;
      if (cachedGuilds.get(playerObj.uuid)) guild = cachedGuilds.get(player.uuid)
      else if (!playerObj.outage || !playerObj.throttle || !playerObj.invalid) guild = await getGuild(playerObj.uuid);

      if (guild.members) guild.members.forEach(member => cachedGuilds.set(member.uuid. guild))
      playerObj.guild = guild;
    }

    cachedPlayers[player] = playerObj
    currentPlayers[player] = playerObj
    
  }
  tableUpdater()
}

const resetPlayers = async () => {
  currentPlayers = {}
  tableUpdater()
}

const resetCache = async () => {
  cachedPlayers = {}
  tableUpdater()
}

const removePlayer = async player => {
  if (!player in currentPlayers) return;
  delete currentPlayers[player]
  tableUpdater()
}

const removePlayers = async players => {
  players.forEach(player => {
    if (!player in currentPlayers) return;
    delete currentPlayers[player]
    delete cachedPlayers[player];
  })

  tableUpdater()
}

//

var erroredPlayers = [];
schedule.scheduleJob('1 * * * * *', function() {
  if(erroredPlayers.length) removePlayers(erroredPlayers);
  erroredPlayers = [];
});

//

const makeTooltip = (index, text, html) =>  `<div class="tooltip">${text}<span class="tooltiptext" style="bottom: ${-1600 + (index*100)}%">${html}</span></div>`

const getThreatColor = index => {
  index = Math.ceil(index);

  if (index <= 45) return `§7`
  else if (index <= 80) return `§a`
  else if (index <= 120) return `§2`
  else if (index <= 225) return `§e`
  else if (index <= 325) return `§6`
  else if (index <= 650) return `§c`
  else return `§4`
}

var timeOut;

const tableUpdater = async () => {    
  var mode = readFromStorage("mode") || "overall"
  showWindow()

  clearTimeout(timeOut);
  timeOut = setTimeout(() => {
    var hideMode = readFromStorage("autoHide")
    if(hideMode == undefined || hideMode == true) hideWindow()
  }, 20000)

  const table = document.getElementById("playerTable");

  var rowCount = table.rows.length;
  for (var i = 1; i < rowCount; i++) table.deleteRow(1);

  var objectValues = Object.values(currentPlayers)

  objectValues = objectValues.sort((a, b) => {
    var aLevel = (a.stats ? a.stats.bedwars : {}).level != undefined ? (a.stats ? a.stats.bedwars : {}).level : Infinity
    var bLevel = (b.stats ? b.stats.bedwars : {}).level != undefined ? (b.stats ? b.stats.bedwars : {}).level : Infinity

    var aFKDR = (a.stats ? a.stats.bedwars[mode] : {}).fkdr != undefined ? (a.stats ? a.stats.bedwars[mode] : {}).fkdr : Infinity
    var bFKDR = (b.stats ? b.stats.bedwars[mode] : {}).fkdr != undefined ? (b.stats ? b.stats.bedwars[mode] : {}).fkdr : Infinity

    var aWS = (a.stats ? a.stats.bedwars[mode] : {}).winstreak || 0
    var bWS = (b.stats ? b.stats.bedwars[mode] : {}).winstreak || 0

    a.threatIndex = (aLevel * aFKDR * aFKDR)/10
    b.threatIndex = (bLevel * bFKDR * bFKDR)/10

    var sortMode = readFromStorage("sort") || "threat"

    if(sortMode == "threat") return b.threatIndex - a.threatIndex
    else if(sortMode == "level") return bLevel - aLevel
    else if (sortMode == "fkdr") return bFKDR - aFKDR
    else return bWS - aWS
  })

  objectValues.forEach(async (player, index) => {
    var row = table.insertRow(index + 1);

    var head = row.insertCell(0);
    var name = row.insertCell(1);
    var tag = row.insertCell(2);
    var ws = row.insertCell(3);
    var wins = row.insertCell(4);
    var finals = row.insertCell(5);
    var fkdr = row.insertCell(6);
    var wlr = row.insertCell(7);
    var bblr = row.insertCell(8);
    
    var partyMembers = {};

    if (player.exists == false) {
      name.innerHTML = mcColorParser(`§7${player.username}`)
      tag.innerHTML = mcColorParser(`§4NICKED`)
    }
    else if (player.outage) { name.innerHTML = mcColorParser(`§8${player.username || "ERROR"} - §cHypixel API Outage`); erroredPlayers.push(player.username); }
    else if (player.throttle) { name.innerHTML = mcColorParser(`§8${player.username || "ERROR"} - §cKey Throttle`); erroredPlayers.push(player.username); }
    else if (player.invalid) { name.innerHTML = mcColorParser(`§8${player.username || "ERROR"} - §cInvalid API Key`); erroredPlayers.push(player.username); }
    else {
      if((["e3b17fc96e5b437a9c88a84dc6adaa39", "618a96fec8b0493fa89427891049550b", "20aa2cf67b7443a093b5f3666c160f5f"]).includes(player.uuid)) tag.innerHTML = mcColorParser(`§3DEV`)
      else if (objectValues.length <= 48) {
        if(player.chat == "PARTY") tag.innerHTML = mcColorParser(`§9PARTY`);

        const filteredPlayers = objectValues.filter(p => p.username != player.username)
        filteredPlayers.forEach(p => {
          if (player.guild && p.guild && player.guild._id && p.guild._id && player.guild._id == p.guild._id) { tag.innerHTML = mcColorParser(`§9PARTY`); partyMembers[p.uuid] = (p.username) }
          else if (player.stats && p.stats && player.stats.bedwars && p.stats.bedwars) {
            if (player.stats.bedwars.overall.winstreak == p.stats.bedwars.overall.winstreak && player.stats.bedwars.overall.winstreak > 3 && p.stats.bedwars.overall.winstreak > 3) { tag.innerHTML = mcColorParser(`§9PARTY`); partyMembers[p.uuid] = (p.username) }
            else if (player.stats.bedwars.doubles.winstreak == p.stats.bedwars.doubles.winstreak && player.stats.bedwars.doubles.winstreak > 3 && p.stats.bedwars.doubles.winstreak > 3) { tag.innerHTML = mcColorParser(`§9PARTY`); partyMembers[p.uuid] = (p.username) }
            else if (player.stats.bedwars.threes.winstreak == p.stats.bedwars.threes.winstreak && player.stats.bedwars.threes.winstreak > 3 && p.stats.bedwars.threes.winstreak > 3) { tag.innerHTML = mcColorParser(`§9PARTY`); partyMembers[p.uuid] = (p.username) }
            else if (player.stats.bedwars.fours.winstreak == p.stats.bedwars.fours.winstreak && player.stats.bedwars.fours.winstreak > 3 && p.stats.bedwars.fours.winstreak > 3) { tag.innerHTML = mcColorParser(`§9PARTY`); partyMembers[p.uuid] = (p.username) }
            else if (player.stats.bedwars["4v4"].winstreak == p.stats.bedwars["4v4"].winstreak && player.stats.bedwars["4v4"].winstreak > 3 && p.stats.bedwars["4v4"].winstreak > 3) { tag.innerHTML = mcColorParser(`§9PARTY`); partyMembers[p.uuid] = (p.username) }
          }
        })
      }

      var Level = (player.stats ? player.stats.bedwars : {}).level != undefined ? (player.stats ? player.stats.bedwars : {}).level : Infinity
      var FKDR = (player.stats ? player.stats.bedwars[mode] : {}).fkdr != undefined ? (player.stats ? player.stats.bedwars[mode] : {}).fkdr : Infinity
      player.threatIndex = (Level * FKDR * FKDR)/10
      var threatColor = getThreatColor(player.threatIndex);
      
      head.innerHTML = `<img src="https://crafatar.com/avatars/${player.uuid}?size=16&overlay=true"; class="skull";></img>`
      name.innerHTML = `${makeTooltip(index + 1, mcColorParser(`${getBwFormattedLevel(Math.floor(player.stats.bedwars.level))} ${player.displayName}${player.guild ? player.guild.tag ? ` ${player.guild.mcColor.mc}[${player.guild.tag}]` : "" : ""}`), mcColorParser(`
      ${player.displayName} ${player.guild ? player.guild.tag ? `${player.guild.mcColor.mc}[${player.guild.tag}]` : "" : ""}
      <br>
      ${player.guild ? player.guild.name ? `§7Guild: ${player.guild.mcColor.mc}${player.guild.name}<br>` : "" : ""}<br>
      ${Object.values(partyMembers).length ? ("§7Party Members:<br>§9" + Object.values(partyMembers).join("<br>") + "<br><br>") : player.chat == "PARTY" ? "§7Party: §9Chat <br><br>" : ""}
      §7Level: ${getBwFormattedLevel(Math.floor(player.stats.bedwars.level)).replace(/[\[\]]/g, "")}<br>
      §7Winstreak: ${threatColor}${player.stats.bedwars[mode].winstreak.toLocaleString()}<br>
      §7Games Played: ${threatColor}${player.stats.bedwars[mode].games.toLocaleString()}<br>
      <br>
      §7Wins: ${threatColor}${player.stats.bedwars[mode].wins.toLocaleString()}<br>
      §7Losses: ${threatColor}${player.stats.bedwars[mode].losses.toLocaleString()}<br>
      §7WLR: ${threatColor}${player.stats.bedwars[mode].wlr}<br>
      <br>
      §7Final Kills: ${threatColor}${player.stats.bedwars[mode].finalKills.toLocaleString()}<br>
      §7Final Deaths: ${threatColor}${player.stats.bedwars[mode].finalDeaths.toLocaleString()}<br>
      §7FKDR: ${threatColor}${player.stats.bedwars[mode].fkdr}<br />
      <br>
      §7Beds Broken: ${threatColor}${player.stats.bedwars[mode].bedsBroken.toLocaleString()}<br>
      §7Beds Lost: ${threatColor}${player.stats.bedwars[mode].bedsLost.toLocaleString()}<br>
      §7BBLR: ${threatColor}${player.stats.bedwars[mode].bblr}<br>
      `))}</div>`
      ws.innerHTML = mcColorParser(`${threatColor}${player.stats.bedwars[mode].winstreak.toLocaleString()}`)
      wins.innerHTML = mcColorParser(`${threatColor}${player.stats.bedwars[mode].wins.toLocaleString()}`)
      finals.innerHTML = mcColorParser(`${threatColor}${player.stats.bedwars[mode].finalKills.toLocaleString()}`)
      fkdr.innerHTML = mcColorParser(`${threatColor}${player.stats.bedwars[mode].fkdr}`)
      wlr.innerHTML = mcColorParser(`${threatColor}${player.stats.bedwars[mode].wlr}`)
      bblr.innerHTML = mcColorParser(`${threatColor}${player.stats.bedwars[mode].bblr}`)

      name.onmouseover = () => {
        if (readFromStorage("resizeEnabled")) {
          var window = remote.getCurrentWindow()
          var size = { x: window.getSize()[0], y: 460 }
          if (objectValues.length >= 16) size = { x: window.getSize()[0], y: 460 }
          else size = { x: window.getSize()[0], y: (450 <= Math.round(objectValues.length*25) ? Math.round(objectValues.length*25) : 450) }

          window.setSize(size.x, size.y)
        }
      }
    }
  });

  if (readFromStorage("resizeEnabled")) {
    if((document.getElementById("menu").classList.item(1) || "None") != "None") {
      var window = remote.getCurrentWindow()
      var size = { x: window.getSize()[0], y: 460 }
      if (objectValues.length >= 16) size = { x: window.getSize()[0], y: 460 }
      else size = { x: window.getSize()[0], y: 60 + Math.round(objectValues.length*25) }
  
      window.setSize(size.x, size.y)
    }
  }
}

module.exports = tableUpdater