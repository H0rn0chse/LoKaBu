import { Table } from "../common/Table.js";
import { DatabaseManager } from "./DatabaseManager.js";

class _StoresTable extends Table {
    constructor () {
        super("stores");
    }

    getOrCreate (sStore) {
        const sSql = `
        SELECT ID
        FROM Stores
        WHERE DisplayName = '${sStore}'
        `;
        let oResult = DatabaseManager.get()
            .prepare(sSql)
            .get();
        if (oResult) {
            return oResult.ID;
        }
        const oStore = {
            DisplayName: sStore
        };
        oResult = this.createSqlAction(oStore);
        return oResult.lastInsertRowid;
    }

    createSqlAction (oStore) {
        const sSql = `
        INSERT INTO Stores
        (DisplayName) VALUES ($DisplayName)
        `;
        return DatabaseManager.get()
            .prepare(sSql)
            .run(oStore);
    }

    readSqlAction () {
        const sSql = `
        SELECT *
        FROM Stores
        `;
        return DatabaseManager.get()
            .prepare(sSql)
            .all();
    }

    updateSqlAction (oStore) {
        const sSql = `
        UPDATE Stores
        SET DisplayName = $DisplayName
        WHERE ID = $ID
        `;
        return DatabaseManager.get()
            .prepare(sSql)
            .run(oStore);
    }
}

export const StoresTable = new _StoresTable();
