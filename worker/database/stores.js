import { db } from "./databaseConnection.js";
import { ipc } from "./ipc.js";

function read () {
    const sSql = `
    SELECT *
    FROM Stores
    `;
    const oStmt = db.get().prepare(sSql);
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
        const oStmt = db.get().prepare(sSql);
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
        const oStmt = db.get().prepare(sSql);
        oStmt.run(oStores);
    } else {
        // add
        const sSql = `
        INSERT INTO Stores
        (DisplayName) VALUES ($DisplayName)
        `;
        const oStmt = db.get().prepare(sSql);
        oStmt.run(oStores);
    }
};

ipc.on("stores-create", (oEvent, sMessage) => {
    // todo implementation
});

ipc.on("stores-read", (oEvent, sMessage) => {
    ipc.sendToRenderer("stores-read", read());
});

ipc.on("stores-update", (oEvent, oStores) => {
    write(oStores);
    ipc.sendToRenderer("stores-read", read());
});

ipc.on("stores-delete", (oEvent, sMessage) => {
    // todo error handling
});

export const stores = {
    read,
    write
};
