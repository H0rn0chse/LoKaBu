function Persons () {
    let aPersons;
    const aRefreshCallbacks = [];
    let bRequestPending = true;

    window.ipcRenderer.sendTo(window.iDatabaseId, "read-persons");
    window.ipcRenderer.on("read-persons", (oEvent, oResult) => {
        aPersons = oResult;

        aRefreshCallbacks.forEach(function (fnCallback) {
            fnCallback();
        });
        aRefreshCallbacks.splice(0, aRefreshCallbacks.length);
        bRequestPending = false;
    });
    return {
        get: function () {
            return aPersons;
        },
        update: function (aPersons) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "write-persons", aPersons);
        },
        refresh: function (fnCallback) {
            aRefreshCallbacks.push(fnCallback);
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
