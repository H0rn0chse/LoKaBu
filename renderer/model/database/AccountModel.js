import { Model } from "../common/Model.js";

class _AccountModel extends Model {}

export const AccountModel = new _AccountModel({
    accounts: [{
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
