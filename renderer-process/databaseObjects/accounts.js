function Accounts () {
    let aAccounts;
    let fnRefreshCallback;

    window.ipcRenderer.sendTo(window.iDatabaseId, "read-accounts");
    window.ipcRenderer.on("read-accounts", (oEvent, oResult) => {
        aAccounts = oResult;
        if (fnRefreshCallback) {
            fnRefreshCallback();
            fnRefreshCallback = null;
        }
    });
    return {
        get: function () {
            return aAccounts;
        },
        update: function (aAccounts) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "write-accounts", aAccounts);
        },
        refresh: function (fnCallback) {
            fnRefreshCallback = fnCallback;
            window.ipcRenderer.sendTo(window.iDatabaseId, "read-accounts");
        },
        add: function (oAccount) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "write-accounts", oAccount);
        }
    };
};

const oInstance = new Accounts();
module.exports = oInstance;
