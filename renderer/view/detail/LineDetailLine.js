import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { FlexContainer } from "../common/FlexContainer.js";
import { DropdownItem } from "../common/DropdownItem.js";

export class LineDetailLine extends View {
    constructor () {
        super();
        this.addEvents([
            "lineRemove",
            "personChange",
            "typeChange",
            "lineValueChange"
        ]);
    }

    render () {
        const oNode = new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
            .addClass("line-detail-line")
            .appendNode(new DomElement("select")
                .insertAggregation(this, "persons", DropdownItem)
                .setValue(this.getProperty("person"))
                .addEventListener("change", this.onPersonChange, this)
            )
            .appendNode(new DomElement("select")
                .insertAggregation(this, "types", DropdownItem)
                .setValue(this.getProperty("type"))
                .addEventListener("change", this.onTypeChange, this)
            )
            .appendNode(new DomElement("input")
                .setType("number")
                .setValue(this.getProperty("value"))
                .addEventListener("change", this.onLineValueChange, this)
            )
            .appendNode(new DomElement("div")
                .setText("-")
                .addEventListener("click", this.onLineRemove, this)
            )
            .getNode();

        return oNode;
    }

    onPersonChange (oEvent) {
        oEvent.customData = {
            id: this.getProperty("id"),
            person: oEvent.target.value
        };
        this.handleEvent("personChange", oEvent);
    }

    onTypeChange (oEvent) {
        oEvent.customData = {
            id: this.getProperty("id"),
            type: oEvent.target.value
        };
        this.handleEvent("typeChange", oEvent);
    }

    onLineRemove (oEvent) {
        oEvent.customData = {
            id: this.getProperty("id")
        };
        this.handleEvent("lineRemove", oEvent);
    }

    onLineValueChange (oEvent) {
        oEvent.customData = {
            id: this.getProperty("id"),
            lineValue: oEvent.target.value
        };
        this.handleEvent("lineValueChange", oEvent);
    }
};
