import { View } from "../../../core/view/View.js";
import { DomElement } from "../../../core/view/DomElement.js";
import { LineDetailLine } from "./LineDetailLine.js";
import { loadCss } from "../../../core/common/Utils.js";
import { Icon } from "../../../core/view/Icon.js";
import { FlexContainer } from "../../../core/view/FlexContainer.js";

loadCss("/renderer/view/detail/LineDetail.css");
export class LineDetail extends View {
    constructor () {
        super();
        this.name = "LineDetailView";
    }

    render () {
        const oNode = new DomElement("div")
            .addClass("line-detail")
            .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap", alignItems: "center" })
                .addClass("line-bulk-actions")
                .appendNode(new Icon("check-square")
                    .addClass("cursorPointer")
                    .addEventListener("click", this.onSelectAll, this)
                )
                .appendNode(new Icon("square")
                    .addClass("cursorPointer")
                    .addEventListener("click", this.onUnselectAll, this)
                )
                .appendNode(new DomElement("div")
                    .setText(this.getTranslation("bulk-i18n"))
                    .addClass("button")
                    .addEventListener("click", this.onBulkAction, this)
                )
            )
            .appendNode(new DomElement("div")
                .addClass("line-box")
                .appendNode(new DomElement("div")
                    .addClass("line-detail-scroll")
                    .insertAggregation(this, "receiptLines", LineDetailLine, this._addLineItemEventHandler.bind(this))
                )
                .appendNode(new Icon("plus-circle")
                    .addClass("cursorPointer")
                    .addEventListener("click", this.onLineAdd, this)
                )
            )
            .getNode();

        return oNode;
    }

    _addLineItemEventHandler (oItem) {
        oItem
            .addEventListener("lineChange", this.onLineChange, this)
            .addEventListener("lineSelect", this.onLineSelect, this)
            .addEventListener("lineRemove", this.onLineRemove, this);
    }

    onLineChange (oEvent) {
        oEvent.customData.receipt = this.getProperty("id");
        this.handleEvent("lineChange", oEvent);
    }

    onLineSelect (oEvent) {
        this.handleEvent("lineSelect", oEvent);
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

    onSelectAll (oEvent) {
        this.handleEvent("selectAll", oEvent);
    }

    onUnselectAll (oEvent) {
        this.handleEvent("unselectAll", oEvent);
    }

    onBulkAction (oEvent) {
        this.handleEvent("bulkAction", oEvent);
    }
};
