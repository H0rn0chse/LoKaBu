import { DomElement } from "./DomElement.js";
import { loadCss } from "../common/Utils.js";

loadCss("/core/view/BusyIndicator.css");

export class BusyIndicator extends DomElement {
    constructor () {
        super("div");

        this.addClass("busyIndicator");

        for (let i = 12; i > 0; i--) {
            this.appendNode(new DomElement("div"));
        }
    }
}
