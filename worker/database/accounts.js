import { db } from "./databaseConnection.js";
import { ipc } from "./ipc.js";

function read () {
    const sSql = `
    SELECT *
    FROM Accounts
    `;
    const oStmt = db.get().prepare(sSql);
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
        const oStmt = db.get().prepare(sSql);
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
        const oStmt = db.get().prepare(sSql);
        oStmt.run(oAccounts);
    } else {
        // add
        const sSql = `
        INSERT INTO Accounts
        (DisplayName, Owner) VALUES ($DisplayName, $Owner)
        `;
        const oStmt = db.get().prepare(sSql);
        oStmt.run(oAccounts);
    }
};

ipc.on("accounts-create", (oEvent, oMessage) => {
    // todo implementation
});

ipc.on("accounts-read", (oEvent, sMessage) => {
    ipc.sendToRenderer("accounts-read", read());
});

ipc.on("accounts-update", (oEvent, oAccounts) => {
    write(oAccounts);
    ipc.sendToRenderer("accounts-read", read());
});

ipc.on("accounts-delete", (oEvent, oMessage) => {
    // todo error handling
});

export const accounts = {
    read,
    write
};
