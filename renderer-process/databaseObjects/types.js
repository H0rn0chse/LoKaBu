function Types () {
    let aTypes;
    let fnRefreshCallback;
    let bRequestPending = false;

    window.ipcRenderer.sendTo(window.iDatabaseId, "read-types");
    window.ipcRenderer.on("read-types", (oEvent, oResult) => {
        aTypes = oResult;
        bRequestPending = false;
        if (fnRefreshCallback) {
            fnRefreshCallback();
            fnRefreshCallback = null;
        }
    });
    return {
        get: function () {
            return aTypes;
        },
        update: function (aTypes) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "write-types", aTypes);
        },
        refresh: function (fnCallback) {
            fnRefreshCallback = fnCallback;
            if (!bRequestPending) {
                bRequestPending = true;
                window.ipcRenderer.sendTo(window.iDatabaseId, "read-types");
            }
        },
        add: function (oType) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "write-types", oType);
        }
    };
};

const oInstance = new Types();
module.exports = oInstance;
