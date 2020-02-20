if (!window.oDatabase) {
    require("./databaseConnection");
}
const oDb = window.oDatabase;

oDb.readReceiptAnalysis = (fnCallback) => {
    /* const sSql = `
    SELECT *
    FROM *
    `;
    return oDb.get(sSql, fnCallback); */
    fnCallback("ReceiptAnalysis is not yet implemented");
};

window.ipcRenderer.on("receiptAnalysis-read-object", (oEvent, sMessage) => {
    oDb.readReceiptAnalysis((oErr, oResult) => {
        if (oErr) {
            window.ipcRenderer.send("log", oErr);
        } else {
            window.ipcRenderer.sendTo(window.iRendererId, "receiptAnalysis-read-object", oResult);
        }
    });
});
