
function ReceiptDetail () {
    let oReceiptDetail;
    let fnRefreshCallback;

    window.ipcRenderer.sendTo(window.iDatabaseId, "read-receiptDetail");
    window.ipcRenderer.on("read-receiptDetail", (oEvent, oResult) => {
        oReceiptDetail = oResult;
        if (fnRefreshCallback) {
            fnRefreshCallback();
            fnRefreshCallback = null;
        }
    });
    return {
        get: function () {
            return oReceiptDetail;
        },
        refresh: function (fnCallback) {
            fnRefreshCallback = fnCallback;
            window.ipcRenderer.sendTo(window.iDatabaseId, "read-receiptDetail");
        }
    };
};

const oInstance = new ReceiptDetail();
module.exports = oInstance;
