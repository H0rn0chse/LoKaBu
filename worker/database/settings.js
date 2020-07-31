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
        SELECT *
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
        let oParams = {
            Person: oSettings.Person,
            Type: oSettings.Type,
            Language: oSettings.Language
        };
        let sSql = `
        UPDATE Settings
        SET Person = $Person,
            Type = $Type,
            Language = $Language
        `;
        db.get()
            .prepare(sSql)
            .run(oParams);
        // User specific defaults
        oParams = {
            DefaultDir: oSettings.DefaultDir
        };
        sSql = `
        UPDATE Settings
        SET DefaultDir = $DefaultDir
        `;
        db.get("user")
            .prepare(sSql)
            .run(oParams);
    }
}

export const SettingsTable = new _SettingsTable();
