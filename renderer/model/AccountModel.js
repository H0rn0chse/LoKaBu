import { EventBus } from "../EventBus.js";
import { DatabaseModel } from "./common/DatabaseModel.js";
import { SettingsModel } from "./SettingsModel.js";

class _AccountModel extends DatabaseModel {
    constructor (oData) {
        super(oData, "accounts");
        this.name = "AccountModel";
    }

    addEntry () {
        const oEntry = {
            DisplayName: "",
            Owner: 1
        };
        EventBus.sendToDatabase("accounts-create", oEntry);

        this.push(["accounts"], oEntry);
    }

    updateEntry (sId, sDisplayName, iOwner) {
        const oEntry = {
            ID: sId,
            DisplayName: sDisplayName,
            Owner: iOwner
        };
        EventBus.sendToDatabase("accounts-update", oEntry);

        const aPath = ["accounts", { ID: sId }];
        this.set(aPath, oEntry);
    }

    setDefault (iId) {
        SettingsModel.setDefault(this.table, iId);
    }

    processCreate (oEvent, oData) {
        const aPath = ["accounts", { ID: undefined }, "ID"];
        this.set(aPath, oData.lastInsertRowid);
    }

    processRead (...args) {
        super.processRead(...args);
        console.log("AccountModel loaded");
    }

    processUpdate () {
        console.log("AccountModel updated");
    }
}

export const AccountModel = new _AccountModel({
    accounts: []
});
