const oDb = require("./databaseConnection");

function read () {
    const sSql = `
    SELECT *
    FROM Types
    `;
    const oStmt = oDb.get().prepare(sSql);
    return oStmt.all();
};

function write (oTypes) {
    if (Array.isArray(oTypes)) {
        // overwrite all
        const sSql = `
        UPDATE Types
        SET DisplayName = $DisplayName
        WHERE ID = $ID
        `;
        const oStmt = oDb.get().prepare(sSql);
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
        const oStmt = oDb.get().prepare(sSql);
        oStmt.run(oTypes);
    } else {
        // add
        const sSql = `
        INSERT INTO Types
        (DisplayName) VALUES ($DisplayName)
        `;
        const oStmt = oDb.get().prepare(sSql);
        oStmt.run(oTypes);
    }
};

window.ipcRenderer.on("types-read-list", (oEvent, sMessage) => {
    window.ipcRenderer.sendTo(window.iRendererId, "types-read-list", read());
});

window.ipcRenderer.on("types-write-object", (oEvent, oTypes) => {
    write();
    window.ipcRenderer.sendTo(window.iRendererId, "types-read-list", read());
});

module.exports = {
    read,
    write
};
