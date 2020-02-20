if (!window.oDatabase) {
    require("./databaseConnection");
}
const oDb = window.oDatabase;

oDb.readAccounts = (fnCallback) => {
    const sSql = `
    SELECT *
    FROM Accounts
    `;
    const oStmt = oDb.prepare(sSql);
    const oResult = oStmt.all();
    fnCallback(null, oResult);
};

oDb.readAccountsCallback = (oErr, oResult) => {
    if (oErr) {
        window.ipcRenderer.send("log", oErr);
    } else {
        window.ipcRenderer.sendTo(window.iRendererId, "accounts-read-list", oResult);
    }
};

window.ipcRenderer.on("accounts-read-list", (oEvent, sMessage) => {
    oDb.readAccounts(oDb.readAccountsCallback);
});

oDb.writeAccounts = (oAccounts, fnCallback) => {
    if (Array.isArray(oAccounts)) {
        // overwrite all
        const sSql = `
        UPDATE Accounts
        SET DisplayName = $DisplayName,
        Owner = $Owner
        WHERE ID = $ID
        `;
        const oStmt = oDb.prepare(sSql);
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
        const oStmt = oDb.prepare(sSql);
        oStmt.run(oAccounts);
    } else {
        // add
        const sSql = `
        INSERT INTO Accounts
        (DisplayName, Owner) VALUES ($DisplayName, $Owner)
        `;
        const oStmt = oDb.prepare(sSql);
        oStmt.run(oAccounts);
    }
    fnCallback(null);
};

window.ipcRenderer.on("accounts-write-object", (oEvent, oAccounts) => {
    oDb.writeAccounts(oAccounts, function (oErr) {
        if (oErr) {
            window.ipcRenderer.send("log", oErr);
        } else {
            oDb.readAccounts(oDb.readAccountsCallback);
        }
    });
});
