function DatabaseInfo () {
    let oDataBaseInfo;
    let fnRefreshCallback;
    let bRequestPending = true;

    window.ipcRenderer.sendTo(window.iDatabaseId, "read-databaseInfo");
    window.ipcRenderer.on("read-databaseInfo", (oEvent, oResult) => {
        oDataBaseInfo = oResult;
        bRequestPending = false;
        if (fnRefreshCallback) {
            fnRefreshCallback();
            fnRefreshCallback = null;
        }
    });
    return {
        get: function () {
            return oDataBaseInfo;
        },
        update: function (oDataBaseInfo) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "write-databaseInfo", oDataBaseInfo);
        },
        refresh: function (fnCallback) {
            fnRefreshCallback = fnCallback;
            if (!bRequestPending) {
                bRequestPending = true;
                window.ipcRenderer.sendTo(window.iDatabaseId, "read-databaseInfo");
            }
        }
    };
};

const oInstance = new DatabaseInfo();
module.exports = oInstance;
