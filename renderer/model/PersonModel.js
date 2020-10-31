import { findAndSplice } from "../common/Utils.js";
import { EventBus } from "../EventBus.js";
import { DatabaseModel } from "./common/DatabaseModel.js";
import { SettingsModel } from "./SettingsModel.js";

class _PersonModel extends DatabaseModel {
    constructor (oData) {
        super(oData, "persons");
        this.name = "PersonModel";
    }

    getEntries () {
        return this.get(["persons"]);
    }

    addEntry () {
        const oEntry = {
            DisplayName: ""
        };
        EventBus.sendToDatabase("persons-create", oEntry);

        this.push(["persons"], oEntry);
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

    deleteEntry (vId) {
        const oEntry = {
            ID: vId
        };
        const aList = this.getEntries();
        if (findAndSplice(aList, "ID", vId)) {
            EventBus.sendToDatabase("persons-delete", oEntry);
        }
    }

    setDefault (iId) {
        SettingsModel.setDefault("Person", iId);
    }

    processCreate (oEvent, oData) {
        const aPath = ["persons", { ID: undefined }, "ID"];
        this.set(aPath, oData.lastInsertRowid);
    }

    processRead (...args) {
        super.processRead(...args);
        console.log("PersonModel loaded");
    }

    processUpdate () {
        console.log("PersonModel updated");
    }
}

export const PersonModel = new _PersonModel({
    persons: []
});
