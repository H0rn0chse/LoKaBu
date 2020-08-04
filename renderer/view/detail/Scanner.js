import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";

export class Scanner extends View {
    constructor (...args) {
        super(...args);
        this.name = "ScannerView";
    }

    render () {
        const oNode = new DomElement("section")
            .addClass("detail")
            .appendNode(new DomElement("div")
                .setText("scanner"))
            .getNode();

        return oNode;
    }
};
