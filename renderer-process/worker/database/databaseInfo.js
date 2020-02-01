if (!window.oDatabase) {
    require("./databaseConnection");
}
const oDb = window.oDatabase;

oDb.readDatabaseInfo = (fnCallback) => {
    const sSql = `
    SELECT *
    FROM view_databaseInfo
    `;
    return oDb.get(sSql, fnCallback);
};

window.ipcRenderer.on("read-databaseInfo", (oEvent, sMessage) => {
    oDb.readDatabaseInfo((oErr, oResult) => {
        if (oErr) {
            window.ipcRenderer.send("log", oErr);
        } else {
            window.ipcRenderer.sendTo(window.iRendererId, "read-databaseInfo", oResult);
        }
    });
});
