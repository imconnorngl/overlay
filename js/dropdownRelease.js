const Alert = (title, body, version) => {
    document.getElementById("updateBanner").innerHTML = `
        <div class="updateBanner">
            <img class="success-img" src="./img/icons/update.png" />
            <div class="update-header">${version} ${title}</div>
            <br>
            <div class="success-content">
            <p>${body}</p>
            </div>
        </div>`
};
    