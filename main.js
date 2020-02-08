const { app, BrowserWindow, nativeTheme, ipcMain } = require('electron');

let oMainWindow;
let oDatabaseWindow;
let iWindowsLoading = 2;

function createWindow () {
    require("./main-process/checkDatabase");
    oMainWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    oMainWindow.maximize();
    oMainWindow.show();
    oMainWindow.loadFile('index.html');
    oMainWindow.webContents.openDevTools();

    oDatabaseWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    oDatabaseWindow.maximize();
    oDatabaseWindow.show();
    oDatabaseWindow.loadFile('database.html');
    oDatabaseWindow.webContents.openDevTools();

    oMainWindow.on('closed', () => {
        oMainWindow = null;
        oDatabaseWindow.close();
    });

    oDatabaseWindow.on('closed', () => {
        oDatabaseWindow = null;
    });

    ipcMain.on("windowLoaded", (oEvent, sMessage) => {
        if (iWindowsLoading > 1) {
            iWindowsLoading--;
        } else {
            oMainWindow.setTitle(app.name);
            oDatabaseWindow.setTitle(app.name + " - Database worker");
            oMainWindow.webContents.send("log", oMainWindow.webContents.id + "/" + oDatabaseWindow.webContents.id);
            oMainWindow.webContents.send("databaseChannel", oDatabaseWindow.webContents.id);
            oDatabaseWindow.webContents.send("rendererChannel", oMainWindow.webContents.id);
        }
    });

    ipcMain.on("log", (oEvent, sMessage) => {
        oMainWindow.webContents.send("log", sMessage);
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    };
});

app.on('activate', () => {
    if (oMainWindow === null) {
        createWindow();
    }
});

nativeTheme.themeSource = 'light';
