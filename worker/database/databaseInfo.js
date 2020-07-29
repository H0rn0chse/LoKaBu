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

// This table contains ReceiptCount, LineIdList and ReceiptIdList
// and is considered to be removed

ipc.on("databaseInfo-read", (oEvent, sMessage) => {
    ipc.sendToRenderer("databaseInfo-read", read());
});

ipc.on("databaseInfo-open", (oEvent, sMessage) => {
    // user default
    if (!sMessage) {
        db.close();
        db.open(true);
    } else {
        db.openOrCreateShared(sMessage);
    }
});

ipc.on("databaseInfo-create", (oEvent, sMessage) => {
    db.openOrCreateShared(sMessage);
});

export const databaseInfo = {
    read
};
