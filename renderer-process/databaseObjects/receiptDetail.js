
function ReceiptDetail () {
    let oReceiptDetail;
    const aRefreshCallbacks = [];
    let bRequestPending = true;

    window.ipcRenderer.sendTo(window.iDatabaseId, "read-receiptDetail");
    window.ipcRenderer.on("read-receiptDetail", (oEvent, oResult) => {
        oReceiptDetail = oResult;

        aRefreshCallbacks.forEach(function (fnCallback) {
            fnCallback();
        });
        aRefreshCallbacks.splice(0, aRefreshCallbacks.length);
        bRequestPending = false;
    });
    return {
        get: function () {
            return oReceiptDetail;
        },
        refresh: function (fnCallback) {
            aRefreshCallbacks.push(fnCallback);
            if (!bRequestPending) {
                bRequestPending = true;
                window.ipcRenderer.sendTo(window.iDatabaseId, "read-receiptDetail");
            }
        }
    };
};

const oInstance = new ReceiptDetail();
module.exports = oInstance;
