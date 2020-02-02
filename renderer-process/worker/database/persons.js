if (!window.oDatabase) {
    require("./databaseConnection");
}
const oDb = window.oDatabase;

oDb.readPersons = (fnCallback) => {
    const sSql = `
    SELECT *
    FROM Persons
    `;
    return oDb.all(sSql, fnCallback);
};

window.ipcRenderer.on("read-persons", (oEvent, sMessage) => {
    oDb.readPersons((oErr, oResult) => {
        if (oErr) {
            window.ipcRenderer.send("log", oErr);
        } else {
            window.ipcRenderer.sendTo(window.iRendererId, "read-persons", oResult);
        }
    });
});
