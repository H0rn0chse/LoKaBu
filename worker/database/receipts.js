import { Table } from "../common/Table.js";
import { DatabaseManager } from "./DatabaseManager.js";

class _ReceiptsTable extends Table {
    constructor () {
        super("receipts");
    }

    createSqlAction (oReceipt) {
        const sSql = `
        INSERT INTO Receipts
            (Date, Account, Comment, Store)
        Values ($Date, $Account, $Comment, $Store)
        `;
        return DatabaseManager.get()
            .prepare(sSql)
            .run(oReceipt);
    }

    readSqlAction (oReceipt) {
        const sSql = `
        SELECT *
        FROM Receipts
        WHERE ID = $ID
        `;
        return DatabaseManager.get()
            .prepare(sSql)
            .get(oReceipt);
    }

    updateSqlAction (oReceipt) {
        const sSql = `
        UPDATE Receipts
        SET Date=$Date, Account=$Account, Comment=$Comment, Store=$Store
        WHERE ID=$ID
        `;
        return DatabaseManager.get()
            .prepare(sSql)
            .run(oReceipt);
    }

    deleteSqlAction (oReceipt) {
        const sSql = `
        DELETE
        FROM Receipts
        WHERE ID=$ID;
        `;
        return DatabaseManager.get()
            .prepare(sSql)
            .run(oReceipt);
    }
}

export const ReceiptsTable = new _ReceiptsTable();
