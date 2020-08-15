import { Table } from "../common/Table.js";
import { DatabaseManager } from "./DatabaseManager.js";

class _PersonsTable extends Table {
    constructor () {
        super("persons");
    }

    createSqlAction (oPerson) {
        const sSql = `
        INSERT INTO Persons
        (DisplayName) VALUES ($DisplayName)
        `;
        return DatabaseManager.get()
            .prepare(sSql)
            .run(oPerson);
    }

    readSqlAction () {
        const sSql = `
        SELECT *
        FROM Persons
        `;
        return DatabaseManager.get()
            .prepare(sSql)
            .all();
    }

    updateSqlAction (oPerson) {
        const sSql = `
        UPDATE Persons
        SET DisplayName = $DisplayName
        WHERE ID = $ID
        `;
        return DatabaseManager.get()
            .prepare(sSql)
            .run(oPerson);
    }
}

export const PersonsTable = new _PersonsTable();
