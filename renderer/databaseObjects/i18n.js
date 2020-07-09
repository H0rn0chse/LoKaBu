function I18n () {
    let oI18n;
    const aRefreshCallbacks = [];
    let bRequestPending = true;

    window.ipcRenderer.sendTo(window.iDatabaseId, "i18n-read-list");
    window.ipcRenderer.on("i18n-read-list", (oEvent, oResult) => {
        bRequestPending = false;
        oI18n = oResult;

        aRefreshCallbacks.forEach(function (fnCallback) {
            fnCallback();
        });
        aRefreshCallbacks.splice(0, aRefreshCallbacks.length);
    });
    return {
        get: function () {
            return oI18n;
        },
        refresh: function (fnCallback) {
            aRefreshCallbacks.push(fnCallback);
            if (!bRequestPending) {
                bRequestPending = true;
                window.ipcRenderer.sendTo(window.iDatabaseId, "i18n-read-list");
            }
        }
    };
};

const oInstance = new I18n();
module.exports = oInstance;
