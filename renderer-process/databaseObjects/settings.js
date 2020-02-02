function Settings () {
    let oSettings;
    const aRefreshCallbacks = [];
    let bRequestPending = true;

    window.ipcRenderer.sendTo(window.iDatabaseId, "read-settings");
    window.ipcRenderer.on("read-settings", (oEvent, oResult) => {
        oSettings = oResult;

        aRefreshCallbacks.forEach(function (fnCallback) {
            fnCallback();
        });
        aRefreshCallbacks.splice(0, aRefreshCallbacks.length);
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
        }
    };
};

const oInstance = new Settings();
module.exports = oInstance;
