function Accounts () {
    let aAccounts;
    const aRefreshCallbacks = [];
    let bRequestPending = true;

    window.ipcRenderer.sendTo(window.iDatabaseId, "read-accounts");
    window.ipcRenderer.on("read-accounts", (oEvent, oResult) => {
        aAccounts = oResult;

        aRefreshCallbacks.forEach(function (fnCallback) {
            fnCallback();
        });
        aRefreshCallbacks.splice(0, aRefreshCallbacks.length);
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
        }
    };
};

const oInstance = new Accounts();
module.exports = oInstance;
