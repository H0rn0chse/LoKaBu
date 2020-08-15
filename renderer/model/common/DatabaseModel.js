import { Model } from "./Model.js";
import { EventBus } from "../../EventBus.js";

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
    }

    addEntry () {
        // to be implemented in the explicit model
        throw new Error(`the method addEntry was not implemented for this model`, this);
    }

    updateEntry () {
        // to be implemented in the explicit model
        throw new Error(`the method updateEntry was not implemented for this model`, this);
    }

    processCreate (oEvent) {
        this.update();
    }

    processRead (oEvent, oData) {
        this.set([this.table], oData);
    }

    processUpdate (oEvent) {
        this.update();
    }

    processDelete (oEvent) {
        this.update();
    }
}