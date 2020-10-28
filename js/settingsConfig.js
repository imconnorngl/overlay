const Store = require('electron-store');
const dialog = require('electron').remote.dialog 

const store = new Store();

const toggleMenu = () => {
    document.getElementById("menu").classList.toggle("hidden");
}

const writeToStorage = (key, value) => {
    store.set(key, value)
    console.log(value)
    return value;
}

const readFromStorage = key => {
    var val = store.get(key);
    console.log(val)
    return val || undefined;
}

const deleteFromStorage = key => {
    store.delete(key)
}

const pathBtn = document.getElementById("path-input");

pathBtn.onclick = () => {
    var options = {
        title: 'Select the latest.log file you wish to use.', 
        buttonLabel: 'Select',  
        filters: [ { name: 'Log Files', extensions: ['log'] } ], 
        properties: ['openFile'] 
    }

    if (process.platform !== 'darwin') options.properties.push('OpenDirectory')

    dialog.showOpenDialog(options, filePath_obj => { 
        if (filePath_obj) {
            writeToStorage('path', filePath_obj[0].replace(/\\/g, "\/"))
            readLogs()
            toggleMenu()
        } 
    });
}

