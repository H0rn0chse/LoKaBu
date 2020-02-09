function Settings () {
    let oSettings;
    const aRefreshCallbacks = [];
    const oListenerCallbacks = {};
    let bRequestPending = true;

    window.ipcRenderer.sendTo(window.iDatabaseId, "read-settings");
    window.ipcRenderer.on("read-settings", (oEvent, oResult) => {
        oSettings = oResult;

        aRefreshCallbacks.forEach(function (fnCallback) {
            fnCallback();
        });
        aRefreshCallbacks.splice(0, aRefreshCallbacks.length);

        Object.keys(oListenerCallbacks).forEach((sKey) => {
            oListenerCallbacks[sKey](oSettings);
        });

        bRequestPending = false;
    });
    return {
        get: function () {
            return oSettings;
        },
        update: function (oSettings) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "write-settings", oSettings);
        },
        refresh: function (fnCallback) {
            aRefreshCallbacks.push(fnCallback);
            if (!bRequestPending) {
                bRequestPending = true;
                window.ipcRenderer.sendTo(window.iDatabaseId, "read-settings");
            }
        },
        getProperty: function (sPropertyName) {
            return oSettings[sPropertyName];
        },
        setProperty: function (sPropertyName, oValue) {
            oSettings[sPropertyName] = oValue;
            window.ipcRenderer.sendTo(window.iDatabaseId, "write-settings", oSettings);
        },
        addListener: function (sName, fnCallback) {
            oListenerCallbacks[sName] = fnCallback;
        },
        removeListener: function (sName) {
            delete oListenerCallbacks[sName];
        }
    };
};

const oInstance = new Settings();
module.exports = oInstance;
