import { EventBus } from "../../EventBus.js";
import { DatabaseModel } from "../common/DatabaseModel.js";

class _AccountModel extends DatabaseModel {
    constructor (oData) {
        super(oData, "accounts");
    }

    addEntry () {
        const oEntry = {
            DisplayName: "",
            Owner: 1
        };
        EventBus.sendToDatabase("accounts-create", oEntry);

        const iIndex = this.get(["accounts"]).length;
        const aPath = ["accounts", iIndex];
        this.set(aPath, oEntry);
    }

    updateEntry (iId, sDisplayName, iOwner) {
        const oEntry = {
            ID: iId,
            DisplayName: sDisplayName,
            Owner: iOwner
        };
        EventBus.sendToDatabase("accounts-update", oEntry);

        const aPath = ["accounts", { ID: iId }];
        this.set(aPath, oEntry);
    }

    processCreate (oEvent, oData) {
        const aPath = ["accounts", { ID: undefined }, "ID"];
        this.set(aPath, oData.lastInsertRowid);
    }

    processRead (...args) {
        super.processRead(...args);
        console.log("AccountsModel loaded");
    }

    processUpdate () {}
}

export const AccountModel = new _AccountModel({
    accounts: []
});
