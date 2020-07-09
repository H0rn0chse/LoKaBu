const oDatabaseLockedDialog = require("../dialogs/databaseLocked");
const oDatabaseAbortDialog = require("../dialogs/databaseAbort");

window.ipcRenderer.on("database-locked", (oEvent, sMessage) => {
    oDatabaseLockedDialog.open(sMessage).then(() => {
        window.ipcRenderer.sendTo(window.iDatabaseId, "database-force");
    }).catch(() => {
        window.ipcRenderer.sendTo(window.iDatabaseId, "databaseInfo-open-database");
    });
});

window.ipcRenderer.on("database-open", (oEvent, sMessage) => {
    document.dispatchEvent(new CustomEvent("databaseOpened_Level_0", {}));
    document.dispatchEvent(new CustomEvent("databaseOpened_Level_1", {}));
    document.dispatchEvent(new CustomEvent("LanguageChanged", {}));
});

window.ipcRenderer.on("database-abort", (oEvent, sMessage) => {
    oDatabaseAbortDialog.open();
});
