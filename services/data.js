const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig')
var db = new JsonDB(new Config("./data/databasefile", true, false, '/'));
module.exports = {
    escreveArquivo(dia, table, totalHoras) {
        console.log("FSDR ~ escreveArquivo ~ table", table)
        let formatDiaKey = dia.replace(/\//g, '')
        db.push(`/${formatDiaKey}`, {
            data: dia,
            table:table,
            total: totalHoras
        })

        return 'ok'
    },
    pegaDadosDia(dia) {
        let formatDiaKey = dia.replace(/\//g, '')
        let dados = []
        try {
            dados = db.getData(`/${formatDiaKey}`)
        } catch (error) {
            console.log(error);
        }
        db.reload();
        return dados
    },
    pegaTodosDados() {

        let dados = db.getData('/')
        return dados

    },
    deletarDia(dia){
        let formatDiaKey = dia.replace(/\//g, '')
        db.delete(`/${formatDiaKey}`);
        db.save();
        db.reload();
        return 'ok'
    },
    deletarTodos(){
        db.delete('/');
        db.save();
        db.reload();
        return 'ok'
    }
}