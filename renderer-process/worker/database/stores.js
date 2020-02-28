const oDb = require("./databaseConnection");

function read () {
    const sSql = `
    SELECT *
    FROM Stores
    `;
    const oStmt = oDb.get().prepare(sSql);
    return oStmt.all();
};

function write (oStores) {
    if (Array.isArray(oStores)) {
        // overwrite all
        const sSql = `
        UPDATE Stores
        SET DisplayName = $DisplayName
        WHERE ID = $ID
        `;
        const oStmt = oDb.get().prepare(sSql);
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
        const oStmt = oDb.get().prepare(sSql);
        oStmt.run(oStores);
    } else {
        // add
        const sSql = `
        INSERT INTO Stores
        (DisplayName) VALUES ($DisplayName)
        `;
        const oStmt = oDb.get().prepare(sSql);
        oStmt.run(oStores);
    }
};

window.ipcRenderer.on("stores-read-list", (oEvent, sMessage) => {
    window.ipcRenderer.sendTo(window.iRendererId, "stores-read-list", read());
});

window.ipcRenderer.on("stores-write-object", (oEvent, oStores) => {
    write(oStores);
    window.ipcRenderer.sendTo(window.iRendererId, "stores-read-list", read());
});

module.exports = {
    read,
    write
};
