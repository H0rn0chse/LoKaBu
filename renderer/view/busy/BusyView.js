import { View } from "../../../core/view/View.js";
import { DomElement } from "../../../core/view/DomElement.js";
import { loadCss } from "../../../core/common/Utils.js";
import { BusyIndicator } from "../../../core/view/BusyIndicator.js";

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
