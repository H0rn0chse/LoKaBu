import { db } from "./databaseConnection.js";
import { Table } from "../common/Table.js";

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
        return db.get()
            .prepare(sSql)
            .run(oReceipt);
    }

    readSqlAction (oReceipt) {
        const sSql = `
        SELECT *
        FROM Receipts
        WHERE ID = $ID
        `;
        return db.get()
            .prepare(sSql)
            .get(oReceipt);
    }

    updateSqlAction (oReceipt) {
        const sSql = `
        UPDATE Receipts
        SET Date=$Date, Account=$Account, Comment=$Comment, Store=$Store
        WHERE ID=$ID
        `;
        return db.get()
            .prepare(sSql)
            .run(oReceipt);
    }

    deleteSqlAction (oReceipt) {
        const sSql = `
        DELETE
        FROM Receipts
        WHERE ID=$ID;
        `;
        return db.get()
            .prepare(sSql)
            .run(oReceipt);
    }
}

export const ReceiptsTable = new _ReceiptsTable();
