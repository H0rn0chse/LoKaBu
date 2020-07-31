import { db } from "./databaseConnection.js";
import { EventBus } from "../../renderer/EventBus.js";

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

EventBus.listen("databaseInfo-read", (oEvent, sMessage) => {
    EventBus.sendToBrowser("databaseInfo-read", read());
});

EventBus.listen("databaseInfo-open", (oEvent, sMessage) => {
    // user default
    if (!sMessage) {
        db.close();
        db.open(true);
    } else {
        db.openOrCreateShared(sMessage);
    }
});

EventBus.listen("databaseInfo-create", (oEvent, sMessage) => {
    db.openOrCreateShared(sMessage);
});

export const databaseInfo = {
    read
};
