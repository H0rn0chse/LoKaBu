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

module.exports = {
    read
};
