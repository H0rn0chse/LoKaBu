import { db } from "./databaseConnection.js";
import { ipc } from "./ipc.js";

function read () {
    const sSql = `
    SELECT *
    FROM Types
    `;
    const oStmt = db.get().prepare(sSql);
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
        const oStmt = db.get().prepare(sSql);
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
        const oStmt = db.get().prepare(sSql);
        oStmt.run(oTypes);
    } else {
        // add
        const sSql = `
        INSERT INTO Types
        (DisplayName) VALUES ($DisplayName)
        `;
        const oStmt = db.get().prepare(sSql);
        oStmt.run(oTypes);
    }
};

ipc.on("types-read-list", (oEvent, sMessage) => {
    ipc.sendToRenderer("types-read-list", read());
});

ipc.on("types-write-object", (oEvent, oTypes) => {
    write();
    ipc.sendToRenderer("types-read-list", read());
});

export const types = {
    read,
    write
};
