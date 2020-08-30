/* eslint-disable quote-props */
import { Model } from "./common/Model.js";
import { LineModel } from "./LineModel.js";
import { ReceiptModel } from "./ReceiptModel.js";
import { EventBus } from "../EventBus.js";

class _DetailModel extends Model {
    constructor (...args) {
        super(...args);
        this.name = "DetailModel";

        EventBus.listen("database-open", (oEvent) => {
            this.bOpenReceipt = true;
            EventBus.sendToDatabase("helper-firstReceipt");
        });

        EventBus.listen("helper-firstReceipt", (oEvent, iReceipt) => {
            if (this.bOpenReceipt) {
                this.bOpenReceipt = false;
                if (Number.isInteger(iReceipt)) {
                    this.readReceipt(iReceipt);
                } else {
                    this.set(["no-receipt"], true);
                }
            }
        });
    }

    replaceReceiptLines (aResult) {
        const iId = ReceiptModel.getId();
        LineModel.deleteReceipt(iId);

        this.appendReceiptLines(aResult);
    }

    appendReceiptLines (aResult) {
        const iId = ReceiptModel.getId();

        aResult.forEach(fValue => {
            LineModel.addEntry(iId, fValue);
        });
    }

    readReceipt (iId) {
        this.set(["no-receipt"], false);
        ReceiptModel.read(iId);
        LineModel.readReceiptLines(iId);
    }

    newReceipt () {
        this.set(["no-receipt"], false);
        ReceiptModel.addEntry();
        LineModel.emptyList();
    }

    deleteReceipt (iId) {
        ReceiptModel.deleteEntry(iId);
        LineModel.deleteReceipt(iId);

        this.bOpenReceipt = true;
        EventBus.sendToDatabase("helper-firstReceipt");
    }

    setImageSrc (sPath) {
        this.set(["imageSrc"], sPath);
    }

    setBusy (bBusy) {
        this.set(["busy"], bBusy);
    }

    importFragments (aFiles) {
        EventBus.sendToDatabase("fragment-import", aFiles);
    }
}

export const DetailModel = new _DetailModel({
    "new-i18n": ["detail.newReceipt"],
    "delete-i18n": ["detail.deleteReceipt"],
    "title-i18n": ["detail.section.title"],
    "id-i18n": ["receipt.id"],
    "account-i18n": ["common.account"],
    "date-i18n": ["common.date"],
    "store-i18n": ["common.store"],
    "no-receipt": false,
    "no-receipt-i18n": ["detail.noReceipt"],
    "load-i18n": ["scanner.load"],
    "start-i18n": ["scanner.start"],
    "dnd-i18n": ["scanner.dnd"],
    "imageSrc": "",
    "busy": false
});
