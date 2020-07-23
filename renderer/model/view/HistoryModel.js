/* eslint-disable quote-props */
import { Model } from "../common/Model.js";

class _HistoryModel extends Model {}

export const HistoryModel = new _HistoryModel({
    "sort": [{
        "text-i18n": ["receipt.id"],
        "selected": true,
        "direction": "asc"
    }, {
        "text-i18n": ["common.date"],
        "selected": false,
        "direction": ""
    }, {
        "text-i18n": ["common.account"],
        "selected": false,
        "direction": ""
    }, {
        "text-i18n": ["common.value"],
        "selected": false,
        "direction": ""
    }],
    "entries": [{
        id: "1",
        date: "2020-12-04",
        account: ["accounts", { value: "value1" }, "text"],
        value: 1.23
    }, {
        id: "2",
        date: "2020-12-05",
        account: ["accounts", { value: "value2" }, "text"],
        value: 42.1
    }],
    "currentPage": 1,
    "pageCount": 5
});
