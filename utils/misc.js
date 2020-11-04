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

const getRank = json => {
  let rank = 'NON';
  if (json.monthlyPackageRank || json.packageRank || json.newPackageRank) {
    if (json.monthlyPackageRank == "SUPERSTAR") rank = replaceRank(json.monthlyPackageRank);
    else {
      if (json.packageRank && json.newPackageRank) rank = replaceRank(json.newPackageRank);
      else rank = replaceRank(json.packageRank || json.newPackageRank);
    }
  }
  if (json.rank && json.rank != 'NORMAL') rank = json.rank.replace('MODERATOR', 'MOD');
  if (json.prefix) rank = json.prefix.replace(/§.|\[|]/g, '');
  if (rank == "YOUTUBER") rank = "YOUTUBE"

  function replaceRank(toReplace) {
    return toReplace
      .replace('SUPERSTAR', "MVP++")
      .replace('VIP_PLUS', 'VIP+')
      .replace('MVP_PLUS', 'MVP+')
      .replace('NONE', '');
  }

  return rank.length == 0 ? `NON` : rank;
}

const getPlusColor = (rank, plus) => {
  if (plus == undefined || rank == 'PIG+++') {
    var rankColor = {
      'MVP+': { mc: '§c', hex: '#FF5555' },
      'MVP++': { mc: '§c', hex: '#FFAA00' },
      'VIP+': { mc: '§6', hex: '#FFAA00' },
      'PIG+++': { mc: '§b', hex: '#FF55FF' },
    }[rank]
    if (!rankColor) return { mc: '§7', hex: '#BAB6B6' }
  } else {
    var rankColorMC = {
      RED: { mc: '§c', hex: '#FF5555' },
      GOLD: { mc: '§6', hex: '#FFAA00' },
      GREEN: { mc: '§a', hex: '#55FF55' },
      YELLOW: { mc: '§e', hex: '#FFFF55' },
      LIGHT_PURPLE: { mc: '§d', hex: '#FF55FF' },
      WHITE: { mc: '§f', hex: '#F2F2F2' },
      BLUE: { mc: '§9', hex: '#5555FF' },
      DARK_GREEN: { mc: '§2', hex: '#00AA00' },
      DARK_RED: { mc: '§4', hex: '#AA0000' },
      DARK_AQUA: { mc: '§3', hex: '#00AAAA' },
      DARK_PURPLE: { mc: '§5', hex: '#AA00AA' },
      DARK_GRAY: { mc: '§8', hex: '#555555' },
      BLACK: { mc: '§0', hex: '#000000' },
    }[plus]
    if (!rankColorMC) return { mc: '§7', hex: '#BAB6B6' }
  }
  return rankColor || rankColorMC;
}

const getFormattedRank = (rank, color) => {
  rank = { 'MVP+': `§b[MVP${color}+§b]`, 'MVP++': `§6[MVP${color}++§6]`, 'MVP': '§b[MVP]', 'VIP+': `§a[VIP${color}+§a]`, 'VIP': `§a[VIP]`, 'YOUTUBE': `§c[§fYOUTUBE§c]`, 'PIG+++': `§d[PIG${color}+++§d]`, 'HELPER': `§9[HELPER]`, 'MOD': `§2[MOD]`, 'ADMIN': `§c[ADMIN]`, 'OWNER': `§c[OWNER]`, 'SLOTH': `§c[SLOTH]`, 'ANGUS': `§c[ANGUS]`, 'APPLE': '§6[APPLE]', 'MOJANG': `§6[MOJANG]`, 'BUILD TEAM': `§3[BUILD TEAM]`, 'EVENTS': `§6[EVENTS]` }[rank]
  if (!rank) return `§7`
  return `${rank} `
}

const getRankColor = (rank) => {
  if (["YOUTUBE", "ADMIN", "OWNER", "SLOTH"].includes(rank)) return "c";
  else if (rank == "PIG+++") return "d";
  else if (rank == "MOD") return "2";
  else if (rank == "HELPER") return "9";
  else if (rank == "BUILD TEAM") return "3";
  else if (["MVP++", "APPLE", "MOJANG"].includes(rank)) return "6";
  else if (["MVP+", "MVP"].includes(rank)) return "b";
  else if (["VIP+", "VIP"].includes(rank)) return "a";
  else return "7";
}

const ratio = (n1 = 0, n2 = 0) => isFinite(n1 / n2) ? + (n1 / n2).toFixed(2) : isFinite(n2) ? 0 : Infinity

const mcColorParser = text => {
  var splitText = text.split("§").slice(1)
  var finalText = ""

  splitText.forEach(parts => finalText += `<span class="${colors[parts[0]].color} shadow">${parts.split("").slice(1).join("")}</span>`)
  return finalText
}

module.exports = {
  getRank,
  getPlusColor,
  getRankColor,
  getFormattedRank,
  ratio,
  mcColorParser
}