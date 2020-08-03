import { EventBus } from "../EventBus.js";
import { DatabaseModel } from "./common/DatabaseModel.js";
import { SettingsModel } from "./SettingsModel.js";

class _TypeModel extends DatabaseModel {
    constructor (oData) {
        super(oData, "types");
    }

    addEntry () {
        const oEntry = {
            DisplayName: ""
        };
        EventBus.sendToDatabase("types-create", oEntry);

        const iIndex = this.get(["types"]).length;
        const aPath = ["types", iIndex];
        this.set(aPath, oEntry);
    }

    updateEntry (sId, sDisplayName) {
        const oEntry = {
            ID: sId,
            DisplayName: sDisplayName
        };
        EventBus.sendToDatabase("types-update", oEntry);

        const aPath = ["types", { ID: sId }];
        this.set(aPath, oEntry);
    }

    setDefault (iId) {
        SettingsModel.setDefault(this.table, iId);
    }

    processCreate (oEvent, oData) {
        const aPath = ["types", { ID: undefined }, "ID"];
        this.set(aPath, oData.lastInsertRowid);
    }

    processRead (...args) {
        super.processRead(...args);
        console.log("TypesModel loaded");
    }

    processUpdate () {}
}

export const TypeModel = new _TypeModel({
    types: []
});
