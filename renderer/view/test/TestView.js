import { XmlView } from "../../../core/view/XmlView.js";

export class TestView extends XmlView {
    constructor (models) {
        super(models, "renderer/view/test/TestView");
    }

    update () {}
};
