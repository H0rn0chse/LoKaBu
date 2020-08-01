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
}

export const DetailModel = new _DetailModel({
    "save-i18n": ["common.save"],
    "title-i18n": ["detail.section.title"],
    "id-i18n": ["receipt.id"],
    "account-i18n": ["common.account"],
    "date-i18n": ["common.date"],
    "store-i18n": ["common.store"]
});
