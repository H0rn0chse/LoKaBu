
function ReceiptDetail () {
    let oReceiptDetail;
    const aRefreshCallbacks = [];
    let bRequestPending = true;

        bRequestPending = false;
        oReceiptDetail = oResult;

        aRefreshCallbacks.forEach(function (fnCallback) {
            fnCallback();
    window.ipcRenderer.sendTo(window.iDatabaseId, "receiptDetail-read-list", 1);
    window.ipcRenderer.on("receiptDetail-read-list", (oEvent, sId, oResult) => {
        });
        aRefreshCallbacks.splice(0, aRefreshCallbacks.length);
    });
    return {
        get: function () {
            return oReceiptDetail;
        },
        refresh: function (fnCallback) {
            aRefreshCallbacks.push(fnCallback);
            if (!bRequestPending) {
                bRequestPending = true;
                window.ipcRenderer.sendTo(window.iDatabaseId, "receiptDetail-read-list", 1);
            }
        }
    };
};

const oInstance = new ReceiptDetail();
module.exports = oInstance;
