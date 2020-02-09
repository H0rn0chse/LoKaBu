if (!window.oDatabase) {
    require("./databaseConnection");
}
const oDb = window.oDatabase;

oDb.readTypes = (fnCallback) => {
    const sSql = `
    SELECT *
    FROM Types
    `;
    const oStmt = oDb.prepare(sSql);
    const oResult = oStmt.all();
    fnCallback(null, oResult);
};

oDb.readTypesCallback = (oErr, oResult) => {
    if (oErr) {
        window.ipcRenderer.send("log", oErr);
    } else {
        window.ipcRenderer.sendTo(window.iRendererId, "read-types", oResult);
    }
};

window.ipcRenderer.on("read-types", (oEvent, sMessage) => {
    oDb.readTypes(oDb.readTypesCallback);
});

oDb.writeTypes = (oTypes, fnCallback) => {
    if (Array.isArray(oTypes)) {
        // overwrite all
        const sSql = `
        UPDATE Types
        SET DisplayName = $DisplayName
        WHERE ID = $ID
        `;
        const oStmt = oDb.prepare(sSql);
        oTypes.forEach((oParams) => {
            oStmt.run(oParams);
        });
    } else if (oTypes.ID !== undefined) {
        // update
        const sSql = `
        UPDATE Types
        SET DisplayName = $DisplayName
        WHERE ID = $ID
        `;
        const oStmt = oDb.prepare(sSql);
        oStmt.run(oTypes);
    } else {
        // add
        const sSql = `
        INSERT INTO Types
        (DisplayName) VALUES ($DisplayName)
        `;
        const oStmt = oDb.prepare(sSql);
        oStmt.run(oTypes);
    }
    fnCallback(null);
};

window.ipcRenderer.on("write-types", (oEvent, oTypes) => {
    oDb.writeTypes(oTypes, function (oErr) {
        if (oErr) {
            window.ipcRenderer.send("log", oErr);
        } else {
            oDb.readTypes(oDb.readTypesCallback);
        }
    });
});
