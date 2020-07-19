// import { load } from "../../../assets/load.js";
import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";

// load.css("/renderer/view/header/Header.css");

export class ReceiptDetail extends View {
    render () {
        const oNode = new DomElement("section")
            .addClass("detail")
            .appendNode(new DomElement("div")
                .setText("receiptdetail"))
            .getNode();

        return oNode;
    }
};
