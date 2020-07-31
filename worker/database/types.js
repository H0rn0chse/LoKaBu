import { db } from "./databaseConnection.js";
import { Table } from "../common/Table.js";

class _TypesTable extends Table {
    constructor () {
        super("types");
    }

    createSqlAction (oType) {
        const sSql = `
        INSERT INTO Types
        (DisplayName) VALUES ($DisplayName)
        `;
        return db.get()
            .prepare(sSql)
            .run(oType);
    }

    readSqlAction () {
        const sSql = `
        SELECT *
        FROM Types
        `;
        return db.get()
            .prepare(sSql)
            .all();
    }

    updateSqlAction (oType) {
        const sSql = `
        UPDATE Types
        SET DisplayName = $DisplayName
        WHERE ID = $ID
        `;
        return db.get()
            .prepare(sSql)
            .run(oType);
    }
}

export const TypesTable = new _TypesTable();
