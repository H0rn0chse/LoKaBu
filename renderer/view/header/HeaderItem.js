import { load } from "../../common/Load.js";
import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";

load.css("/renderer/view/header/HeaderItem.css");
load.css("/renderer/view/common/Text.css");

export class HeaderItem extends View {
    constructor () {
        super();
        this.name = "HeaderItemView";

        this.addEvents([
            "click"
        ]);
    }

    getPropertyDefault (sProperty) {
        const oPropertyDefaults = {
            section: "section",
            "title-i18n": ["common.default"]
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
                .setText(this.getTranslation("title-i18n"))
            )
            .addClass(this.getProperty("selected") ? "selected" : "")
            .getNode();

        return oNode;
    }
};
