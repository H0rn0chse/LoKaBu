function Types () {
    let aTypes;
    const aRefreshCallbacks = [];
    const oListenerCallbacks = {};
    let bRequestPending = false;

    window.ipcRenderer.sendTo(window.iDatabaseId, "types-read-list");
    window.ipcRenderer.on("types-read-list", (oEvent, oResult) => {
        bRequestPending = false;
        aTypes = oResult;

        aRefreshCallbacks.forEach(function (fnCallback) {
            fnCallback();
        });
        aRefreshCallbacks.splice(0, aRefreshCallbacks.length);

        Object.keys(oListenerCallbacks).forEach((sKey) => {
            oListenerCallbacks[sKey](aTypes);
        });
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
        update: function (sId, oType) {
            // eslint-disable-next-line eqeqeq
            const iIndex = aTypes.findIndex(oType => oType.ID == sId);
            if (iIndex !== -1) {
                oType.ID = sId;
                aTypes[iIndex] = oType;
            }
            window.ipcRenderer.sendTo(window.iDatabaseId, "types-write-object", oType);
        },
        refresh: function (fnCallback) {
            aRefreshCallbacks.push(fnCallback);
            if (!bRequestPending) {
                bRequestPending = true;
                window.ipcRenderer.sendTo(window.iDatabaseId, "types-read-list");
            }
        },
        add: function (oType) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "types-write-object", oType);
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
