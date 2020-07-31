/* eslint-disable quote-props */
import { Model } from "../common/Model.js";

class _DetailModel extends Model {}

export const DetailModel = new _DetailModel({
    "save-i18n": ["common.save"],
    "title-i18n": ["detail.section.title"],
    "id-i18n": ["receipt.id"],
    "id": "some special id",
    "date-i18n": ["common.date"],
    "date": "2020-12-04",
    "store-i18n": ["common.store"],
    "store": 1,
    "account-i18n": ["common.account"],
    "account": 1,
    "comment": `some\nmultiline\ncomment\nwith\nmore\nthan\nfive\nlines`,
    "receiptLines": [{
        "id": 1,
        "person": 1,
        "type": 1,
        "value": 1
    }, {
        "id": 2,
        "person": 2,
        "type": 2,
        "value": 2.5
    }, {
        "id": 3,
        "person": 3,
        "type": 3,
        "value": 3 + 1 / 3
    }]
});
