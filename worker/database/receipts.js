import { Table } from "../common/Table.js";
import { DatabaseManager } from "./DatabaseManager.js";

class _ReceiptsTable extends Table {
    constructor () {
        super("receipts");

        this.references = {
            accounts: "Account",
            stores: "Store"
        };
    }

    createSqlAction (oReceipt) {
        const sSql = `
        INSERT INTO Receipts
            (Date, Account, Comment, Store, DuplicateHint, Created, Updated)
        Values ($Date, $Account, $Comment, $Store, $DuplicateHint, $Created, $Updated)
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
        const oOldReceipt = this.readSqlAction(oReceipt);
        if (oOldReceipt) {
            const oUpdatedReceipt = Object.assign({}, oOldReceipt, oReceipt);
            const sSql = `
            UPDATE Receipts
            SET
                Date=$Date,
                Account=$Account,
                Comment=$Comment,
                Store=$Store,
                DuplicateHint=$DuplicateHint,
                Updated=$Updated
            WHERE ID=$ID
            `;
            return DatabaseManager.get()
                .prepare(sSql)
                .run(oUpdatedReceipt);
        }
        throw new Error("Receipt does not exist anymore");
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
