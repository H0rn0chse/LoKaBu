import { Model } from "./Model.js";
import { EventBus } from "../../renderer/EventBus.js";

export class DatabaseModel extends Model {
    constructor (oData, sTable, bSkipInitialRead = false) {
        super(oData);

        this.table = sTable;

        if (!bSkipInitialRead) {
            EventBus.listen("database-open", (oEvent) => {
                EventBus.sendToDatabase(`${this.table}-read`);
            });
        }

        EventBus.listen(`${this.table}-create`, this.processCreate, this);
        EventBus.listen(`${this.table}-read`, this.processRead, this);
        EventBus.listen(`${this.table}-update`, this.processUpdate, this);
        EventBus.listen(`${this.table}-delete`, this.processDelete, this);
        EventBus.listen(`${this.table}-replace`, this.processReplace, this);
    }

    addEntry () {
        // to be implemented in the explicit model
        throw new Error(`the method addEntry was not implemented for this model`, this);
    }

    updateEntry () {
        // to be implemented in the explicit model
        throw new Error(`the method updateEntry was not implemented for this model`, this);
    }

    deleteEntry () {
        // to be implemented in the explicit model
        throw new Error(`the method deleteEntry was not implemented for this model`, this);
    }

    replaceEntry (sSourceId, sTargetId) {
        const oEntry = {
            table: this.table,
            old: sSourceId,
            new: sTargetId
        };

        EventBus.sendToDatabase("helper-replace", oEntry);
    }

    processCreate (oEvent, oData) {
        this.update();
    }

    processRead (oEvent, oData) {
        this.set([this.table], oData);
    }

    processUpdate (oEvent, oData) {
        this.update();
    }

    processDelete (oEvent, oData) {
        this.update();
    }

    processReplace (oEvent, oData) {
        EventBus.sendToDatabase(`${this.table}-read`);
    }
}
