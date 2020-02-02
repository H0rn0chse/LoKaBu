function Types () {
    let aTypes;
    const aRefreshCallbacks = [];
    let bRequestPending = false;

    window.ipcRenderer.sendTo(window.iDatabaseId, "read-types");
    window.ipcRenderer.on("read-types", (oEvent, oResult) => {
        aTypes = oResult;

        aRefreshCallbacks.forEach(function (fnCallback) {
            fnCallback();
        });
        aRefreshCallbacks.splice(0, aRefreshCallbacks.length);
        bRequestPending = false;
    });
    return {
        get: function () {
            if (Array.isArray(aTypes)) {
                aTypes.sort((a, b) => {
                    return a.ID.toString().localeCompare(b.ID);
                });
            }
            return aTypes;
        },
        update: function (aTypes) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "write-types", aTypes);
        },
        refresh: function (fnCallback) {
            aRefreshCallbacks.push(fnCallback);
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
