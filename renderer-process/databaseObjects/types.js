function Types () {
    let aTypes;
    const aRefreshCallbacks = [];
    const oListenerCallbacks = {};
    let bRequestPending = false;

    window.ipcRenderer.sendTo(window.iDatabaseId, "read-types");
    window.ipcRenderer.on("read-types", (oEvent, oResult) => {
        aTypes = oResult;

        aRefreshCallbacks.forEach(function (fnCallback) {
            fnCallback();
        });
        aRefreshCallbacks.splice(0, aRefreshCallbacks.length);

        Object.keys(oListenerCallbacks).forEach((sKey) => {
            oListenerCallbacks[sKey](aTypes);
        });

        bRequestPending = false;
    });
    return {
        get: function () {
            if (Array.isArray(aTypes)) {
                aTypes.sort((a, b) => {
                    if (parseInt(a.ID, 10) < parseInt(b.ID, 10)) {
                        return -1;
                    }
                    if (parseInt(a.ID, 10) > parseInt(b.ID, 10)) {
                        return 1;
                    }
                    return 0;
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
        },
        addListener: function (sName, fnCallback) {
            oListenerCallbacks[sName] = fnCallback;
        },
        removeListener: function (sName) {
            delete oListenerCallbacks[sName];
        }
    };
};

const oInstance = new Types();
module.exports = oInstance;
