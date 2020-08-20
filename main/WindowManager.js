const { app, BrowserWindow, ipcMain } = require('electron');

class _WindowManager {
    constructor () {
        this.worker = [];
        this.dialogs = {};

        this.ipcMap = {};

        this.windowsLoaded = 0;
        ipcMain.on("windowLoaded", (oEvent, sWindow) => {
            this.windowsLoaded++;
            this.ipcMap[sWindow] = oEvent.sender.webContents.id;

            this.getAllWindows().forEach(oWindow => {
                oWindow.webContents.send("eventBus", this.ipcMap);
            });
        });

        ipcMain.on("openDialog", (oEvent, sPath, ...args) => {
            if (this.dialogs[sPath]) {
            }
        });

        ipcMain.on("windowProcessClosed", () => {
            this.windowsLoaded--;
            this.close();
        });
    }

    _getWindowCount () {
        return this.getAllWindows().length;
    }

    getAllWindows () {
        return [this.main, ...this.worker, ...Object.values(this.dialogs)];
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
            this.getAllWindows().forEach(oWindow => {
                oWindow.webContents.send("shutdownApp");
            });
        }

        if (bNoWindowLoaded && !oEvent) {
            this.getAllWindows().forEach(oWindow => {
                if (!oWindow.isDestroyed()) {
                    oWindow.close();
                }
            });
        }
    }
}

const WindowManager = new _WindowManager();
module.exports = { WindowManager };
