const semver = require('semver');

const getLatestReleases = async () => {
    return new Promise(async resolve => {
        const body = await fetch('https://api.github.com/repos/imconnorngl/overlay/releases/latest')
        try {
            var data = await body.json();
        } catch {
            resolve({ outage: true })
        }

        resolve(data)
    })
}

const latestRelease = getLatestReleases();

if (latestRelease.url) {
    if (readFromStorage("version") == undefined) writeToStorage("version", latestRelease.tag_name)
    else {
        var vers = readFromStorage("version")
        if (semver.gt(latestRelease.tag_name, version)) Alert(latestRelease.name, latestRelease.body, latestRelease.tag_name)
    }
}