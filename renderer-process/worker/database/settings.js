if (!window.oDatabase) {
    require("./databaseConnection");
}
const oDb = window.oDatabase;

oDb.readSettings = (fnCallback) => {
    const sSql = `
    SELECT *
    FROM Settings
    `;
    return oDb.get(sSql, fnCallback);
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
        $Person: oSettings.Person,
        $Type: oSettings.Type,
        $Language: oSettings.Language
    };
    const sSql = `
    UPDATE Settings
    SET Person = $Person,
        Type = $Type,
        Language = $Language
    `;
    return oDb.run(sSql, oParams, fnCallback);
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
