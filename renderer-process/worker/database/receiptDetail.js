if (!window.oDatabase) {
    require("./databaseConnection");
}
const oDb = window.oDatabase;

oDb.readReceiptDetail = (fnCallback) => {
    /* const sSql = `
    SELECT *
    FROM *
    `;
    return oDb.get(sSql, fnCallback); */
    fnCallback("ReceiptDetail is not yet implemented");
};

window.ipcRenderer.on("read-receiptDetail", (oEvent, sMessage) => {
    oDb.readReceiptDetail((oErr, oResult) => {
        if (oErr) {
            window.ipcRenderer.send("log", oErr);
        } else {
            window.ipcRenderer.sendTo(window.iRendererId, "read-receiptDetail", oResult);
        }
    });
});
