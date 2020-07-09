function Persons () {
    let aPersons;
    const aRefreshCallbacks = [];
    const oListenerCallbacks = {};
    let bRequestPending = true;

    window.ipcRenderer.sendTo(window.iDatabaseId, "persons-read-list");
    window.ipcRenderer.on("persons-read-list", (oEvent, oResult) => {
        bRequestPending = false;
        aPersons = oResult;

        aRefreshCallbacks.forEach(function (fnCallback) {
            fnCallback();
        });
        aRefreshCallbacks.splice(0, aRefreshCallbacks.length);

        Object.keys(oListenerCallbacks).forEach((sKey) => {
            oListenerCallbacks[sKey](aPersons);
        });
    });
    return {
        get: function () {
            if (Array.isArray(aPersons)) {
                aPersons.sort((a, b) => {
                    if (parseInt(a.ID, 10) < parseInt(b.ID, 10)) {
                        return -1;
                    }
                    if (parseInt(a.ID, 10) > parseInt(b.ID, 10)) {
                        return 1;
                    }
                    return 0;
                });
            }
            return aPersons;
        },
        update: function (sId, oPerson) {
            // eslint-disable-next-line eqeqeq
            const iIndex = aPersons.findIndex(oPerson => oPerson.ID == sId);
            if (iIndex !== -1) {
                oPerson.ID = sId;
                aPersons[iIndex] = oPerson;
            }
            window.ipcRenderer.sendTo(window.iDatabaseId, "persons-write-object", oPerson);
        },
        refresh: function (fnCallback) {
            aRefreshCallbacks.push(fnCallback);
            if (!bRequestPending) {
                bRequestPending = true;
                window.ipcRenderer.sendTo(window.iDatabaseId, "persons-read-list");
            }
        },
        add: function (oPerson) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "persons-write-object", oPerson);
        },
        addListener: function (sName, fnCallback) {
            oListenerCallbacks[sName] = fnCallback;
        },
        removeListener: function (sName) {
            delete oListenerCallbacks[sName];
        }
    };
};

const oInstance = new Persons();
module.exports = oInstance;
