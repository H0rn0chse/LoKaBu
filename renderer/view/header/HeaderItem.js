import { load } from "../../../assets/load.js";
import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";

load.css("/renderer/view/header/HeaderItem.css");
load.css("/renderer/view/common/Text.css");

export class HeaderItem extends View {
    constructor () {
        super();
        this.addEvents([
            "click"
        ]);
    }

    getPropertyDefault (sProperty) {
        const oPropertyDefaults = {
            section: "section",
            "title-trans": "defaultSection",
            "title-i18n": "default"
        };
        return oPropertyDefaults[sProperty];
    }

    onClick (oEvent) {
        oEvent.customData = {
            section: this.getProperty("section")
        };
        this.handleEvent("click", oEvent);
    }

    render () {
        const oNode = new DomElement("div")
            .addClass("HeaderItem")
            .addEventListener("click", this.onClick, this)
            .appendNode(new DomElement("p")
                .addClass("unselectable")
                .setText(this.getProperty("title-trans"))
            )
            .addClass(this.getProperty("selected") ? "selected" : "")
            .getNode();

        return oNode;
    }
};
