const oDb = require("./databaseConnection");

function read () {
    const sSql = `
    SELECT *
    FROM Persons
    `;
    const oStmt = oDb.get().prepare(sSql);
    return oStmt.all();
};

function write (oPersons) {
    if (Array.isArray(oPersons)) {
        // overwrite all
        const sSql = `
        UPDATE Persons
        SET DisplayName = $DisplayName
        WHERE ID = $ID
        `;
        const oStmt = oDb.get().prepare(sSql);
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
        const oStmt = oDb.get().prepare(sSql);
        oStmt.run(oPersons);
    } else {
        // add
        const sSql = `
        INSERT INTO Persons
        (DisplayName) VALUES ($DisplayName)
        `;
        const oStmt = oDb.get().prepare(sSql);
        oStmt.run(oPersons);
    }
};

window.ipcRenderer.on("persons-read-list", (oEvent, sMessage) => {
    window.ipcRenderer.sendTo(window.iRendererId, "persons-read-list", read());
});

window.ipcRenderer.on("persons-write-object", (oEvent, oPersons) => {
    write(oPersons);
    window.ipcRenderer.sendTo(window.iRendererId, "persons-read-list", read());
});

module.exports = {
    read,
    write
};
