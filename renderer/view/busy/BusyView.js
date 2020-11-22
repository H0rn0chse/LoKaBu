import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { loadCss } from "../../common/Utils.js";
import { BusyIndicator } from "../common/BusyIndicator.js";

loadCss("/renderer/view/busy/BusyView.css");

export class BusyView extends View {
    render () {
        const oNode = new DomElement("div")
            .addClass("busy")
            .appendNode(new DomElement("div")
                .addClass("busy-center")
                .appendNode(new BusyIndicator())
            )
            .getNode();

        return oNode;
    }
};
