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
    "stores": [{
        text: "store1",
        value: "value1"
    }, {
        text: "store2",
        value: "value2"
    }, {
        text: "store3",
        value: "value3"
    }],
    "accounts": [{
        text: "account1",
        value: "value1"
    }, {
        text: "account2",
        value: "value2"
    }, {
        text: "account3",
        value: "value3"
    }]
});
