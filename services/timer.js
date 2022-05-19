const { ipcRenderer } = require('electron');
const moment = require('moment');
let segundos = 0
let idTimer

module.exports = {
    iniciar(elemento) {
        let tempo = moment.duration(elemento.cronometro)
        segundos = tempo.asSeconds()
        clearInterval(idTimer)
        idTimer = setInterval(() => {
            segundos++
            elemento.cronometro = this.formataSegundos(segundos)
        }, 1000);
    },
    parar(curso) {
        clearInterval(idTimer)
    },
    formataSegundos(segs) {
        //00:00:00
        return moment().startOf('day').seconds(segs).format("HH:mm:ss")
    }
}