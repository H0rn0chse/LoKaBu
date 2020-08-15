import { Table } from "../common/Table.js";
import { DatabaseManager } from "./DatabaseManager.js";

class _I18nTable extends Table {
    constructor () {
        super("i18n");
    }

    readSqlAction () {
        const sSql = `
        SELECT *
        FROM i18n
        `;
        return DatabaseManager.get("user")
            .prepare(sSql)
            .all();
    }
}

export const I18nTable = new _I18nTable();
