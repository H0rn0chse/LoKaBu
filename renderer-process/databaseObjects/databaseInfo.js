function DatabaseInfo () {
    let oDataBaseInfo;
    const aRefreshCallbacks = [];
    let bRequestPending = true;

    window.ipcRenderer.sendTo(window.iDatabaseId, "databaseInfo-read-object");
    window.ipcRenderer.on("databaseInfo-read-object", (oEvent, oResult) => {
        bRequestPending = false;
        oDataBaseInfo = oResult;

        aRefreshCallbacks.forEach(function (fnCallback) {
            fnCallback();
        });
        aRefreshCallbacks.splice(0, aRefreshCallbacks.length);
    });
    return {
        get: function () {
            return oDataBaseInfo;
        },
        update: function (oDataBaseInfo) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "databaseInfo-write-object", oDataBaseInfo);
        },
        refresh: function (fnCallback) {
            aRefreshCallbacks.push(fnCallback);
            if (!bRequestPending) {
                bRequestPending = true;
                window.ipcRenderer.sendTo(window.iDatabaseId, "databaseInfo-read-object");
            }
        }
    };
};

const oInstance = new DatabaseInfo();
module.exports = oInstance;
