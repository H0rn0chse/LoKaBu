function DatabaseInfo () {
    let oDataBaseInfo;
    const aRefreshCallbacks = [];
    let bRequestPending = true;

    window.ipcRenderer.sendTo(window.iDatabaseId, "read-databaseInfo");
    window.ipcRenderer.on("read-databaseInfo", (oEvent, oResult) => {
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
            window.ipcRenderer.sendTo(window.iDatabaseId, "write-databaseInfo", oDataBaseInfo);
        },
        refresh: function (fnCallback) {
            aRefreshCallbacks.push(fnCallback);
            if (!bRequestPending) {
                bRequestPending = true;
                window.ipcRenderer.sendTo(window.iDatabaseId, "read-databaseInfo");
            }
        }
    };
};

const oInstance = new DatabaseInfo();
module.exports = oInstance;
