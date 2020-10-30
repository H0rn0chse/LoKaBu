
import { Table } from "../common/Table.js";
import { DatabaseManager } from "./DatabaseManager.js";

class _TypesTable extends Table {
    constructor () {
        super("types");
    }

    getOrCreate (sType) {
        const sSql = `
        SELECT ID
        FROM Types
        WHERE DisplayName = '${sType}'
        `;
        let oResult = DatabaseManager.get()
            .prepare(sSql)
            .get();
        if (oResult) {
            return oResult.ID;
        }
        const oType = {
            DisplayName: sType
        };
        oResult = this.createSqlAction(oType);
        return oResult.lastInsertRowid;
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

    deleteSqlAction (oType) {
        const sSql = `
        DELETE FROM Types
        WHERE ID = $ID
        `;
        return DatabaseManager.get()
            .prepare(sSql)
            .run(oType);
    }
}

export const TypesTable = new _TypesTable();
