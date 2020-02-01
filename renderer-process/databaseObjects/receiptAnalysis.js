
function ReceiptAnalysis () {
    let oReceiptAnalysis;
    let fnRefreshCallback;

    window.ipcRenderer.sendTo(window.iDatabaseId, "read-receiptAnalysis");
    window.ipcRenderer.on("read-receiptAnalysis", (oEvent, oResult) => {
        oReceiptAnalysis = oResult;
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
            window.ipcRenderer.sendTo(window.iDatabaseId, "read-receiptAnalysis");
        }
    };
};

const oInstance = new ReceiptAnalysis();
module.exports = oInstance;
