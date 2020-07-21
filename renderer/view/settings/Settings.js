import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";

export class Settings extends View {
    render () {
        const oNode = new DomElement("section")
            .addClass("settings")
            .appendNode(new DomElement("p")
                .setText("settings-section"))
            .getNode();

        return oNode;
    }
};
