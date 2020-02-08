if (!window.oDatabase) {
    require("./databaseConnection");
}
const oDb = window.oDatabase;

oDb.readSettings = (fnCallback) => {
    const sSql = `
    SELECT *
    FROM Settings
    `;
    const oStmt = oDb.prepare(sSql);
    const oResult = oStmt.get();
    fnCallback(null, oResult);
};

window.ipcRenderer.on("read-settings", (oEvent, sMessage) => {
    oDb.readSettings((oErr, oResult) => {
        if (oErr) {
            window.ipcRenderer.send("log", oErr);
        } else {
            window.ipcRenderer.sendTo(window.iRendererId, "read-settings", oResult);
        }
    });
});

oDb.writeSettings = (oSettings, fnCallback) => {
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
    const oStmt = oDb.prepare(sSql);
    const oResult = oStmt.run(oParams);
    fnCallback(null, oResult);
};

window.ipcRenderer.on("write-settings", (oEvent, oSettings) => {
    oDb.writeSettings(oSettings, function (oErr) {
        if (oErr) {
            window.ipcRenderer.send("log", oErr);
        } else {
            window.ipcRenderer.send("log", "all fine");
        }
    });
});
