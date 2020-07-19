// import { load } from "../../../assets/load.js";
import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";

// load.css("/renderer/view/header/Header.css");

export class Analysis extends View {
    render () {
        const oNode = new DomElement("section")
            .addClass("analysis")
            .appendNode(new DomElement("p")
                .setText("analysis-section"))
            .getNode();

        return oNode;
    }
};
