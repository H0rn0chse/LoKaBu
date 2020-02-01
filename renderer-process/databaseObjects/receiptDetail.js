
function ReceiptDetail () {
    let oReceiptDetail;
    let fnRefreshCallback;
    let bRequestPending = true;

    window.ipcRenderer.sendTo(window.iDatabaseId, "read-receiptDetail");
    window.ipcRenderer.on("read-receiptDetail", (oEvent, oResult) => {
        oReceiptDetail = oResult;
        bRequestPending = false;
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
            if (!bRequestPending) {
                bRequestPending = true;
                window.ipcRenderer.sendTo(window.iDatabaseId, "read-receiptDetail");
            }
        }
    };
};

const oInstance = new ReceiptDetail();
module.exports = oInstance;
