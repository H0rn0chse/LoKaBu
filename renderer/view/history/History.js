// import { load } from "../../../assets/load.js";
import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";

// load.css("/renderer/view/header/Header.css");

export class History extends View {
    render () {
        const oNode = new DomElement("section")
            .addClass("history")
            .appendNode(new DomElement("p")
                .setText("history-section"))
            .getNode();

        return oNode;
    }
};
