if (!window.oDatabase) {
    require("./databaseConnection");
}
const oDb = window.oDatabase;

oDb.readReceiptList = (fnCallback) => {
    /* const sSql = `
    SELECT *
    FROM *
    `;
    return oDb.get(sSql, fnCallback); */
    fnCallback("ReceiptList is not yet implemented");
};

window.ipcRenderer.on("read-receiptList", (oEvent, sMessage) => {
    oDb.readReceiptList((oErr, oResult) => {
        if (oErr) {
            window.ipcRenderer.send("log", oErr);
        } else {
            window.ipcRenderer.sendTo(window.iRendererId, "read-receiptList", oResult);
        }
    });
});
