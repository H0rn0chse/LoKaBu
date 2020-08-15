import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { FlexContainer } from "../common/FlexContainer.js";
import { DropdownItem } from "../common/DropdownItem.js";

export class LineDetailLine extends View {
    constructor () {
        super();
        this.name = "LineDetailLineView";
    }

    render () {
        const oNode = new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
            .addClass("line-detail-line")
            .appendNode(new DomElement("select")
                .setId("person")
                .insertAggregation(this, "persons", DropdownItem)
                .sortChildren()
                .setValue(this.getProperty("person"))
                .addEventListener("change", this.onLineChange, this)
            )
            .appendNode(new DomElement("select")
                .setId("type")
                .insertAggregation(this, "types", DropdownItem)
                .sortChildren()
                .setValue(this.getProperty("type"))
                .addEventListener("change", this.onLineChange, this)
            )
            .appendNode(new DomElement("input")
                .setId("value")
                .setType("number")
                .setValue(this.getProperty("value"))
                .addEventListener("change", this.onLineChange, this)
            )
            .appendNode(new DomElement("div")
                .addClass("buttonCircle")
                .setText("-")
                .addEventListener("click", this.onLineRemove, this)
            )
            .getNode();

        return oNode;
    }

    onLineRemove (oEvent) {
        oEvent.customData = {
            id: this.getProperty("id")
        };
        this.handleEvent("lineRemove", oEvent);
    }

    onLineChange (oEvent) {
        oEvent.customData = {
            id: this.getProperty("id"),
            value: this.getNodeById("value").valueAsNumber || 0,
            type: this.getNodeById("type").value,
            person: this.getNodeById("person").value
        };
        this.handleEvent("lineChange", oEvent);
    }
};
