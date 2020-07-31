import { Model } from "../common/Model.js";

class _StoreModel extends Model {

}

export const StoreModel = new _StoreModel({
    stores: [{
        id: "0",
        text: "store1"
    }, {
        id: "1",
        text: "store2"
    }, {
        id: "2",
        text: "store3"
    }]
});
