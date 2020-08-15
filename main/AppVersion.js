const { app, ipcMain } = require('electron');

class _AppVersion {
    constructor () {
        ipcMain.on("appVersion", this.getVersion.bind(this));
    }

    getVersion (oEvent) {
        let sAppVersion;
        if (process.env.NODE_ENV === 'development') {
            sAppVersion = require('../package.json').version;
        } else {
            sAppVersion = app.getVersion();
        }
        oEvent.reply("appVersion", sAppVersion);
    }
}

const AppVersion = new _AppVersion();
module.exports = AppVersion;
