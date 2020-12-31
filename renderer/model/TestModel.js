import { Model2 } from "../../core/model/Model2.js";

class _TestModel extends Model2 {
}

export const TestModel = new _TestModel({
    some: {
        inner: {
            value: "someInnerValue"
        }
    },
    someItems: [{
        text: "item1"
    }, {
        text: "item2"
    }],
    someOptions: [{
        text: "item1",
        value: "1"
    }, {
        text: "item2",
        value: "2"
    }],
    someValue: "2"
});
