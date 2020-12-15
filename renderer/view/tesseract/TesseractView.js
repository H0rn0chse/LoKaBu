import { View } from "../../../core/view/View.js";
import { DomElement } from "../../../core/view/DomElement.js";

export class TesseractView extends View {
    render () {
        const oNode = new DomElement("section")
            .addClass("tesseract")
            .appendNode(new DomElement("canvas")
                .setId("canvas")
                .addClass("hidden")
            )
            .getNode();

        return oNode;
    }

    getCanvas () {
        return this.getNodeById("canvas");
    }
};
