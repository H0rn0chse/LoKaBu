/* eslint-disable quote-props */
import { Model } from "../common/Model.js";

class _DetailModel extends Model {}

export const DetailModel = new _DetailModel({
    "title-i18n": ["detail.section.title"],
    "id-i18n": ["receipt.id"],
    "id": "some special id",
    "store-i18n": ["common.store"],
    "store": "value2",
    "stores": [{
        text: "text1",
        value: "value1"
    }, {
        text: "text2",
        value: "value2"
    }, {
        text: "text3",
        value: "value3"
    }]
});
