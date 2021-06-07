function getBwExpForLevel(level) {
    var progress = level % 100
    if (progress > 3) return 5000;
    return {
      0: 500,
      1: 1000,
      2: 2000,
      3: 3500
    }[progress]
  }
  

const getBwLevel = (exp = 0) => {
    var prestiges = Math.floor(exp / 487000);
    var level = prestiges * 100;
    var remainingExp = exp - (prestiges * 487000);

    for (let i = 0; i < 4; ++i) {
        var expForNextLevel = getBwExpForLevel(i)
        if (remainingExp < expForNextLevel) break;
        level++
        remainingExp -= expForNextLevel
    }

    return parseFloat((level + (remainingExp / getBwExpForLevel(level + 1))).toFixed(2))
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

module.exports = {
    getBwLevel,
    getBwFormattedLevel
}
