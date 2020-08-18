const { app } = require('electron');

function enforceSingleInstance () {
    const bSingleInstanceLock = app.requestSingleInstanceLock();

    if (!bSingleInstanceLock) {
        app.quit();
        return true;
    }
    return false;
}

module.exports = {
    enforceSingleInstance
};
