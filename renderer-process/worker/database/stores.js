if (!window.oDatabase) {
    require("./databaseConnection");
}
const oDb = window.oDatabase;

oDb.readStores = (fnCallback) => {
    const sSql = `
    SELECT *
    FROM Stores
    `;
    return oDb.all(sSql, fnCallback);
};

window.ipcRenderer.on("read-stores", (oEvent, sMessage) => {
    oDb.readStores((oErr, oResult) => {
        if (oErr) {
            window.ipcRenderer.send("log", oErr);
        } else {
            window.ipcRenderer.sendTo(window.iRendererId, "read-stores", oResult);
        }
    });
});
