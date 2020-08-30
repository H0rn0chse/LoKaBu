import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";

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
