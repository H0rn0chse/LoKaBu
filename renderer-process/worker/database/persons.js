if (!window.oDatabase) {
    require("./databaseConnection");
}
const oDb = window.oDatabase;

oDb.readPersons = (fnCallback) => {
    const sSql = `
    SELECT *
    FROM Persons
    `;
    const oStmt = oDb.prepare(sSql);
    const oResult = oStmt.all();
    fnCallback(null, oResult);
};

oDb.readPersonsCallback = (oErr, oResult) => {
    if (oErr) {
        window.ipcRenderer.send("log", oErr);
    } else {
        window.ipcRenderer.sendTo(window.iRendererId, "persons-read-list", oResult);
    }
};

window.ipcRenderer.on("persons-read-list", (oEvent, sMessage) => {
    oDb.readPersons(oDb.readPersonsCallback);
});

oDb.writePersons = (oPersons, fnCallback) => {
    if (Array.isArray(oPersons)) {
        // overwrite all
        const sSql = `
        UPDATE Persons
        SET DisplayName = $DisplayName
        WHERE ID = $ID
        `;
        const oStmt = oDb.prepare(sSql);
        oPersons.forEach((oParams) => {
            oStmt.run(oParams);
        });
    } else if (oPersons.ID !== undefined) {
        // update
        const sSql = `
        UPDATE Persons
        SET DisplayName = $DisplayName
        WHERE ID = $ID
        `;
        const oStmt = oDb.prepare(sSql);
        oStmt.run(oPersons);
    } else {
        // add
        const sSql = `
        INSERT INTO Persons
        (DisplayName) VALUES ($DisplayName)
        `;
        const oStmt = oDb.prepare(sSql);
        oStmt.run(oPersons);
    }
    fnCallback(null);
};

window.ipcRenderer.on("persons-write-object", (oEvent, oPersons) => {
    oDb.writePersons(oPersons, function (oErr) {
        if (oErr) {
            window.ipcRenderer.send("log", oErr);
        } else {
            oDb.readPersons(oDb.readPersonsCallback);
        }
    });
});
