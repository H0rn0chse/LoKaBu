import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { LineDetailLine } from "./LineDetailLine.js";

export class LineDetail extends View {
    constructor () {
        super();
        this.addEvents([
            "lineAdd"
        ]);
    }

    render () {
        const oNode = new DomElement("div")
            .addClass("line-detail")
            .insertAggregation(this, "receiptLines", LineDetailLine, this.addGenericListenerToChild.bind(this))
            .appendNode(new DomElement("div")
                .setText("+")
                .addEventHandler("click", this.onLineAdd, this)
            )
            .getNode();

        return oNode;
    }

    addGenericListenerToChild (oChild) {
        oChild.addGenericListener(this);
    }

    onLineAdd (oEvent) {
        oEvent.customData = {};
        this.handleEvent("lineAdd", oEvent);
    }
};
