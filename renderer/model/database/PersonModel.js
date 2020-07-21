import { Model } from "../common/Model.js";

export const PersonModel = new Model({
    persons: [{
        text: "person1",
        value: "value1"
    }, {
        text: "person2",
        value: "value2"
    }, {
        text: "person3",
        value: "value3"
    }]
});
