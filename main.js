// eslint-disable-next-line no-unused-vars
const { AppVersion } = require("./main/AppVersion.js");
const { app, nativeTheme } = require('electron');
const { enforceSingleInstance } = require("./main/Utils.js");
const { WindowManager } = require("./main/WindowManager.js");

function init () {
    if (enforceSingleInstance()) {
        return;
    }

    WindowManager.addMain('index.html');
    WindowManager.addWorker('./worker/database.html');
}

app.on('ready', init.bind(this));

app.on('second-instance', () => {
    WindowManager.focusMain();
});

app.on('activate', () => {
    if (WindowManager.mainLoaded()) {
        init();
    }
});

app.on('before-quit', (oEvent) => {
    WindowManager.close(oEvent);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    };
});

nativeTheme.themeSource = 'light';
