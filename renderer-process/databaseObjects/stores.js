function Stores () {
    let aStores;
    const aRefreshCallbacks = [];
    let bRequestPending = true;

    window.ipcRenderer.sendTo(window.iDatabaseId, "read-stores");
    window.ipcRenderer.on("read-stores", (oEvent, oResult) => {
        aStores = oResult;

        aRefreshCallbacks.forEach(function (fnCallback) {
            fnCallback();
        });
        aRefreshCallbacks.splice(0, aRefreshCallbacks.length);
        bRequestPending = false;
    });
    return {
        get: function () {
            if (Array.isArray(aStores)) {
                aStores.sort((a, b) => {
                    return a.ID.toString().localeCompare(b.ID);
                });
            }
            return aStores;
        },
        update: function (aStores) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "write-stores", aStores);
        },
        refresh: function (fnCallback) {
            aRefreshCallbacks.push(fnCallback);
            if (!bRequestPending) {
                bRequestPending = true;
                window.ipcRenderer.sendTo(window.iDatabaseId, "read-stores");
            }
        },
        add: function (oStore) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "write-stores", oStore);
        }
    };
};

const oInstance = new Stores();
module.exports = oInstance;
