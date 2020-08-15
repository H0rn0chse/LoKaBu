import { Table } from "../common/Table.js";
import { DatabaseManager } from "./DatabaseManager.js";

class _StoresTable extends Table {
    constructor () {
        super("stores");
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
