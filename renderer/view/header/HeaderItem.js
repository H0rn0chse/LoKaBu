import { load } from "../../../assets/load.js";
import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";

load.css("/renderer/view/header/HeaderItem.css");
load.css("/renderer/view/common/Text.css");

export class HeaderItem extends View {
    constructor () {
        super();
        this.addEvent("click");
    }

    getPropertyDefault (sProperty) {
        const oPropertyDefaults = {
            section: "section",
            text: "defaultSection",
            i18n: "default"
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
            .setEventHandler("click", this.onClick.bind(this))
            .appendNode(new DomElement("p")
                .addClass("unselectable")
                .setText(this.getProperty("text"))
            );
        if (this.getProperty("selected")) {
            oNode.addClass("selected");
        }
        return oNode.getNode();
    }
};
