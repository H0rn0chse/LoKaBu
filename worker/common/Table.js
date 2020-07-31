import { EventBus } from "../../renderer/EventBus.js";

export class Table {
    constructor (sTable) {
        this.table = sTable;

        EventBus.listen(`${this.table}-create`, this.create, this);
        EventBus.listen(`${this.table}-read`, this.read, this);
        EventBus.listen(`${this.table}-update`, this.update, this);
        EventBus.listen(`${this.table}-delete`, this.delete, this);
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
            console.error(err);
            EventBus.sendToBrowser("database-error", err.toString());
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
            console.error(err);
            EventBus.sendToBrowser("database-error", err.toString());
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
            console.error(err);
            EventBus.sendToBrowser("database-error", err.toString());
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
            console.error(err);
            EventBus.sendToBrowser("database-error", err.toString());
        }
    }
};
