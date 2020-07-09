const Deferred = require("../../assets/deferred");

function ReceiptDetail () {
    const iMaxItems = 5;
    const aRefreshCallbacks = {
        1: []
    };
    const oReceiptDetail = {};
    const bRequestPending = {
        1: true
    };
    const aHistoryIds = [];

    function _manageHistrory (sRecentId) {
        aHistoryIds.push(sRecentId);

        if (aHistoryIds.length > iMaxItems) {
            for (let i = iMaxItems - 1; i < aHistoryIds.length; i++) {
                const sId = aHistoryIds[i];
                delete oReceiptDetail[sId];
            }
        }
    }

    window.ipcRenderer.sendTo(window.iDatabaseId, "receiptDetail-read-list", 1);
    window.ipcRenderer.on("receiptDetail-read-list", (oEvent, oMessage) => {
        bRequestPending[oMessage.id] = false;
        oReceiptDetail[oMessage.id] = oMessage.result;
        aRefreshCallbacks[oMessage.id].forEach(function (fnCallback) {
            fnCallback(oMessage.result);
        });
        aRefreshCallbacks[oMessage.id].splice(0, aRefreshCallbacks.length);
        _manageHistrory(oMessage.id);
    });
    return {
        get: function (sId = 1) {
            if (oReceiptDetail[sId] !== undefined) {
                return Promise.resolve(oReceiptDetail[sId]);
            }

            const oDeferred = new Deferred();
            if (aRefreshCallbacks[sId] === undefined) {
                aRefreshCallbacks[sId] = [];
            }
            aRefreshCallbacks[sId].push(oDeferred.resolve);

            window.ipcRenderer.sendTo(window.iDatabaseId, "receiptDetail-read-list", sId);
            return oDeferred.promise;
        },
        refresh: function (fnCallback, sId = 1) {
            if (aRefreshCallbacks[sId] === undefined) {
                aRefreshCallbacks[sId] = [];
            }
            aRefreshCallbacks[sId].push(fnCallback);
            if (!bRequestPending[sId]) {
                bRequestPending[sId] = true;
                window.ipcRenderer.sendTo(window.iDatabaseId, "receiptDetail-read-list", 1);
            }
        },
        add: function (aReceiptDetail) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "receiptDetail-write-list", aReceiptDetail);
        },
        update: function (aReceiptDetail) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "receiptDetail-write-list", aReceiptDetail);
        },
        delete: function (sId) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "receiptDetail-delete-list", sId);
        }
    };
};

const oInstance = new ReceiptDetail();
module.exports = oInstance;
