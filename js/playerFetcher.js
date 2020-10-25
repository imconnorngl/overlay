const fetch = require('node-fetch')

const getPlayer = async (player) => {
    return new Promise(async resolve => {
        const data = await fetch(`https://api.statsify.net/player?key=ejthedj&player=${player}`)
        try { var body = await data.json() } catch { resolve({ outage: true }) }
        resolve(body)
    })
}