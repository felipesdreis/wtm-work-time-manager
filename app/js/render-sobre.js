
const { ipcRenderer } = require('electron')
const $ = require('jquery')

window.onload = () => {
    $("#nav-placeholder").load("./nav.html");
}


