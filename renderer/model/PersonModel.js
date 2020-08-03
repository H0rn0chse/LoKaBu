import { EventBus } from "../EventBus.js";
import { DatabaseModel } from "./common/DatabaseModel.js";
import { SettingsModel } from "./SettingsModel.js";

class _PersonModel extends DatabaseModel {
    constructor (oData) {
        super(oData, "persons");
    }

    addEntry () {
        const oEntry = {
            DisplayName: ""
        };
        EventBus.sendToDatabase("persons-create", oEntry);

        const iIndex = this.get(["persons"]).length;
        const aPath = ["persons", iIndex];
        this.set(aPath, oEntry);
    }

    updateEntry (sId, sDisplayName) {
        const oEntry = {
            ID: sId,
            DisplayName: sDisplayName
        };
        EventBus.sendToDatabase("persons-update", oEntry);

        const aPath = ["persons", { ID: sId }];
        this.set(aPath, oEntry);
    }

    setDefault (iId) {
        SettingsModel.setDefault(this.table, iId);
    }

    processCreate (oEvent, oData) {
        const aPath = ["persons", { ID: undefined }, "ID"];
        this.set(aPath, oData.lastInsertRowid);
    }

    processRead (...args) {
        super.processRead(...args);
        console.log("PersonsModel loaded");
    }

    processUpdate () {}
}

export const PersonModel = new _PersonModel({
    persons: []
});
