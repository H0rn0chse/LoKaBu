import { Model } from "../common/Model.js";

export const PersonModel = new Model({
    persons: [{
        id: "0",
        text: "person1"
    }, {
        id: "1",
        text: "person2"
    }, {
        id: "2",
        text: "person3"
    }]
});
