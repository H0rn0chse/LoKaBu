import { EventBus } from "../../renderer/EventBus.js";
import { db } from "./databaseConnection.js";

class _Helper {
    constructor () {
        EventBus.listen("helper-firstReceipt", this.getFirstReceipt, this);
    }

    getFirstReceipt () {
        const sSql = `
        SELECT ID
        FROM Receipts
        LIMIT 1
        `;
        const oResult = db.get()
            .prepare(sSql)
            .get();
        EventBus.sendToBrowser("helper-firstReceipt", oResult && oResult.ID);
    }
}

export const Helper = new _Helper();
