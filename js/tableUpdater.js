var cachedPlayers = {}
var currentPlayers = {}


var colors = {
  "0": { color: "black" },
  "1": { color: "dark_blue" },
  "2": { color: "dark_green" },
  "3": { color: "dark_aqua" },
  "4": { color: "dark_red" },
  "5": { color: "dark_purple" },
  "6": { color: "gold" },
  "7": { color: "gray" },
  "8": { color: "dark_gray" },
  "9": { color: "blue" },
  a: { color: "green" },
  b: { color: "aqua" },
  c: { color: "red" },
  d: { color: "light_purple" },
  e: { color: "yellow" },
  f: { color: "white" },
}

const getBwFormattedLevel = star => {
  const prestigeColors = [
    { req: 0, fn: n => `§7[${n}@]` },
    { req: 100, fn: n => `§f[${n}@]` },
    { req: 200, fn: n => `§6[${n}@]` },
    { req: 300, fn: n => `§b[${n}@]` },
    { req: 400, fn: n => `§2[${n}@]` },
    { req: 500, fn: n => `§3[${n}@]` },
    { req: 600, fn: n => `§4[${n}@]` },
    { req: 700, fn: n => `§d[${n}@]` },
    { req: 800, fn: n => `§9[${n}@]` },
    { req: 900, fn: n => `§5[${n}@]` },
    {
      req: 1000, fn: n => {
        const nums = n.toString().split("");
        return `§c[§6${nums[0]}§e${nums[1]}§a${nums[2]}§b${nums[3]}§d@§5]`;
      }
    },
    { req: 1100, fn: n => `§7[§f${n}§7Ã]` },
    { req: 1200, fn: n => `§7[§e${n}§6Ã§7]` },
    { req: 1300, fn: n => `§7[§b${n}§3Ã§7]` },
    { req: 1400, fn: n => `§7[§a${n}§2Ã§7]` },
    { req: 1500, fn: n => `§7[§3${n}§9Ã§7]` },
    { req: 1600, fn: n => `§7[§c${n}§4Ã§7]` },
    { req: 1700, fn: n => `§7[§d${n}§5Ã§7]` },
    { req: 1800, fn: n => `§7[§9${n}§1Ã§7]` },
    { req: 1900, fn: n => `§7[§5${n}§8Ã§7]` },
    {
      req: 2000, fn: n => {
        const nums = n.toString().split("");
        return `§8[§7${nums[0]}§f${nums[1]}${nums[2]}§7${nums[3]}§8Ã]`;
      }
    },
    {
      req: 2100, fn: n => {
        const nums = n.toString().split("");
        return `§f[${nums[0]}§e${nums[1]}${nums[2]}§6${nums[3]}Æ]`;
      }
    },
    {
      req: 2200, fn: n => {
        const nums = n.toString().split("");
        return `§6[${nums[0]}§f${nums[1]}${nums[2]}§b${nums[3]}§3Æ]`;
      }
    },
    {
      req: 2300, fn: n => {
        const nums = n.toString().split("");
        return `§5[${nums[0]}§d${nums[1]}${nums[2]}§6${nums[3]}§eÆ]`;
      }
    },
    {
      req: 2400, fn: n => {
        const nums = n.toString().split("");
        return `§b[${nums[0]}§f${nums[1]}${nums[2]}§7${nums[3]}Æ§8]`;
      }
    },
    {
      req: 2500, fn: n => {
        const nums = n.toString().split("");
        return `§f[${nums[0]}§a${nums[1]}${nums[2]}§2${nums[3]}Æ]`;
      }
    },
    {
      req: 2600, fn: n => {
        const nums = n.toString().split("");
        return `§4[${nums[0]}§c${nums[1]}${nums[2]}§d${nums[3]}5]`;
      }
    },
    {
      req: 2700, fn: n => {
        const nums = n.toString().split("");
        return `§e[${nums[0]}§f${nums[1]}${nums[2]}§8${nums[3]}Æ]`;
      }
    },
    {
      req: 2800, fn: n => {
        const nums = n.toString().split("");
        return `§a[${nums[0]}§2${nums[1]}${nums[2]}§6${nums[3]}Æ§e]`;
      }
    },
    {
      req: 2900, fn: n => {
        const nums = n.toString().split("");
        return `§b[${nums[0]}§3${nums[1]}${nums[2]}§9${nums[3]}Æ§1]`;
      }
    },
    {
      req: 3000, fn: n => {
        const nums = n.toString().split("");
        return `§e[${nums[0]}§6${nums[1]}${nums[2]}§c${nums[3]}Æ§4]`;
      }
    }
  ]

  const index = prestigeColors.findIndex(({ req }, index, arr) => star >= req && ((arr[index + 1] && star < arr[index + 1].req) | !arr[index + 1]));
  return prestigeColors[index].fn(star);
}

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

const removePlayer = async player => {
  if (!player in currentPlayers) return;
  delete currentPlayers[player]
  tableUpdater()
}

const mcColorParser = text => {
  var splitText = text.split("§").slice(1)
  var finalText = ""

  splitText.forEach(parts => finalText += `<span class="${colors[parts[0]].color} shadow">${parts.split("").slice(1).join("")}</span>`)
  return finalText
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

const tableUpdater = async mode => {
  mode = mode ? mode : "overall"
  
  showWindow()

  clearTimeout(timeOut);
  timeOut = setTimeout(() => {
    //hideWindow()
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

    return b.threatIndex - a.threatIndex
  })

  objectValues.forEach(async (player, index) => {
    var row = table.insertRow(index + 1);

    var head = row.insertCell(0);
    var name = row.insertCell(1);
    var ws = row.insertCell(2);
    var wins = row.insertCell(3);
    var finals = row.insertCell(4);
    var fkdr = row.insertCell(5);
    var wlr = row.insertCell(6);
    var bblr = row.insertCell(7);

    if (player.exists == false) {
      name.innerHTML = mcColorParser(`§7${player.username} - §4Nicked.`)
    } else {
      var threatColor = getThreatColor(((player.stats ? player.stats.bedwars : {}).level != undefined ? (player.stats ? player.stats.bedwars : {}).level : Infinity) * ((player.stats ? player.stats.bedwars.overall : {}).fkdr != undefined ? (player.stats ? player.stats.bedwars.overall : {}).fkdr : Infinity))
      head.innerHTML = `<img src="https://api.statsify.net/gen/head?player=${player.username}&flat=true"; class="skull";></img>`
      name.innerHTML = `${makeTooltip(index + 1, mcColorParser(`${getBwFormattedLevel(Math.floor(player.stats.bedwars.level))} ${player.displayName}`), mcColorParser(`
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