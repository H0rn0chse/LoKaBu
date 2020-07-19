import { db } from "./databaseConnection.js";
import { ipc } from "./ipc.js";

function read () {
    const sSql = `
    SELECT *
    FROM view_databaseInfo
    `;
    const oStmt = db.get().prepare(sSql);
    return oStmt.get();
};

ipc.on("databaseInfo-read-object", (oEvent, sMessage) => {
    ipc.sendToRenderer("databaseInfo-read-object", read());
});

ipc.on("databaseInfo-open-database", (oEvent, sMessage) => {
    // user default
    if (!sMessage) {
        db.close();
        db.open(true);
    } else {
        db.openOrCreateShared(sMessage);
    }
});

ipc.on("databaseInfo-create-database", (oEvent, sMessage) => {
    db.openOrCreateShared(sMessage);
});

export const databaseInfo = {
    read
};
