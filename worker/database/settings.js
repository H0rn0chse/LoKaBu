import { db } from "./databaseConnection.js";
import { Table } from "../common/Table.js";

class _SettingsTable extends Table {
    constructor () {
        super("settings");
    }

    _readDefaultDir () {
        const sSql = `
        SELECT DefaultDir
        FROM Settings
        `;
        return db.get("user")
            .prepare(sSql)
            .get().DefaultDir;
    }

    readSqlAction () {
        const sSql = `
        SELECT
            Person,
            Type,
            Account,
            Store,
            Language
        FROM Settings
        `;
        const oResult = db.get()
            .prepare(sSql)
            .get();

        oResult.DefaultDir = this._readDefaultDir();
        oResult.CurrentDir = db.get().name;

        return oResult;
    }

    updateSqlAction (oSettings) {
        // User specific defaults
        let sSql = `
        UPDATE Settings
        SET DefaultDir = $DefaultDir
        `;
        db.get("user")
            .prepare(sSql)
            .run(oSettings);
        sSql = `
        UPDATE Settings
        SET Person = $Person,
            Type = $Type,
            Account = $Account,
            Store = $Store,
            Language = $Language
        `;
        return db.get()
            .prepare(sSql)
            .run(oSettings);
    }
}

export const SettingsTable = new _SettingsTable();
