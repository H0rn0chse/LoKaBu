const oDb = require("./databaseConnection");

function read () {
    const sSql = `
    SELECT *
    FROM i18n
    `;
    const oStmt = oDb.get("user").prepare(sSql);
    return oStmt.all();
};

window.ipcRenderer.on("i18n-read-list", (oEvent, sMessage) => {
    window.ipcRenderer.sendTo(window.iRendererId, "i18n-read-list", read());
});

module.exports = {
    read
};
