function Accounts () {
    let aAccounts;
    const aRefreshCallbacks = [];
    const oListenerCallbacks = {};
    let bRequestPending = true;

    window.ipcRenderer.sendTo(window.iDatabaseId, "read-accounts");
    window.ipcRenderer.on("read-accounts", (oEvent, oResult) => {
        aAccounts = oResult;

        aRefreshCallbacks.forEach(function (fnCallback) {
            fnCallback();
        });
        aRefreshCallbacks.splice(0, aRefreshCallbacks.length);

        Object.keys(oListenerCallbacks).forEach((sKey) => {
            oListenerCallbacks[sKey](aAccounts);
        });

        bRequestPending = false;
    });
    return {
        get: function () {
            if (Array.isArray(aAccounts)) {
                aAccounts.sort((a, b) => {
                    if (parseInt(a.ID, 10) < parseInt(b.ID, 10)) {
                        return -1;
                    }
                    if (parseInt(a.ID, 10) > parseInt(b.ID, 10)) {
                        return 1;
                    }
                    return 0;
                });
            }
            return aAccounts;
        },
        update: function (aAccounts) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "write-accounts", aAccounts);
        },
        refresh: function (fnCallback) {
            aRefreshCallbacks.push(fnCallback);
            if (!bRequestPending) {
                bRequestPending = true;
                window.ipcRenderer.sendTo(window.iDatabaseId, "read-accounts");
            }
        },
        add: function (oAccount) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "write-accounts", oAccount);
        },
        addListener: function (sName, fnCallback) {
            oListenerCallbacks[sName] = fnCallback;
        },
        removeListener: function (sName) {
            delete oListenerCallbacks[sName];
        }
    };
};

const oInstance = new Accounts();
module.exports = oInstance;
