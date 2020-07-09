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
        },
        openDatabase: function (sPath) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "databaseInfo-open-database", sPath);
        },
        createDatabase: function (sPath) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "databaseInfo-create-database", sPath);
        }
    };
};

const oInstance = new DatabaseInfo();
module.exports = oInstance;
