const { app, BrowserWindow, nativeTheme, ipcMain } = require('electron')


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
        }
    })
    nativeTheme.themeSource = 'dark'

    win.loadFile('./app/pages/index.html')
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
            height: 400,
            autoHideMenuBar: true,
            frame: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            }
        })
        nativeTheme.themeSource = 'dark'
    
        win.loadFile('./app/pages/details.html', {query: {"data": JSON.stringify(dados)}})
    }

    detailWindow()

})





