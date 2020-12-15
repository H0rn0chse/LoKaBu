import { View } from "../../../core/view/View.js";
import { DomElement } from "../../../core/view/DomElement.js";
import { FlexContainer } from "../../../core/view/FlexContainer.js";

export class ToolsListItem extends View {
    constructor () {
        super();
        this.name = "ToolsListItem";
    }

    render () {
        const oNode = new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
            .addClass("tools-list-item")
            .addClass("cursorPointer")
            .addClass(this.getProperty("selected") ? "selected" : "")
            .appendNode(new DomElement("div")
                .setText(this.getTranslation("i18n"))
            )
            .addEventListener("click", this.onClick, this)
            .getNode();

        return oNode;
    }

    onClick (oEvent) {
        oEvent.customData = {
            id: this.getProperty("id")
        };

        this.handleEvent("nav", oEvent);
    }
};
