function Accounts () {
    let aAccounts;
    const aRefreshCallbacks = [];
    const oListenerCallbacks = {};
    let bRequestPending = true;

    window.ipcRenderer.sendTo(window.iDatabaseId, "accounts-read-list");
    window.ipcRenderer.on("accounts-read-list", (oEvent, oResult) => {
        bRequestPending = false;
        aAccounts = oResult;

        aRefreshCallbacks.forEach(function (fnCallback) {
            fnCallback();
        });
        aRefreshCallbacks.splice(0, aRefreshCallbacks.length);

        Object.keys(oListenerCallbacks).forEach((sKey) => {
            oListenerCallbacks[sKey](aAccounts);
        });
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
        update: function (sId, oAccount) {
            // eslint-disable-next-line eqeqeq
            const iIndex = aAccounts.findIndex(oAccount => oAccount.ID == sId);
            if (iIndex !== -1) {
                oAccount.ID = sId;
                aAccounts[iIndex] = oAccount;
            }
            window.ipcRenderer.sendTo(window.iDatabaseId, "accounts-write-object", oAccount);
        },
        refresh: function (fnCallback) {
            aRefreshCallbacks.push(fnCallback);
            if (!bRequestPending) {
                bRequestPending = true;
                window.ipcRenderer.sendTo(window.iDatabaseId, "accounts-read-list");
            }
        },
        add: function (oAccount) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "accounts-write-object", oAccount);
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
