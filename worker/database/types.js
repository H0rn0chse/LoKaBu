
import { Table } from "../common/Table.js";
import { DatabaseManager } from "./DatabaseManager.js";

class _TypesTable extends Table {
    constructor () {
        super("types");
    }

    createSqlAction (oType) {
        const sSql = `
        INSERT INTO Types
        (DisplayName) VALUES ($DisplayName)
        `;
        return DatabaseManager.get()
            .prepare(sSql)
            .run(oType);
    }

    readSqlAction () {
        const sSql = `
        SELECT *
        FROM Types
        `;
        return DatabaseManager.get()
            .prepare(sSql)
            .all();
    }

    updateSqlAction (oType) {
        const sSql = `
        UPDATE Types
        SET DisplayName = $DisplayName
        WHERE ID = $ID
        `;
        return DatabaseManager.get()
            .prepare(sSql)
            .run(oType);
    }
}

export const TypesTable = new _TypesTable();
