const dataService = require('../../services/data')
const { ipcRenderer } = require('electron')
const timer = require('../../services/timer')
const dateFile = new Date().toLocaleDateString().replace(/\//g, '')

let timerRodando = false


let closeButton = document.querySelector("#close-button")

var tempo = new Vue({
    el: '#tempo',
    data: {
        cronometro: '00:00:00'
    }
})

var tableHoras = new Vue({
    el: '#table-horas',
    data: {
        horas: []
    }
})

/** controle de visibilade do input da descrição da atividade*/
var inputSave = new Vue({
    el: '#input-save',
    data: {
        seen: false,
        value: ""
    }
})

function deleteAtividade(id) {
    console.log(id);
    tableHoras.horas = tableHoras.horas.filter(atividades => {
        return atividades.id != id
    })
    // reorganiza ids
    tableHoras.horas = tableHoras.horas.map((item, index) => {
        item.id = index + 1
        return item
    })
}

function save() {
    inputSave.seen = true
    timerRodando = false
    timer.parar()
}

function addAtividade() {
    let newID = tableHoras.horas.length + 1
    tableHoras.horas.push(
        {
            id: newID,
            atividade: inputSave.value,
            tempo: tempo.cronometro
        }
    )

}

window.onload = () => {
    //TODO: carregar as atividades do dia
}

closeButton.addEventListener('click', () => {
    ipcRenderer.send('app-quit')
})


//botoes de controle
function inicia() {

    if (timerRodando == true) return
    timerRodando = true
    timer.iniciar(tempo)

}

function pausa() {
    timerRodando = false
    timer.parar()
}

function salvarHoras() {
    addAtividade()
    inputSave.value = ""
    inputSave.seen = false
    tempo.cronometro = "00:00:00"
    dataService.escreveArquivo(tableHoras.horas)
}

function reset() {
    timerRodando = false
    timer.parar()
    tempo.cronometro = "00:00:00"
}
