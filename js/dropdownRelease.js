const shell = require('electron').shell;

const updateAlert = (title, body, version) => {
    document.getElementById("updateBanner").innerHTML = `
        <div class="updateBanner">
            <div class="update-header">
            ${title}
            <a href="#"><img  onclick="shell.openExternal('https://statsify.net/overlay');" src="./img/icons/download.png"/></a>
            </div>
            <br>
            <div class="update-content">
                <p>${body}</p>
            </div>
            <div class="update-footer">
                New Version: ${version}
            </div>
        </div>`
};