const querystring = require('querystring');
let query = querystring.parse(global.location.search);
let data = JSON.parse(query['?data'])


window.onload = () => {
    console.log(data);
    tempos.table = data.table
    dia.value = data.data
    total.value = data.total
}


var tempos = new Vue({
    el: '#tempos',
    data: {
        table: []
    }
})

var dia = new Vue({
    el: '#dia',
    data: {
        value: []
    }
})

var total = new Vue({
    el: '#total',
    data: {
        value: []
    }
})

function imprimir() {
    let lista = tempos.table  
    let stringCopy = "" 
    lista.forEach(atividade => {
        stringCopy = stringCopy + atividade.atividade +  ";\n"
    });
    navigator.clipboard.writeText(stringCopy)
    setTimeout(() => {
        alert("Copiado para a área de transferência")
    }, 500);
}
