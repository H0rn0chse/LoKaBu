function Settings () {
    let oSettings;
    const aRefreshCallbacks = [];
    const oListenerCallbacks = {};
    let bRequestPending = true;
    let bLanguageChanged = false;

    window.ipcRenderer.sendTo(window.iDatabaseId, "settings-read-object");
    window.ipcRenderer.on("settings-read-object", (oEvent, oResult) => {
        bRequestPending = false;
        if (bLanguageChanged) {
            document.dispatchEvent(new CustomEvent("LanguageChanged", {}));
            bLanguageChanged = false;
        }
        oSettings = oResult;

        aRefreshCallbacks.forEach(function (fnCallback) {
            fnCallback();
        });
        aRefreshCallbacks.splice(0, aRefreshCallbacks.length);

        Object.keys(oListenerCallbacks).forEach((sKey) => {
            oListenerCallbacks[sKey](oSettings);
        });
    });
    return {
        get: function () {
            return oSettings;
        },
        update: function (oSettingsObject) {
            if (oSettingsObject.Language !== oSettings.Language) {
                bLanguageChanged = true;
            }
            oSettings = oSettingsObject;
            window.ipcRenderer.sendTo(window.iDatabaseId, "settings-write-object", oSettings);
        },
        refresh: function (fnCallback) {
            aRefreshCallbacks.push(fnCallback);
            if (!bRequestPending) {
                bRequestPending = true;
                window.ipcRenderer.sendTo(window.iDatabaseId, "settings-read-object");
            }
        },
        getProperty: function (sPropertyName) {
            return oSettings[sPropertyName];
        },
        setProperty: function (sPropertyName, oValue) {
            if (sPropertyName === "Language" && oSettings.Language !== oValue) {
                bLanguageChanged = true;
            }
            oSettings[sPropertyName] = oValue;
            window.ipcRenderer.sendTo(window.iDatabaseId, "settings-write-object", oSettings);
        },
        addListener: function (sName, fnCallback) {
            oListenerCallbacks[sName] = fnCallback;
        },
        removeListener: function (sName) {
            delete oListenerCallbacks[sName];
        }
    };
};

const oInstance = new Settings();
module.exports = oInstance;
