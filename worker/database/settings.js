import { Table } from "../common/Table.js";
import { DatabaseManager } from "./DatabaseManager.js";

class _SettingsTable extends Table {
    constructor () {
        super("settings");
    }

    readDefaultDir () {
        const sSql = `
        SELECT DefaultDir
        FROM Settings
        `;
        return DatabaseManager.get("user")
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
        const oResult = DatabaseManager.get()
            .prepare(sSql)
            .get();

        oResult.DefaultDir = this.readDefaultDir();
        oResult.CurrentDir = DatabaseManager.getPath();

        return oResult;
    }

    updateSqlAction (oSettings) {
        // User specific defaults
        let sSql = `
        UPDATE Settings
        SET DefaultDir = $DefaultDir
        `;
        DatabaseManager.get("user")
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
        return DatabaseManager.get()
            .prepare(sSql)
            .run(oSettings);
    }
}

export const SettingsTable = new _SettingsTable();
