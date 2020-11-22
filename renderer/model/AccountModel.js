import { findAndSplice } from "../common/Utils.js";
import { EventBus } from "../EventBus.js";
import { DatabaseModel } from "./common/DatabaseModel.js";
import { SettingsModel } from "./SettingsModel.js";

class _AccountModel extends DatabaseModel {
    constructor (oData) {
        super(oData, "accounts");
        this.name = "AccountModel";
        window[this.name] = this;
    }

    getEntries () {
        return this.get(["accounts"]);
    }

    addEntry () {
        const oEntry = {
            DisplayName: "",
            Owner: SettingsModel.getDefault("Person")
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

    deleteEntry (vId) {
        const oEntry = {
            ID: vId
        };
        const aList = this.getEntries();
        if (findAndSplice(aList, "ID", vId)) {
            EventBus.sendToDatabase("accounts-delete", oEntry);
        }
    }

    setDefault (iId) {
        SettingsModel.setDefault("Account", iId);
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
