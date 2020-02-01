
function ReceiptAnalysis () {
    let oReceiptAnalysis;
    let fnRefreshCallback;
    let bRequestPending = true;

    window.ipcRenderer.sendTo(window.iDatabaseId, "read-receiptAnalysis");
    window.ipcRenderer.on("read-receiptAnalysis", (oEvent, oResult) => {
        oReceiptAnalysis = oResult;
        bRequestPending = false;
        if (fnRefreshCallback) {
            fnRefreshCallback();
            fnRefreshCallback = null;
        }
    });
    return {
        get: function () {
            return oReceiptAnalysis;
        },
        refresh: function (fnCallback) {
            fnRefreshCallback = fnCallback;
            if (!bRequestPending) {
                bRequestPending = true;
                window.ipcRenderer.sendTo(window.iDatabaseId, "read-receiptAnalysis");
            }
        }
    };
};

const oInstance = new ReceiptAnalysis();
module.exports = oInstance;
