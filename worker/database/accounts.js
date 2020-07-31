import { db } from "./databaseConnection.js";
import { Table } from "../common/Table.js";

class _AccountTable extends Table {
    constructor () {
        super("accounts");
    }

    createSqlAction (oAccount) {
        const sSql = `
        INSERT INTO Accounts
        (DisplayName, Owner) VALUES ($DisplayName, $Owner)
        `;
        return db.get()
            .prepare(sSql)
            .run(oAccount);
    }

    readSqlAction () {
        const sSql = `
        SELECT *
        FROM Accounts
        `;
        return db.get()
            .prepare(sSql)
            .all();
    }

    updateSqlAction (oAccount) {
        const sSql = `
        UPDATE Accounts
        SET DisplayName = $DisplayName,
        Owner = $Owner
        WHERE ID = $ID
        `;
        return db.get()
            .prepare(sSql)
            .run(oAccount);
    }
};

export const AccountTable = new _AccountTable();
