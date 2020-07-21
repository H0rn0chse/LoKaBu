import { View } from "./View.js";
import { DomElement } from "./DomElement.js";

export class DropdownItem extends View {
    render () {
        const oNode = new DomElement("option")
            .setValue(this.getProperty("value"))
            .setText(this.getProperty("text"))
            .getNode();

        return oNode;
    }
};
