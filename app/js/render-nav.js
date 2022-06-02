

function openHistorico(){
    ipcRenderer.send('historicoPage')
    $('#menuButton').click()
}