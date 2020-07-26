import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { FlexContainer } from "../common/FlexContainer.js";

export class HistoryLineItem extends View {
    constructor () {
        super();
        this.addEvents([
            "editLine"
        ]);
    }

    render () {
        const oNode = new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
            .appendNode(new DomElement("input")
                .setType("text")
                .setValue(this.getProperty("id"))
                .setDisabled()
            )
            .appendNode(new DomElement("input")
                .setType("date")
                .setValue(this.getProperty("date"))
                .setDisabled()
            )
            .appendNode(new DomElement("input")
                .setType("text")
                .setValue(this.getProperty("account"))
                .setDisabled()
            )
            .appendNode(new DomElement("input")
                .setType("number")
                .setValue(this.getProperty("value"))
                .setDisabled()
            )
            .appendNode(new DomElement("div")
                .setText(this.getProperty("edit"))
                .addEventHandler("click", this.onEditLine, this)
            )
            .getNode();

        return oNode;
    }

    onEditLine (oEvent) {
        oEvent.customData = {
            id: this.getProperty("id")
        };
        this.handleEvent("editLine", oEvent);
    }
};
