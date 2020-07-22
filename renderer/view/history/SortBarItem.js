import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";

export class SortBarItem extends View {
    render () {
        const oNode = new DomElement("div")
            .appendNode(new DomElement("div")
                .setText(this.getProperty("text"))
                .addClass(this.getProperty("selected") ? "selected" : "")
                .addClass(this.getProperty("direction") ? this.getProperty("direction") : "")
            )
            .getNode();

        return oNode;
    }
};
