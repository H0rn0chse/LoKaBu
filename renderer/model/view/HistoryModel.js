/* eslint-disable quote-props */
import { Model } from "../common/Model.js";

class _HistoryModel extends Model {}

export const HistoryModel = new _HistoryModel({
    "sort": [{
        "id": "id",
        "text-i18n": ["receipt.id"],
        "selected": true,
        "direction": "asc"
    }, {
        "id": "date",
        "text-i18n": ["common.date"],
        "selected": false,
        "direction": ""
    }, {
        "id": "account",
        "text-i18n": ["common.account"],
        "selected": false,
        "direction": ""
    }, {
        "id": "value",
        "text-i18n": ["common.value"],
        "selected": false,
        "direction": ""
    }],
    "entries": [{
        id: "1",
        date: "2020-12-04",
        account: ["accounts", { id: "0" }, "text"],
        value: 1.23
    }, {
        id: "2",
        date: "2020-12-05",
        account: ["accounts", { id: "2" }, "text"],
        value: 42.1
    }],
    "currentPage": 1,
    "pageCount": 5
});
