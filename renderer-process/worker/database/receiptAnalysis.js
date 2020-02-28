// eslint-disable-next-line no-unused-vars
const oDb = require("./databaseConnection");

function read () {
    /* const sSql = `
    SELECT *
    FROM *
    `;
    return oDb.get().get(sSql); */
};

window.ipcRenderer.on("receiptAnalysis-read-object", (oEvent, sMessage) => {
    window.ipcRenderer.sendTo(window.iRendererId, "receiptAnalysis-read-object", read());
});

module.exports = {
    read
};
