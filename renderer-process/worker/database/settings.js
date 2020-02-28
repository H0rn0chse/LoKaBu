const oDb = require("./databaseConnection");

function read () {
    const sSql = `
    SELECT *
    FROM Settings
    `;
    const oStmt = oDb.get().prepare(sSql);
    const oResult = oStmt.get();
    oResult.SharedDir = readSharedDir();
    return oResult;
};

function readSharedDir () {
    const sSql = `
    SELECT SharedDir
    FROM Settings
    `;
    const oStmt = oDb.get("user").prepare(sSql);
    return oStmt.get().SharedDir;
}

function write (oSettings) {
    const oParams = {
        Person: oSettings.Person,
        Type: oSettings.Type,
        Language: oSettings.Language
    };
    const sSql = `
    UPDATE Settings
    SET Person = $Person,
        Type = $Type,
        Language = $Language
    `;
    const oStmt = oDb.get("user").prepare(sSql);
    oStmt.run(oParams);
};

window.ipcRenderer.on("settings-read-object", (oEvent, sMessage) => {
    window.ipcRenderer.sendTo(window.iRendererId, "settings-read-object", read());
});

window.ipcRenderer.on("settings-write-object", (oEvent, oSettings) => {
    write(oSettings);
    window.ipcRenderer.sendTo(window.iRendererId, "settings-read-object", read());
});

module.exports = {
    read,
    readSharedDir,
    write
};
