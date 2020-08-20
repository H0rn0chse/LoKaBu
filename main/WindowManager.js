const { app, BrowserWindow, ipcMain } = require('electron');

class _WindowManager {
    constructor () {
        this.worker = [];

        this.windowsLoaded = 0;
        ipcMain.on("windowLoaded", () => {
            this.windowsLoaded++;
            if (this.windowsLoaded === this._getWindowCount()) {
                this.main.webContents.send("eventBus", this.worker[0].webContents.id);
                this.worker[0].webContents.send("eventBus", this.main.webContents.id);
            }
        });

        ipcMain.on("windowProcessClosed", () => {
            this.windowsLoaded--;
            this.close();
        });
    }

    _getWindowCount () {
        return this.worker.length + 1;
    }

    addMain (sPath) {
        const oMain = this._addWindow(sPath);
        oMain.maximize();
        oMain.show();
        this.main = oMain;
    }

    addWorker (sPath) {
        const oWorker = this._addWindow(sPath);
        if (!app.isPackaged) {
            oWorker.maximize();
            oWorker.show();
        }
        this.worker.push(oWorker);
    }

    _addWindow (sPath) {
        let oWindow = new BrowserWindow({
            show: false,
            webPreferences: {
                nodeIntegration: true
            }
        });
        oWindow.loadFile(sPath);
        oWindow.setMenuBarVisibility(false);
        if (!app.isPackaged) {
            oWindow.webContents.openDevTools();
        }

        oWindow.on("close", this.close.bind(this));
        oWindow.on("closed", () => {
            oWindow = null;
        });
        return oWindow;
    }

    focusMain () {
        if (this.main) {
            this.main.focus();
        }
    }

    mainLoaded () {
        return this.main instanceof BrowserWindow;
    }

    close (oEvent) {
        const bAllWindowsLoaded = this.windowsLoaded === this._getWindowCount();
        const bNoWindowLoaded = this.windowsLoaded <= 0;

        if (!bNoWindowLoaded && oEvent) {
            oEvent.preventDefault();
        }

        if (bAllWindowsLoaded) {
            this.main.webContents.send("shutdownApp");
            this.worker.forEach(window => {
                window.webContents.send("shutdownApp");
            });
        }

        if (bNoWindowLoaded && !oEvent) {
            this.main.close();
            this.worker.forEach(window => {
                window.close();
            });
        }
    }
}

const WindowManager = new _WindowManager();
module.exports = { WindowManager };
