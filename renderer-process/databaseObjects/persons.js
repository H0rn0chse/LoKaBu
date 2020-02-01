function Persons () {
    let aPersons;
    let fnRefreshCallback;
    let bRequestPending = true;

    window.ipcRenderer.sendTo(window.iDatabaseId, "read-persons");
    window.ipcRenderer.on("read-persons", (oEvent, oResult) => {
        aPersons = oResult;
        bRequestPending = false;
        if (fnRefreshCallback) {
            fnRefreshCallback();
            fnRefreshCallback = null;
        }
    });
    return {
        get: function () {
            return aPersons;
        },
        update: function (aPersons) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "write-persons", aPersons);
        },
        refresh: function (fnCallback) {
            fnRefreshCallback = fnCallback;
            if (!bRequestPending) {
                bRequestPending = true;
                window.ipcRenderer.sendTo(window.iDatabaseId, "read-persons");
            }
        },
        add: function (oPerson) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "write-persons", oPerson);
        }
    };
};

const oInstance = new Persons();
module.exports = oInstance;
