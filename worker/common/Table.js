import { EventBus } from "../../renderer/EventBus.js";
import { DatabaseManager } from "../database/DatabaseManager.js";

const SqliteError = require("better-sqlite3").SqliteError;

export class Table {
    constructor (sTable) {
        this.table = sTable;
        this.references = {};

        EventBus.listen(`${this.table}-create`, this.create, this);
        EventBus.listen(`${this.table}-read`, this.read, this);
        EventBus.listen(`${this.table}-update`, this.update, this);
        EventBus.listen(`${this.table}-delete`, this.delete, this);
        EventBus.listen(`helper-replace`, this.replace, this);
    }

    createSqlAction () {
        // to be implemented in the explicit table
        throw new Error(`the method create was not implemented for the table ${this.table}`);
    }

    create (oEvent, ...args) {
        try {
            const vResult = this.createSqlAction(...args);
            EventBus.sendToBrowser(`${this.table}-create`, vResult);
        } catch (err) {
            this._handleError(err, this.table, "create");
        }
    }

    readSqlAction () {
        // to be implemented in the explicit table
        throw new Error(`the method read was not implemented for the table ${this.table}`);
    }

    read (oEvent, ...args) {
        try {
            const vResult = this.readSqlAction(...args);
            EventBus.sendToBrowser(`${this.table}-read`, vResult);
        } catch (err) {
            this._handleError(err, this.table, "read");
        }
    }

    updateSqlAction () {
        // to be implemented in the explicit table
        throw new Error(`the method update was not implemented for the table ${this.table}`);
    }

    update (oEvent, ...args) {
        try {
            const vResult = this.updateSqlAction(...args);
            EventBus.sendToBrowser(`${this.table}-update`, vResult);
        } catch (err) {
            this._handleError(err, this.table, "update");
        }
    }

    deleteSqlAction () {
        // to be implemented in the explicit table
        throw new Error(`the method delete was not implemented for the table ${this.table}`);
    }

    delete (oEvent, ...args) {
        try {
            const vResult = this.deleteSqlAction(...args);
            EventBus.sendToBrowser(`${this.table}-delete`, vResult);
        } catch (err) {
            this._handleError(err, this.table, "delete");
        }
    }

    replaceSqlAction (sColumn, vOld, vNew) {
        const sSql = `
        UPDATE ${this.table}
        SET ${sColumn} = ${vNew}
        WHERE ${sColumn} = ${vOld}
        `;
        return DatabaseManager.get()
            .prepare(sSql)
            .run();
    }

    replace (oEvent, oData) {
        const sColumn = this.references[oData.table];
        if (sColumn) {
            try {
                const vResult = this.replaceSqlAction(sColumn, oData.old, oData.new);
                EventBus.sendToBrowser(`${this.table}-replace`, vResult);
            } catch (err) {
                this._handleError(err, this.table, "replace");
            }
        }
    }

    _handleError (oError, sTable, sOperation) {
        const oData = {
            table: sTable,
            operation: sOperation
        };

        if (oError instanceof SqliteError) {
            oData.error = oError.message;
            oData.code = oError.code;
        } else {
            oData.error = oError.toString();
        }

        console.error(oError);

        EventBus.sendToBrowser("database-error", oData);
    }
};
