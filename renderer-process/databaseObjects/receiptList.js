function ReceiptList () {
    let aReceiptList;
    let fnRefreshCallback;
    let bRequestPending = true;

    window.ipcRenderer.sendTo(window.iDatabaseId, "read-receiptList");
    window.ipcRenderer.on("read-receiptList", (oEvent, oResult) => {
        aReceiptList = oResult;
        bRequestPending = false;
        if (fnRefreshCallback) {
            fnRefreshCallback();
            fnRefreshCallback = null;
        }
    });
    return {
        get: function () {
            return aReceiptList;
        },
        update: function (aReceiptList) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "write-receiptList", aReceiptList);
        },
        refresh: function (fnCallback) {
            fnRefreshCallback = fnCallback;
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
