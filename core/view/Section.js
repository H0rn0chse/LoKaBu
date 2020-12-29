import { DomElement } from "./DomElement.js";
import { Node } from "./Node.js";

export class Section extends Node {
    constructor (oAttributes) {
        super(oAttributes);
        this.name = "Section";
    }

    render () {
        if (!this.element) {
            this.element = new DomElement("section");
        }
        this.element.appendToParent(this.getParentDomRef());
    }
}
