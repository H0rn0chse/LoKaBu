if (!window.oDatabase) {
    require("./databaseConnection");
}
const oDb = window.oDatabase;

oDb.readi18n = (fnCallback) => {
    const sSql = `
    SELECT *
    FROM i18n
    `;
    const oStmt = oDb.prepare(sSql);
    const oResult = oStmt.all();
    fnCallback(null, oResult);
};

window.ipcRenderer.on("i18n-read-list", (oEvent, sMessage) => {
    oDb.readi18n((oErr, oResult) => {
        if (oErr) {
            window.ipcRenderer.send("log", oErr);
        } else {
            window.ipcRenderer.sendTo(window.iRendererId, "i18n-read-list", oResult);
        }
    });
});
