import { Model } from "../common/Model.js";

class _AccountModel extends Model {}

export const AccountModel = new _AccountModel({
    accounts: [{
        id: "0",
        text: "account1",
        owner: "0"
    }, {
        id: "1",
        text: "account2",
        owner: "1"
    }, {
        id: "2",
        text: "account3",
        owner: "2"
    }]
});
