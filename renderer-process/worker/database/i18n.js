if (!window.oDatabase) {
    require("./databaseConnection");
}
const oDb = window.oDatabase;

oDb.readi18n = (fnCallback) => {
    const sSql = `
    SELECT *
    FROM i18n
    `;
    return oDb.all(sSql, fnCallback);
};

window.ipcRenderer.on("read-persons", (oEvent, sMessage) => {
    oDb.readi18n((oErr, oResult) => {
        if (oErr) {
            window.ipcRenderer.send("log", oErr);
        } else {
            window.ipcRenderer.sendTo(window.iRendererId, "read-i18n", oResult);
        }
    });
});
