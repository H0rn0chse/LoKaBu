import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { FlexContainer } from "../common/FlexContainer.js";
import { loadCss } from "../../common/Utils.js";

loadCss("/renderer/view/history/HistoryLineItem.css");

export class HistoryLineItem extends View {
    constructor () {
        super();
        this.name = "HistoryLineItemView";

        this.addEvents([
            "editLine"
        ]);
    }

    render () {
        const oNode = new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap", justifyContent: "space-around" })
            .appendNode(new DomElement("div")
                .addClass("historyLineProperty")
                .setText(this.getProperty("id"))
            )
            .appendNode(new DomElement("div")
                .addClass("historyLineProperty")
                .setText(this.getProperty("date"))
            )
            .appendNode(new DomElement("div")
                .addClass("historyLineProperty")
                .setText(this.getProperty("account"))
            )
            .appendNode(new DomElement("div")
                .addClass("historyLineProperty")
                .setText(this.getProperty("value"))
            )
            .appendNode(new DomElement("div")
                .addClass("button")
                .setText(this.getProperty("edit"))
                .addEventListener("click", this.onEditLine, this)
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
