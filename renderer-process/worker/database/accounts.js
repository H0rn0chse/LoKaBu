if (!window.oDatabase) {
    require("./databaseConnection");
}
const oDb = window.oDatabase;

oDb.readAccounts = (fnCallback) => {
    const sSql = `
    SELECT *
    FROM Accounts
    `;
    return oDb.get(sSql, fnCallback);
};

window.ipcRenderer.on("read-accounts", (oEvent, sMessage) => {
    oDb.readAccounts((oErr, oResult) => {
        if (oErr) {
            window.ipcRenderer.send("log", oErr);
        } else {
            window.ipcRenderer.sendTo(window.iRendererId, "read-accounts", oResult);
        }
    });
});
