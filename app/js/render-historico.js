
const { ipcRenderer } = require('electron')
const $ = require('jquery')
const dataService = require('../../services/data')

let dadosDelete = false

window.onload = () => {

    let dados = dataService.pegaTodosDados()
    dia.dias = dados
    console.log("FSDR ~ dados", dados)

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

function deletar(dia) {
    if (confirm('Deseja realmente deletar?')) {
        dataService.deletarDia(dia)
        ipcRenderer.send('deleta-dia', dia)
        setTimeout(() => {
            location.reload()
        }, 500);
    }
}