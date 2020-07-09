const oDb = require("./databaseConnection");

function read () {
    const sSql = `
    SELECT *
    FROM Accounts
    `;
    const oStmt = oDb.get().prepare(sSql);
    return oStmt.all();
};

function write (oAccounts) {
    if (Array.isArray(oAccounts)) {
        // overwrite all
        const sSql = `
        UPDATE Accounts
        SET DisplayName = $DisplayName,
        Owner = $Owner
        WHERE ID = $ID
        `;
        const oStmt = oDb.get().prepare(sSql);
        oAccounts.forEach((oParams) => {
            oStmt.run(oParams);
        });
    } else if (oAccounts.ID !== undefined) {
        // update
        const sSql = `
        UPDATE Accounts
        SET DisplayName = $DisplayName,
        Owner = $Owner
        WHERE ID = $ID
        `;
        const oStmt = oDb.get().prepare(sSql);
        oStmt.run(oAccounts);
    } else {
        // add
        const sSql = `
        INSERT INTO Accounts
        (DisplayName, Owner) VALUES ($DisplayName, $Owner)
        `;
        const oStmt = oDb.get().prepare(sSql);
        oStmt.run(oAccounts);
    }
};

window.ipcRenderer.on("accounts-read-list", (oEvent, sMessage) => {
    window.ipcRenderer.sendTo(window.iRendererId, "accounts-read-list", read());
});

window.ipcRenderer.on("accounts-write-object", (oEvent, oAccounts) => {
    write(oAccounts);
    window.ipcRenderer.sendTo(window.iRendererId, "accounts-read-list", read());
});

module.exports = {
    read,
    write
};
