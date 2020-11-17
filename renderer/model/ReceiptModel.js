import { EventBus } from "../EventBus.js";
import { DatabaseModel } from "./common/DatabaseModel.js";
import { UnixToInput, InputToUnix, DateToUnix } from "../common/DateUtils.js";
import { deepClone } from "../common/Utils.js";
import { SettingsModel } from "./SettingsModel.js";

class _ReceiptModel extends DatabaseModel {
    constructor (oData) {
        super(oData, "receipts", true);
        this.name = "ReceiptModel";
    }

    getId () {
        return this.get(["ID"]);
    }

    read (iId) {
        const oData = {
            ID: iId
        };
        EventBus.sendToDatabase(`${this.table}-read`, oData);
    }

    addEntry () {
        const oEntry = {
            Date: DateToUnix(new Date()),
            Account: SettingsModel.getDefault("Account"),
            Comment: "",
            Store: SettingsModel.getDefault("Store")
        };
        EventBus.sendToDatabase("receipts-create", deepClone(oEntry));

        oEntry.Date = UnixToInput(oEntry.Date);
        this.mergeObjectIntoData(oEntry);
    }

    deleteEntry (iId) {
        const oEntry = {
            ID: iId
        };
        EventBus.sendToDatabase("receipts-delete", oEntry);
    }

    processCreate (oEvent, oData) {
        this.set(["ID"], oData.lastInsertRowid);
    }

    processRead (oEvent, oData) {
        oData.Date = UnixToInput(oData.Date);
        this.mergeObjectIntoData(oData);
        console.log("ReceiptModel loaded");
    }

    processUpdate () {
        console.log("ReceiptModel updated");
    }

    processReplace () {
        this.read(this.getId());
    }

    setDate (sDate) {
        this.set(["Date"], sDate, true);
        this.save();
        this.update();
    }

    setAccount (iAccount) {
        this.set(["Account"], iAccount, true);
        this.save();
        this.update();
    }

    setComment (sComment) {
        this.set(["Comment"], sComment, true);
        this.save();
        this.update();
    }

    appendComment (sComment) {
        const sOldComment = this.get(["Comment"]);
        const sNewComment = sOldComment ? `${sOldComment}\n${sComment}` : sComment;
        this.set(["Comment"], sNewComment, true);
        this.save();
        this.update();
    }

    setStore (iStore) {
        this.set(["Store"], iStore, true);
        this.save();
        this.update();
    }

    save () {
        const oEntry = deepClone(this.get([]));
        oEntry.Date = InputToUnix(oEntry.Date);
        EventBus.sendToDatabase("receipts-update", oEntry);
    }
}

export const ReceiptModel = new _ReceiptModel({
});
