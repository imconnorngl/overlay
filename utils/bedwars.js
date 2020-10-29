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

    return parseFloat((level + (remainingExp / 5000)).toFixed(2))
}


module.exports = {
    getBwLevel
}