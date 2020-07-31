import { EventBus } from "../../EventBus.js";
import { DatabaseModel } from "../common/DatabaseModel.js";

class _StoreModel extends DatabaseModel {
    constructor (oData) {
        super(oData, "stores");
    }

    addEntry () {
        const oEntry = {
            DisplayName: ""
        };
        EventBus.sendToDatabase("stores-create", oEntry);

        const iIndex = this.get(["stores"]).length;
        const aPath = ["stores", iIndex];
        this.set(aPath, oEntry);
    }

    updateEntry (iId, sDisplayName) {
        const oEntry = {
            ID: iId,
            DisplayName: sDisplayName
        };
        EventBus.sendToDatabase("stores-update", oEntry);

        const aPath = ["stores", { ID: iId }];
        this.set(aPath, oEntry);
    }

    processCreate (oEvent, oData) {
        const aPath = ["stores", { ID: undefined }, "ID"];
        this.set(aPath, oData.lastInsertRowid);
    }

    processRead (...args) {
        super.processRead(...args);
        console.log("StoresModel loaded");
    }

    processUpdate () {}
}

export const StoreModel = new _StoreModel({
    stores: []
});
