if (!window.oDatabase) {
    require("./databaseConnection");
}
const oDb = window.oDatabase;

oDb.readStores = (fnCallback) => {
    const sSql = `
    SELECT *
    FROM Stores
    `;
    const oStmt = oDb.prepare(sSql);
    const oResult = oStmt.all();
    fnCallback(null, oResult);
};

oDb.readStoresCallback = (oErr, oResult) => {
    if (oErr) {
        window.ipcRenderer.send("log", oErr);
    } else {
        window.ipcRenderer.sendTo(window.iRendererId, "stores-read-list", oResult);
    }
};

window.ipcRenderer.on("stores-read-list", (oEvent, sMessage) => {
    oDb.readStores(oDb.readStoresCallback);
});

oDb.writeStores = (oStores, fnCallback) => {
    if (Array.isArray(oStores)) {
        // overwrite all
        const sSql = `
        UPDATE Stores
        SET DisplayName = $DisplayName
        WHERE ID = $ID
        `;
        const oStmt = oDb.prepare(sSql);
        oStores.forEach((oParams) => {
            oStmt.run(oParams);
        });
    } else if (oStores.ID !== undefined) {
        // update
        const sSql = `
        UPDATE Stores
        SET DisplayName = $DisplayName
        WHERE ID = $ID
        `;
        const oStmt = oDb.prepare(sSql);
        oStmt.run(oStores);
    } else {
        // add
        const sSql = `
        INSERT INTO Stores
        (DisplayName) VALUES ($DisplayName)
        `;
        const oStmt = oDb.prepare(sSql);
        oStmt.run(oStores);
    }
    fnCallback(null);
};

window.ipcRenderer.on("stores-write-object", (oEvent, oStores) => {
    oDb.writeStores(oStores, function (oErr) {
        if (oErr) {
            window.ipcRenderer.send("log", oErr);
        } else {
            oDb.readStores(oDb.readStoresCallback);
        }
    });
});
