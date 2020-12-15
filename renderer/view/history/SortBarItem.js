import { View } from "../../../core/view/View.js";
import { DomElement } from "../../../core/view/DomElement.js";

export class SortBarItem extends View {
    constructor () {
        super();
        this.name = "SortBarItemView";
    }

    render () {
        const oNode = new DomElement("div")
            .appendNode(new DomElement("div")
                .addClass("button")
                .setText(this.getProperty("text"))
                .addClass(this.getProperty("selected") ? "selected" : "")
                .addClass(this.getProperty("direction") ? this.getProperty("direction") : "")
                .addEventListener("click", this.onSort, this)
            )
            .getNode();

        return oNode;
    }

    onSort (oEvent) {
        oEvent.customData = {
            id: this.getProperty("id"),
            direction: this.getProperty("direction")
        };
        this.handleEvent("sort", oEvent);
    }
};
