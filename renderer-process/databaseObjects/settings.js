function Settings () {
    let oSettings;
    let fnRefreshCallback;
    let bRequestPending = true;

    window.ipcRenderer.sendTo(window.iDatabaseId, "read-settings");
    window.ipcRenderer.on("read-settings", (oEvent, oResult) => {
        oSettings = oResult;
        bRequestPending = false;
        if (fnRefreshCallback) {
            fnRefreshCallback();
            fnRefreshCallback = null;
        }
    });
    return {
        get: function () {
            return oSettings;
        },
        update: function (oSettings) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "write-settings", oSettings);
        },
        refresh: function (fnCallback) {
            fnRefreshCallback = fnCallback;
            if (!bRequestPending) {
                bRequestPending = true;
                window.ipcRenderer.sendTo(window.iDatabaseId, "read-settings");
            }
        }
    };
};

const oInstance = new Settings();
module.exports = oInstance;
