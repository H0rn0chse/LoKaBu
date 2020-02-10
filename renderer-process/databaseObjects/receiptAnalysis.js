
function ReceiptAnalysis () {
    let oReceiptAnalysis;
    const aRefreshCallbacks = [];
    let bRequestPending = true;

    window.ipcRenderer.sendTo(window.iDatabaseId, "read-receiptAnalysis");
    window.ipcRenderer.on("read-receiptAnalysis", (oEvent, oResult) => {
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
                window.ipcRenderer.sendTo(window.iDatabaseId, "read-receiptAnalysis");
            }
        }
    };
};

const oInstance = new ReceiptAnalysis();
module.exports = oInstance;
