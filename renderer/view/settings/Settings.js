// import { load } from "../../../assets/load.js";
import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";

// load.css("/renderer/view/header/Header.css");

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
