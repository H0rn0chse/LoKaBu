function Stores () {
    let aStores;
    const aRefreshCallbacks = [];
    const oListenerCallbacks = {};
    let bRequestPending = true;

    window.ipcRenderer.sendTo(window.iDatabaseId, "stores-read-list");
    window.ipcRenderer.on("stores-read-list", (oEvent, oResult) => {
        bRequestPending = false;
        aStores = oResult;

        aRefreshCallbacks.forEach(function (fnCallback) {
            fnCallback();
        });
        aRefreshCallbacks.splice(0, aRefreshCallbacks.length);

        Object.keys(oListenerCallbacks).forEach((sKey) => {
            oListenerCallbacks[sKey](aStores);
        });
    });
    return {
        get: function () {
            if (Array.isArray(aStores)) {
                aStores.sort((a, b) => {
                    if (parseInt(a.ID, 10) < parseInt(b.ID, 10)) {
                        return -1;
                    }
                    if (parseInt(a.ID, 10) > parseInt(b.ID, 10)) {
                        return 1;
                    }
                    return 0;
                });
            }
            return aStores;
        },
        update: function (sId, oStore) {
            // eslint-disable-next-line eqeqeq
            const iIndex = aStores.findIndex(oStore => oStore.ID == sId);
            if (iIndex !== -1) {
                oStore.ID = sId;
                aStores[iIndex] = oStore;
            }
            window.ipcRenderer.sendTo(window.iDatabaseId, "stores-write-object", oStore);
        },
        refresh: function (fnCallback) {
            aRefreshCallbacks.push(fnCallback);
            if (!bRequestPending) {
                bRequestPending = true;
                window.ipcRenderer.sendTo(window.iDatabaseId, "stores-read-list");
            }
        },
        add: function (oStore) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "stores-write-object", oStore);
        },
        addListener: function (sName, fnCallback) {
            oListenerCallbacks[sName] = fnCallback;
        },
        removeListener: function (sName) {
            delete oListenerCallbacks[sName];
        }
    };
};

const oInstance = new Stores();
module.exports = oInstance;
