import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { LineDetailLine } from "./LineDetailLine.js";
import { loadCss } from "../../common/Utils.js";
import { Icon } from "../common/Icon.js";
import { FlexContainer } from "../common/FlexContainer.js";

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
            .addEventListener("lineRemove", this.onLineRemove, this)
            .addEventListener("lineEnter", this.onLineEnter, this);
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

    onLineEnter (oEvent) {
        const oParentNode = this.getNode();

        if (oParentNode) {
            const bForward = oEvent.customData.forward;
            let bLineWasSelected = false;
            const aNodes = oParentNode.querySelectorAll(".line-detail-line");

            aNodes.forEach((oNode, iIndex) => {
                if (bLineWasSelected) {
                    return;
                }
                if (oNode === oEvent.customData.node) {
                    bLineWasSelected = true;
                    const oNextNode = aNodes[iIndex + 1];
                    const oPrevNode = aNodes[iIndex - 1];
                    const oFirstNode = aNodes[0];
                    const oLastNode = aNodes[aNodes.length - 1];
                    if (bForward) {
                        if (oNextNode) {
                            oNextNode.querySelector(`[id^="value-"]`).focus();
                        } else if (oFirstNode) {
                            oFirstNode.querySelector(`[id^="value-"]`).focus();
                        }
                    } else {
                        if (oPrevNode) {
                            oPrevNode.querySelector(`[id^="value-"]`).focus();
                        } else if (oLastNode) {
                            oLastNode.querySelector(`[id^="value-"]`).focus();
                        }
                    }
                }
            });
        }
    }
};
