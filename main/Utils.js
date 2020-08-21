const { app } = require('electron');

function enforceSingleInstance () {
    const bSingleInstanceLock = app.requestSingleInstanceLock();

    if (!bSingleInstanceLock) {
        app.quit();
        return true;
    }
    return false;
}

function findKeyByValue (oObject, vValue) {
    let sReturnKey;
    Object.keys(oObject).forEach((sKey) => {
        if (oObject[sKey] === vValue) {
            sReturnKey = sKey;
        }
    });

    return sReturnKey;
}

module.exports = {
    enforceSingleInstance,
    findKeyByValue
};
