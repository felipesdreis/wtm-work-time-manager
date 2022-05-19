const { app, BrowserWindow, nativeTheme, ipcMain } = require('electron')

/**
 * Criar tela principal
 *
 */
const mainWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        frame: false,
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

ipcMain.on('app-quit', () => { app.quit() })




