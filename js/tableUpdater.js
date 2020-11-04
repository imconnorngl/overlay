var cachedPlayers = {}
var currentPlayers = {}

const addPlayer = async player => {
  if (player in currentPlayers) return;

  if (player in cachedPlayers) {
    currentPlayers[player] = cachedPlayers[player]
  } else {
    var playerObj = await getPlayer(player)
    if (playerObj.exists == false) playerObj["username"] = player
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

const makeTooltip = (index, text, html) =>  `<div class="tooltip">${text}<span class="tooltiptext" style="bottom: ${-1200 + (index*100)}%">${html}</span></div>`

const getThreatColor = index => {
  if (index <= 100) return `§a`
  else if (index <= 250) return `§2`
  else if (index <= 500) return `§e`
  else if (index <= 750) return `§6`
  else if (index <= 1000) return `§c`
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

    a.threatIndex = aLevel * aFKDR
    b.threatIndex = bLevel * bFKDR

    var sortMode = readFromStorage("sort") || "threat"

    if(sortMode == "threat") return b.threatIndex - a.threatIndex
    else if(sortMode == "level") return bLevel - aLevel
    else return bFKDR - aFKDR
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

    if (player.exists == false) {
      name.innerHTML = mcColorParser(`§7${player.username}`)
      tag.innerHTML = mcColorParser(`§4NICKED`)
    }
    else if (player.throttle) name.innerHTML = mcColorParser(`§7${player.username || "ERROR"} - §cKey Throttle`)
    else if (player.invalid) name.innerHTML = mcColorParser(`§7${player.username || "ERROR"} - §cInvalid API Key`)
    else {
      if(player.chat == "PARTY") tag.innerHTML = mcColorParser(`§9PARTY`)

      var threatColor = getThreatColor(((player.stats ? player.stats.bedwars : {}).level != undefined ? (player.stats ? player.stats.bedwars : {}).level : Infinity) * ((player.stats ? player.stats.bedwars.overall : {}).fkdr != undefined ? (player.stats ? player.stats.bedwars.overall : {}).fkdr : Infinity))
      head.innerHTML = `<img src="https://crafatar.com/avatars/${player.uuid}?overlay=true"; class="skull";></img>`
      name.innerHTML = `${makeTooltip(index + 1, mcColorParser(`${getBwFormattedLevel(Math.floor(player.stats.bedwars.level))} ${player.displayName}`), mcColorParser(`
      ${player.displayName}
      <br>
      <br>
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
    }
  });
}

module.exports = tableUpdater