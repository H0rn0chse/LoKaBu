import { db } from "./databaseConnection.js";
import { Table } from "../common/Table.js";

class _LinesTable extends Table {
    constructor () {
        super("lines");
    }

    createSqlAction (oLine) {
        const sSql = `
        INSERT INTO Lines
            (Receipt, Value, Billing, Type)
        Values ($Receipt, $Value, $Billing, $Type)
        `;
        return db.get()
            .prepare(sSql)
            .run(oLine);
    }

    readSqlAction (oLine) {
        const sSql = `
        INSERT INTO Lines
            (Receipt, Value, Billing, Type)
        Values ($Receipt, $Value, $Billing, $Type)
        `;
        return db.get()
            .prepare(sSql)
            .run(oLine);
    }

    updateSqlAction (oLine) {
        const sSql = `
        UPDATE Lines
        SET Receipt=$Receipt, Value=$Value, Billing=$Billing, Type=$Type
        WHERE ID=$ID
        `;
        return db.get()
            .prepare(sSql)
            .run(oLine);
    }

    deleteSqlAction (oLine) {
        const sSql = `
        DELETE
        FROM Lines
        WHERE ID=$ID
        `;
        return db.get()
            .prepare(sSql)
            .run(oLine);
    }
}

export const LinesTable = new _LinesTable();
