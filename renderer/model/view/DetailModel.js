/* eslint-disable quote-props */
import { Model } from "../common/Model.js";
import { LineModel } from "../database/LineModel.js";
import { ReceiptModel } from "../database/ReceiptModel.js";

class _DetailModel extends Model {
    constructor (...args) {
        super(...args);

        this.readReceipt(1);
    }

    readReceipt (iId) {
        ReceiptModel.read(iId);
        LineModel.readReceiptLines(iId);
    }

    newReceipt () {
        ReceiptModel.addEntry();
        LineModel.emptyList();
    }

    deleteReceipt (iId) {
        ReceiptModel.deleteEntry(iId);
        LineModel.deleteReceipt(iId);
        ReceiptModel.read(1);
        LineModel.readReceiptLines(1);
    }
}

export const DetailModel = new _DetailModel({
    "new-i18n": ["detail.newReceipt"],
    "delete-i18n": ["detail.deleteReceipt"],
    "title-i18n": ["detail.section.title"],
    "id-i18n": ["receipt.id"],
    "account-i18n": ["common.account"],
    "date-i18n": ["common.date"],
    "store-i18n": ["common.store"]
});
