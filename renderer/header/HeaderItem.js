import { load } from "../../assets/load.js";
import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";

load.css("/renderer/header/HeaderItem.css");

export class HeaderItem extends View {
    getPropertyDefault (sProperty) {
        const oPropertyDefaults = {
            section: "section",
            text: "defaultSection"
        };
        return oPropertyDefaults[sProperty];
    }

    render () {
        const oNode = new DomElement("div")
            .addClass("HeaderItem")
            .appendNode(new DomElement("p")
                .setData("section", this.getProperty("section"))
                .setText(this.getProperty("text"))
            );
        return oNode.getNode();
    }
};
