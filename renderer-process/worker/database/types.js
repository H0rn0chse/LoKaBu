if (!window.oDatabase) {
    require("./databaseConnection");
}
const oDb = window.oDatabase;

oDb.readTypes = (fnCallback) => {
    const sSql = `
    SELECT *
    FROM Types
    `;
    return oDb.get(sSql, fnCallback);
};

window.ipcRenderer.on("read-types", (oEvent, sMessage) => {
    oDb.readTypes((oErr, oResult) => {
        if (oErr) {
            window.ipcRenderer.send("log", oErr);
        } else {
            window.ipcRenderer.sendTo(window.iRendererId, "read-types", oResult);
        }
    });
});
