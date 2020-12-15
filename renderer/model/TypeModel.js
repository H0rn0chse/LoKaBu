import { findAndSplice } from "../../core/common/Utils.js";
import { EventBus } from "../EventBus.js";
import { DatabaseModel } from "../../core/model/DatabaseModel.js";
import { SettingsModel } from "./SettingsModel.js";

class _TypeModel extends DatabaseModel {
    constructor (oData) {
        super(oData, "types");
        this.name = "TypeModel";
        window[this.name] = this;
    }

    getEntries () {
        return this.get(["types"]);
    }

    addEntry () {
        const oEntry = {
            DisplayName: ""
        };
        EventBus.sendToDatabase("types-create", oEntry);

        this.push(["types"], oEntry);
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

    deleteEntry (vId) {
        const oEntry = {
            ID: vId
        };
        const aList = this.getEntries();
        if (findAndSplice(aList, "ID", vId)) {
            EventBus.sendToDatabase("types-delete", oEntry);
        }
    }

    setDefault (iId) {
        SettingsModel.setDefault("Type", iId);
    }

    processCreate (oEvent, oData) {
        const aPath = ["types", { ID: undefined }, "ID"];
        this.set(aPath, oData.lastInsertRowid);
    }

    processRead (...args) {
        super.processRead(...args);
        console.log("TypeModel loaded");
    }

    processUpdate () {
        console.log("TypeModel updated");
    }
}

export const TypeModel = new _TypeModel({
    types: []
});
