const { app, BrowserWindow, nativeTheme, ipcMain } = require('electron')
const path = require('path')

const prod = true
let dev = false
if (prod) {
    dev = false
} else {
    dev = true
}

/**
 * Criar tela principal
 *
 */
const mainWindow = () => {
    const win = new BrowserWindow({
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
    nativeTheme.themeSource = 'dark'

    win.loadFile('./app/pages/index.html')

    win.setThumbarButtons([
        {
            tooltip: 'play',
            icon: path.join(__dirname, '/app/img/play.png'),
            click() { console.log('button1 clicked') }
        }, {
            tooltip: 'pause',
            icon: path.join(__dirname, '/app/img/pause.png'),
            flags: ['enabled', 'dismissonclick'],
            click() { console.log('button2 clicked.') }
        }
    ])
}



//init app
app.whenReady().then(() => {

    mainWindow()

})

//quit app
app.on('window-all-closed', () => {
    app.quit()
})

//botar para fechar
ipcMain.on('app-quit', () => { app.quit() })


ipcMain.on('detalhesPage', (event, dados) => {

    const detailWindow = () => {
        const win = new BrowserWindow({
            width: 500,
            height: 600,
            autoHideMenuBar: true,
            frame: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                devTools: dev
            }
        })
        nativeTheme.themeSource = 'dark'

        win.loadFile('./app/pages/details.html', { query: { "data": JSON.stringify(dados) } })
    }

    detailWindow()

})





