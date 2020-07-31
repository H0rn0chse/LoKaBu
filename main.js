const { app, BrowserWindow, nativeTheme, ipcMain } = require('electron');

let oMainWindow;
let oDatabaseWindow;
let bAppIsClosing = false;

function shutdownApp () {
    oMainWindow.webContents.send("shutdownApp");
    oDatabaseWindow.webContents.send("shutdownApp");

    let iCount = 2;
    ipcMain.on("windowProcessClosed", () => {
        iCount--;
        if (iCount === 0) {
            bAppIsClosing = true;
            oMainWindow.close();
            oDatabaseWindow.close();
        }
    });
}

function createWindow () {
    const bSingleInstanceLock = app.requestSingleInstanceLock();

    if (!bSingleInstanceLock) {
        app.quit();
        return;
    }

    require("./main/checkDatabase");
    oMainWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    oMainWindow.maximize();
    oMainWindow.show();
    oMainWindow.loadFile('index.html');
    // oMainWindow.setMenuBarVisibility(false);
    if (!app.isPackaged) {
        oMainWindow.webContents.openDevTools();
    }

    oDatabaseWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    if (!app.isPackaged) {
        oDatabaseWindow.maximize();
        oDatabaseWindow.show();
    }
    oDatabaseWindow.loadFile('database.html');
    oDatabaseWindow.webContents.openDevTools();

    oMainWindow.on('close', (oEvent) => {
        if (!bAppIsClosing) {
            oEvent.preventDefault();
            shutdownApp();
        }
    });

    oMainWindow.on('closed', (oEvent) => {
        oMainWindow = null;
    });

    oDatabaseWindow.on('close', (oEvent) => {
        if (!bAppIsClosing) {
            oEvent.preventDefault();
            shutdownApp();
        }
    });

    oDatabaseWindow.on('closed', (oEvent) => {
        oDatabaseWindow = null;
    });

    let iCount = 2;
    ipcMain.on("windowLoaded", (oEvent, sMessage) => {
        iCount--;
        if (iCount === 0) {
            oMainWindow.setTitle(app.name);
            oDatabaseWindow.setTitle(app.name + " - Database worker");
            oMainWindow.webContents.send("log", oMainWindow.webContents.id + "/" + oDatabaseWindow.webContents.id);
            oMainWindow.webContents.send("workerChannel", oDatabaseWindow.webContents.id);
            oDatabaseWindow.webContents.send("workerChannel", oMainWindow.webContents.id);
        }
    });

    ipcMain.on("log", (oEvent, sMessage) => {
        oMainWindow.webContents.send("log", sMessage);
    });
}

app.on('ready', createWindow);

app.on('second-instance', (oEvent, aArgv, sWorkingDir) => {
    if (oMainWindow) {
        oMainWindow.focus();
    }
});

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
