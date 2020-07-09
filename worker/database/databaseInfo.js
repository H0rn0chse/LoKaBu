const oDb = require("./databaseConnection");

function read () {
    const sSql = `
    SELECT *
    FROM view_databaseInfo
    `;
    const oStmt = oDb.get().prepare(sSql);
    return oStmt.get();
};

window.ipcRenderer.on("databaseInfo-read-object", (oEvent, sMessage) => {
    window.ipcRenderer.sendTo(window.iRendererId, "databaseInfo-read-object", read());
});

window.ipcRenderer.on("databaseInfo-open-database", (oEvent, sMessage) => {
    // user default
    if (!sMessage) {
        oDb.close();
        oDb.open(true);
    } else {
        oDb.openOrCreateShared(sMessage);
    }
});

window.ipcRenderer.on("databaseInfo-create-database", (oEvent, sMessage) => {
    oDb.openOrCreateShared(sMessage);
});

module.exports = {
    read
};
