import { db } from "./databaseConnection.js";
import { Table } from "../common/Table.js";

class _PersonsTable extends Table {
    constructor () {
        super("persons");
    }

    createSqlAction (oPerson) {
        const sSql = `
        INSERT INTO Persons
        (DisplayName) VALUES ($DisplayName)
        `;
        return db.get()
            .prepare(sSql)
            .run(oPerson);
    }

    readSqlAction () {
        const sSql = `
        SELECT *
        FROM Persons
        `;
        return db.get()
            .prepare(sSql)
            .all();
    }

    updateSqlAction (oPerson) {
        const sSql = `
        UPDATE Persons
        SET DisplayName = $DisplayName
        WHERE ID = $ID
        `;
        return db.get()
            .prepare(sSql)
            .run(oPerson);
    }
}

export const PersonsTable = new _PersonsTable();
