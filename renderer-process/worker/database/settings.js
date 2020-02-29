const oDb = require("./databaseConnection");

function read () {
    const sSql = `
    SELECT *
    FROM Settings
    `;
    const oStmt = oDb.get().prepare(sSql);
    const oResult = oStmt.get();
    oResult.DefaultDir = readDefaultDir();
    oResult.CurrentDir = oDb.get().name;
    return oResult;
};

function readDefaultDir () {
    const sSql = `
    SELECT DefaultDir
    FROM Settings
    `;
    const oStmt = oDb.get("user").prepare(sSql);
    return oStmt.get().DefaultDir;
}

function write (oSettings) {
    let oParams = {
        Person: oSettings.Person,
        Type: oSettings.Type,
        Language: oSettings.Language
    };
    let sSql = `
    UPDATE Settings
    SET Person = $Person,
        Type = $Type,
        Language = $Language
    `;
    let oStmt = oDb.get().prepare(sSql);
    oStmt.run(oParams);
    // User specific defaults
    oParams = {
        DefaultDir: oSettings.DefaultDir
    };
    sSql = `
    UPDATE Settings
    SET DefaultDir = $DefaultDir
    `;
    oStmt = oDb.get("user").prepare(sSql);
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
    readDefaultDir,
    write
};
