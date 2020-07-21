/* eslint-disable quote-props */
import { Model } from "../common/Model.js";

class _DetailModel extends Model {}

export const DetailModel = new _DetailModel({
    "title-i18n": ["detail.section.title"],
    "id-i18n": ["receipt.id"],
    "id": "some special id",
    "date-i18n": ["common.date"],
    "date": "2020-12-04",
    "store-i18n": ["common.store"],
    "store": "value2",
    "account-i18n": ["common.account"],
    "account": "value2",
    "comment": `some\nmultiline\ncomment\nwith\nmore\nthan\nfive\nlines`,
    "receiptLines": [{
        id: "1",
        person: "value1",
        type: "value1",
        value: 1
    }, {
        id: "2",
        person: "value2",
        type: "value2",
        value: 2.5
    }, {
        id: "3",
        person: "value3",
        type: "value3",
        value: 3 + 1 / 3
    }]
});
