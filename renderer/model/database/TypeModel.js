import { Model } from "../common/Model.js";

class _TypeModel extends Model {

}

export const TypeModel = new _TypeModel({
    types: [{
        id: "0",
        text: "type1"
    }, {
        id: "1",
        text: "type2"
    }, {
        id: "2",
        text: "type3"
    }]
});
