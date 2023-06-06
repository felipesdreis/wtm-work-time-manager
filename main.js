const { app, BrowserWindow, nativeTheme, ipcMain, Menu, screen } = require('electron')
const path = require('path')

// Alterar Ambiente
const prod = false

// ativacao devTools
let dev = !prod
console.log("FSDR ~ dev", dev)

nativeTheme.themeSource = 'dark'

let dimension

let mainWin
/**
 * Criar tela principal
 *
 */
const mainWindow = () => {
    mainWin = new BrowserWindow({
        width: 800,
        height: 700,
        autoHideMenuBar: true,
        frame: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: dev
        }
    })

    mainWin.loadFile('./app/pages/index.html')

}

//init app
app.whenReady().then(() => {

    mainWindow()

    let mainScreen = screen.getPrimaryDisplay();
    dimension = mainScreen.size;


})

//quit app
app.on('window-all-closed', () => {
    app.quit()
})

//botar para fechar
ipcMain.on('app-quit', () => {
    app.quit()
})


ipcMain.on('detalhesPage', (event, dados) => {

    /**
     * Pagina de detalhes de dias passados
     *
     */
    const detailWindow = () => {
        const detailWin = new BrowserWindow({
            width: 500,
            height: dimension.height - 15,
            autoHideMenuBar: true,
            frame: true,
            modal: true,
            parent: mainWin,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                devTools: dev
            }
        })

        detailWin.loadFile('./app/pages/details.html', { query: { "data": JSON.stringify(dados) } })
    }

    detailWindow()

})

ipcMain.on('historicoPage', (event) => {

    /**
     * Pagina com os dias passados
     *
     */
    const historyWindow = () => {
        const historyWin = new BrowserWindow({
            width: 801,
            height: 600,
            autoHideMenuBar: true,
            frame: true,
            parent: mainWin,
            modal: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                devTools: dev
            }
        })

        historyWin.loadFile('./app/pages/historico.html')
    }

    historyWindow()

})

ipcMain.on('deleta-dia', (event, dia) => {
    console.log("FSDR ~ ipcMain.on ~ dia", dia)
    mainWin.send('indexdeletadia', dia)
})