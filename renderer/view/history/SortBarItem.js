import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";

export class SortBarItem extends View {
    constructor () {
        super();
        this.addEvents([
            "sort"
        ]);
    }

    render () {
        const oNode = new DomElement("div")
            .appendNode(new DomElement("div")
                .setText(this.getProperty("text"))
                .addClass(this.getProperty("selected") ? "selected" : "")
                .addClass(this.getProperty("direction") ? this.getProperty("direction") : "")
                .addEventHandler("click", this.onSort, this)
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
