if (!window.oDatabase) {
    require("./databaseConnection");
}
const oDb = window.oDatabase;

oDb.readSettings = (fnCallback) => {
    const sSql = `
    SELECT *
    FROM Settings
    `;
    return oDb.get(sSql, fnCallback);
};

window.ipcRenderer.on("read-settings", (oEvent, sMessage) => {
    oDb.readSettings((oErr, oResult) => {
        if (oErr) {
            window.ipcRenderer.send("log", oErr);
        } else {
            window.ipcRenderer.sendTo(window.iRendererId, "read-settings", oResult);
        }
    });
});
