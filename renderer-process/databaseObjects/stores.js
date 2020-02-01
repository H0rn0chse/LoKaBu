function Stores () {
    let aStores;
    let fnRefreshCallback;
    let bRequestPending = true;

    window.ipcRenderer.sendTo(window.iDatabaseId, "read-stores");
    window.ipcRenderer.on("read-stores", (oEvent, oResult) => {
        aStores = oResult;
        bRequestPending = false;
        if (fnRefreshCallback) {
            fnRefreshCallback();
            fnRefreshCallback = null;
        }
    });
    return {
        get: function () {
            return aStores;
        },
        update: function (aStores) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "write-stores", aStores);
        },
        refresh: function (fnCallback) {
            fnRefreshCallback = fnCallback;
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
