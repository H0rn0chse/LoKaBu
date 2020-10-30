import { Table } from "../common/Table.js";
import { DatabaseManager } from "./DatabaseManager.js";

class _AccountTable extends Table {
    constructor () {
        super("accounts");

        this.references = {
            persons: "Owner"
        };
    }

    getOrCreate (sAccount) {
        const sSql = `
        SELECT ID
        FROM Accounts
        WHERE DisplayName = '${sAccount}'
        `;
        let oResult = DatabaseManager.get()
            .prepare(sSql)
            .get();
        if (oResult) {
            return oResult.ID;
        }
        const oAccount = {
            DisplayName: sAccount,
            Owner: 1
        };
        oResult = this.createSqlAction(oAccount);
        return oResult.lastInsertRowid;
    }

    createSqlAction (oAccount) {
        const sSql = `
        INSERT INTO Accounts
        (DisplayName, Owner) VALUES ($DisplayName, $Owner)
        `;
        return DatabaseManager.get()
            .prepare(sSql)
            .run(oAccount);
    }

    readSqlAction () {
        const sSql = `
        SELECT *
        FROM Accounts
        `;
        return DatabaseManager.get()
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
        return DatabaseManager.get()
            .prepare(sSql)
            .run(oAccount);
    }
};

export const AccountTable = new _AccountTable();
