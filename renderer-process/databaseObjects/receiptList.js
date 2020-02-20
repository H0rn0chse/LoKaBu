function ReceiptList () {
    let aReceiptList;
    const aRefreshCallbacks = [];
    let bRequestPending = true;

    window.ipcRenderer.sendTo(window.iDatabaseId, "receiptList-read-list");
    window.ipcRenderer.on("receiptList-read-list", (oEvent, oResult) => {
        bRequestPending = false;
        aReceiptList = oResult;

        aRefreshCallbacks.forEach(function (fnCallback) {
            fnCallback();
        });
        aRefreshCallbacks.splice(0, aRefreshCallbacks.length);
    });
    return {
        get: function () {
            if (Array.isArray(aReceiptList)) {
                aReceiptList.sort((a, b) => {
                    return a.ID.toString().localeCompare(b.ID);
                });
            }
            return aReceiptList;
        },
        update: function (aReceiptList) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "receiptList-write-list", aReceiptList);
        },
        refresh: function (fnCallback) {
            aRefreshCallbacks.push(fnCallback);
            if (!bRequestPending) {
                bRequestPending = true;
                window.ipcRenderer.sendTo(window.iDatabaseId, "receiptList-read-list");
            }
        },
        add: function (oReceipt) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "receiptList-write-object", oReceipt);
        }
    };
};

const oInstance = new ReceiptList();
module.exports = oInstance;
