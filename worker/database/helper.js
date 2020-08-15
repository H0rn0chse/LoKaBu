import { EventBus } from "../../renderer/EventBus.js";
import { DatabaseManager } from "./DatabaseManager.js";

class _Helper {
    constructor () {
        EventBus.listen("helper-firstReceipt", this.getFirstReceipt, this);
    }

    getVersion (oDb) {
        const sSql = `
        SELECT
            Version
        FROM Settings
        `;
        const oResult = oDb.prepare(sSql)
            .get();
        return oResult.Version;
    }

    getFirstReceipt () {
        const sSql = `
        SELECT ID
        FROM Receipts
        LIMIT 1
        `;
        const oResult = DatabaseManager.get()
            .prepare(sSql)
            .get();
        EventBus.sendToBrowser("helper-firstReceipt", oResult && oResult.ID);
    }
}

export const Helper = new _Helper();
