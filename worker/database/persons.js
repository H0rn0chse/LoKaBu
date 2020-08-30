import { Table } from "../common/Table.js";
import { DatabaseManager } from "./DatabaseManager.js";

class _PersonsTable extends Table {
    constructor () {
        super("persons");
    }

    getOrCreate (sPerson) {
        const sSql = `
        SELECT ID
        FROM Persons
        WHERE DisplayName = '${sPerson}'
        `;
        let oResult = DatabaseManager.get()
            .prepare(sSql)
            .get();
        if (oResult) {
            return oResult.ID;
        }
        const oPerson = {
            DisplayName: sPerson
        };
        oResult = this.createSqlAction(oPerson);
        return oResult.lastInsertRowid;
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
