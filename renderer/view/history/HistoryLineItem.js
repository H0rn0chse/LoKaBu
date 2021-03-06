import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { FlexContainer } from "../common/FlexContainer.js";
import { loadCss } from "../../common/Utils.js";
import { Icon } from "../common/Icon.js";
import { UnixToInput } from "../../common/DateUtils.js";

loadCss("/renderer/view/history/HistoryLineItem.css");

export class HistoryLineItem extends View {
    constructor () {
        super();
        this.name = "HistoryLineItemView";
    }

    render () {
        const oNode = new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap", justifyContent: "space-around", alignItems: "baseline" })
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
                .addClass("historyLineProperty")
                .setText(UnixToInput(this.getProperty("created")))
            )
            .appendNode(new DomElement("div")
                .addClass("historyLineProperty")
                .setText(UnixToInput(this.getProperty("updated")))
            )
            .appendNode(new Icon("edit")
                .addClass("cursorPointer")
                .addEventListener("click", this.onEditLine, this)
            )
            .appendNode(new Icon("trash-2")
                .addClass("cursorPointer")
                .addEventListener("click", this.onDeleteLine, this)
            )
            .getNode();

        return oNode;
    }

    onDeleteLine (oEvent) {
        oEvent.customData = {
            id: this.getProperty("id")
        };
        this.handleEvent("deleteLine", oEvent);
    }

    onEditLine (oEvent) {
        oEvent.customData = {
            id: this.getProperty("id")
        };
        this.handleEvent("editLine", oEvent);
    }
};
