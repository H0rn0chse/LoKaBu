import { View } from "../../../core/view/View.js";
import { DomElement } from "../../../core/view/DomElement.js";
import { loadCss } from "../../../core/common/Utils.js";

loadCss("/renderer/view/header/HeaderItem.css");
loadCss("/renderer/view/common/Text.css");

export class HeaderItem extends View {
    constructor () {
        super();
        this.name = "HeaderItemView";
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
