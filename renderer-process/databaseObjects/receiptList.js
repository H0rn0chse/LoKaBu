function ReceiptList () {
    let aReceiptList;
    const aRefreshCallbacks = [];
    let bRequestPending = true;

    window.ipcRenderer.sendTo(window.iDatabaseId, "read-receiptList");
    window.ipcRenderer.on("read-receiptList", (oEvent, oResult) => {
        aReceiptList = oResult;

        aRefreshCallbacks.forEach(function (fnCallback) {
            fnCallback();
        });
        aRefreshCallbacks.splice(0, aRefreshCallbacks.length);
        bRequestPending = false;
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
            window.ipcRenderer.sendTo(window.iDatabaseId, "write-receiptList", aReceiptList);
        },
        refresh: function (fnCallback) {
            aRefreshCallbacks.push(fnCallback);
            if (!bRequestPending) {
                bRequestPending = true;
                window.ipcRenderer.sendTo(window.iDatabaseId, "read-receiptList");
            }
        },
        add: function (oReceipt) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "write-receiptList", oReceipt);
        }
    };
};

const oInstance = new ReceiptList();
module.exports = oInstance;
