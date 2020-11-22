import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { FlexContainer } from "../common/FlexContainer.js";
import { loadCss } from "../../common/Utils.js";
import { DuplicateListItem } from "./DuplicateListItem.js";
import { DuplicateReceipt } from "./DuplicateReceipt.js";

loadCss("/renderer/view/tools/DuplicateView.css");
export class DuplicateView extends View {
    constructor () {
        super();
        this.name = "DuplicateView";
    }

    render () {
        const oNode = new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap", height: "100%" })
            .addClass("duplicate-view")
            .appendNode(new DomElement("div")
                .addClass("duplicate-list")
                .appendNode(new DomElement("div")
                    .addClass("button")
                    .setText(this.getTranslation("findDuplicates-i18n"))
                    .addEventListener("click", this.onDuplicateFind, this)
                )
                .appendNode(new DomElement("div")
                    .addClass("duplicate-list-scroll")
                    .insertAggregation(this, "duplicates", DuplicateListItem)
                )
            )
            .appendNode(new DomElement("div")
                .addClass("duplicate-preview")
                .appendNode(new DomElement("div")
                    .setText(this.getTranslation("hint-i18n"))
                )
                .appendNode(new DomElement("div")
                    .addClass("button")
                    .setText(this.getTranslation("confirm-i18n"))
                    .addEventListener("click", this.onDuplicateConfirm, this)
                    .removeIf(!this.getProperty("selectedDuplicate"))
                )
                .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
                    .addClass("duplicate-receipt-scroll")
                    .insertAggregation(this, "duplicateData", DuplicateReceipt)
                )
            )
            .getNode();

        return oNode;
    }

    onDuplicateFind (oEvent) {
        this.handleEvent("duplicateFind", oEvent);
    }

    onDuplicateConfirm (oEvent) {
        oEvent.customData = {
            confirm: this.getTranslation("confirmMessage-i18n")
        };
        this.handleEvent("duplicateConfirm", oEvent);
    }
};
