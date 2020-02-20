
function ReceiptAnalysis () {
    let oReceiptAnalysis;
    const aRefreshCallbacks = [];
    let bRequestPending = true;

    window.ipcRenderer.sendTo(window.iDatabaseId, "receiptAnalysis-read-object");
    window.ipcRenderer.on("receiptAnalysis-read-object", (oEvent, oResult) => {
        bRequestPending = false;
        oReceiptAnalysis = oResult;

        aRefreshCallbacks.forEach(function (fnCallback) {
            fnCallback();
        });
        aRefreshCallbacks.splice(0, aRefreshCallbacks.length);
    });
    return {
        get: function () {
            return oReceiptAnalysis;
        },
        refresh: function (fnCallback) {
            aRefreshCallbacks.push(fnCallback);
            if (!bRequestPending) {
                bRequestPending = true;
                window.ipcRenderer.sendTo(window.iDatabaseId, "receiptAnalysis-read-object");
            }
        }
    };
};

const oInstance = new ReceiptAnalysis();
module.exports = oInstance;
