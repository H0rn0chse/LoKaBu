import { EventBus } from "../EventBus.js";
import { DatabaseModel } from "../../core/model/DatabaseModel.js";
import { UnixToInput, InputToUnix, DateToUnix } from "../../core/common/DateUtils.js";
import { deepClone } from "../../core/common/Utils.js";
import { SettingsModel } from "./SettingsModel.js";

class _ReceiptModel extends DatabaseModel {
    constructor (oData) {
        super(oData, "receipts", true);
        this.name = "ReceiptModel";
        window[this.name] = this;

        this.backupEntry = null;
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
        const iNow = DateToUnix(new Date());
        const oEntry = {
            Date: iNow,
            Account: SettingsModel.getDefault("Account"),
            Comment: "",
            Store: SettingsModel.getDefault("Store"),
            DuplicateHint: "[]",
            Created: iNow,
            Updated: iNow
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
        this.backupEntry = null;
    }

    processCreate (oEvent, oData) {
        this.set(["ID"], oData.lastInsertRowid);
        this.backup();
    }

    processRead (oEvent, oData) {
        oData.Date = UnixToInput(oData.Date);
        this.mergeObjectIntoData(oData);
        console.log("ReceiptModel loaded");
        this.backup();
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
        this.set(["Updated"], DateToUnix(new Date()), true);

        const oEntry = deepClone(this.get([]));
        oEntry.Date = InputToUnix(oEntry.Date);
        EventBus.sendToDatabase("receipts-update", oEntry);
    }

    backup () {
        this.backupEntry = deepClone(this.get([]));
    }

    reset () {
        if (this.backupEntry) {
            this.mergeObjectIntoData(this.backupEntry);
            this.save();
        }
    }
}

export const ReceiptModel = new _ReceiptModel({
});
