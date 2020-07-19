// import { load } from "../../../assets/load.js";
import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";

// load.css("/renderer/view/header/Header.css");

export class Detail extends View {
    render () {
        const oNode = new DomElement("section")
            .addClass("detail")
            .appendNode(new DomElement("p")
                .setText("detail-section"))
            .getNode();

        return oNode;
    }
};
