
const { ipcRenderer } = require('electron')
const $ = require('jquery')
const dataService = require('../../services/data')

window.onload = () => {
    $("#nav-placeholder").load("./nav.html");

    let dados = dataService.pegaTodosDados()
    dia.dias = dados
}


var dia = new Vue({
    el: '#dias',
    data: {
        dias: []
    }
})

function abrirDetalhes(dadosDia) {

    console.log(dadosDia)
    ipcRenderer.send('detalhesPage', dadosDia)
}

function deletar(dia){
    dataService.deletarDia(dia)
    location.reload()
}