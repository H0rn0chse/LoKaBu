import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { LineDetailLine } from "./LineDetailLine.js";

export class LineDetail extends View {
    constructor () {
        super();
        this.addEvents([
            "lineAdd",
            "lineChange"
        ]);
    }

    render () {
        const oNode = new DomElement("div")
            .addClass("line-detail")
            .insertAggregation(this, "receiptLines", LineDetailLine, this._addLineItemEventHandler.bind(this))
            .appendNode(new DomElement("div")
                .setText("+")
                .addEventListener("click", this.onLineAdd, this)
            )
            .getNode();

        return oNode;
    }

    _addLineItemEventHandler (oItem) {
        oItem
            .addEventListener("lineChange", this.onLineChange, this)
            .addEventListener("lineRemove", this.onLineRemove, this);
    }

    onLineChange (oEvent) {
        oEvent.customData.receipt = this.getProperty("id");
        this.handleEvent("lineChange", oEvent);
    }

    onLineRemove (oEvent) {
        this.handleEvent("lineRemove", oEvent);
    }

    onLineAdd (oEvent) {
        oEvent.customData = {
            id: this.getProperty("id")
        };
        this.handleEvent("lineAdd", oEvent);
    }
};
