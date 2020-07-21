import { Model } from "../common/Model.js";

export const AccountModel = new Model({
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
