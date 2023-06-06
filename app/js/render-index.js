const dataService = require('../../services/data')
const calculoTempo = require('../../services/tempoCalculo')
const { ipcRenderer  } = require('electron')
const { Timer } = require("easytimer.js");
const $ = require('jquery')
// const dateFile = '01022022'
const dateFile = new Date().toLocaleDateString()

let timerRodando = false
//[secondTenths, seconds, minutes, hours, days]
let tempoRecuperado = [0, 0, 0, 0, 0]
var timerInstance = new Timer();


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

var totalTempo = new Vue({
    el: '#totalTempo',
    data: {
        //seen: false,
        value: ""
    }
})

var promptManual = new Vue({
    el: '#prompt-manual',
    data: {
        seen: false,
        atividade: '',
        tempo: ''
    },
    methods: {
        cancelar: () => {
            promptManual.seen = false
            promptManual.atividade = ''
            promptManual.tempo = ''
        },
        salvar: () => {
            promptManual.tempo = `${promptManual.tempo}:00`
            let validateTempo = promptManual.tempo.split(':')
            if (validateTempo.length < 3) {
                alert('Tempo deve seguir o formato 00:00')
                return
            }
            let newID = tableHoras.horas.length + 1
            tableHoras.horas.push(
                {
                    id: newID,
                    atividade: promptManual.atividade,
                    tempo: promptManual.tempo
                }
            )
            somatempos()
            dataService.escreveArquivo(dateFile, tableHoras.horas, totalTempo.value)
            localStorage.setItem('tableHoras', JSON.stringify(tableHoras.horas))
            promptManual.seen = false
            promptManual.atividade = ''
            promptManual.tempo = ''
        }
    }
})

timerInstance.addEventListener('secondsUpdated', () => {
    const obj = timerInstance.getTimeValues()
    tempo.cronometro = obj.toString()
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

    somatempos()
    dataService.escreveArquivo(dateFile, tableHoras.horas, totalTempo.value)

}

function save() {
    inputSave.seen = true
    timerRodando = false
    timerInstance.pause()
    setTimeout(() => {
        $("#input-description").focus();
    }, 200);

}

function salvarHoras() {
    addAtividade()
    inputSave.value = ""
    inputSave.seen = false
    tempo.cronometro = "00:00:00"
    tempoRecuperado = [0, 0, 0, 0, 0]
    timerInstance.reset()
    timerInstance.stop()
    somatempos()
    dataService.escreveArquivo(dateFile, tableHoras.horas, totalTempo.value)
    localStorage.setItem('tableHoras', JSON.stringify(tableHoras.horas))

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

    let diaHoras = dataService.pegaDadosDia(dateFile)
    console.log("FSDR ~ tempHoras", diaHoras)
    if (diaHoras.table != undefined) tableHoras.horas = diaHoras.table
    $("#nav-placeholder").load("./nav.html");

    //Carrega ultimo tempo no cronometro antes de fechar
    tempo.cronometro = (localStorage.getItem("lastTimer") == '') ? '00:00:00' : localStorage.getItem("lastTimer")
    formataTempoAnterior()
    somatempos()
}

function formataTempoAnterior() {

    let tempoAntigo = (localStorage.getItem("lastTimer") == '') ? '00:00:00' : localStorage.getItem("lastTimer")
    tempoAntigo = tempoAntigo.split(':')
    tempoRecuperado = [0, parseInt(tempoAntigo[2]), parseInt(tempoAntigo[1]), parseInt(tempoAntigo[0]), 0]
    console.log("FSDR ~ formataTempoAnterior ~ tempoRecuperado", tempoRecuperado)
    if (tempoRecuperado == null) {
        tempoRecuperado = [0, 0, 0, 0, 0]
    }

}


//botoes de controle
function inicia() {

    if (timerRodando == true) return
    timerRodando = true
    timerInstance.start({ startValues: tempoRecuperado })

}

function pausa() {
    timerRodando = false
    timerInstance.pause()
}



function reset() {
    timerRodando = false
    timerInstance.reset()
    timerInstance.stop()
    tempo.cronometro = "00:00:00"
    tempoRecuperado = [0, 0, 0, 0, 0]
}


window.onbeforeunload = () => {
    //salva ultimo tempo no cronometro, antes de sair da pagina
    localStorage.setItem("lastTimer", tempo.cronometro)
    localStorage.setItem('tableHoras', JSON.stringify(tableHoras.horas))
};

function somatempos() {

    let lastTime = '00:00:00'
    tableHoras.horas.forEach(item => {
        lastTime = calculoTempo.somartempos(lastTime, item.tempo)
    })
    totalTempo.value = (lastTime == undefined) ? '00:00:00' : lastTime

}

//deletar dia, no contexto da index
ipcRenderer.on('indexdeletadia', (event, dia) => {
    if(dia == 'todos'){
        dataService.deletarTodos()
    }
    else{
        dataService.deletarDia(dia)
        console.log('dia deletado == ' + dia);
    }
    
})




