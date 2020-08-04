import { load } from "../../common/Load.js";
import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { FlexContainer } from "../common/FlexContainer.js";
import { DropdownItem } from "../common/DropdownItem.js";

load.css("/renderer/view/detail/ReceiptDetail.css");

export class ReceiptDetail extends View {
    constructor () {
        super();
        this.name = "ReceiptDetailView";

        this.addEvents([
            "accountChange",
            "dateChange",
            "storeChange",
            "commentChange"
        ]);
    }

    render () {
        const oBase = new FlexContainer("div", { flexDirection: "column", flexWrap: "nowrap" })
            .addClass("receipt-detail")
            // ID
            .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
                .appendNode(new DomElement("span")
                    .setText(`${this.getTranslation("id-i18n")}: ${this.getProperty("id")}`)
                )
            )
            // Date
            .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
                .appendNode(new DomElement("span")
                    .setText(`${this.getTranslation("date-i18n")}: `)
                )
                .appendNode(new DomElement("input")
                    .setType("date")
                    .setValue(this.getProperty("date"))
                    .addEventListener("focusout", this.onDateChange, this)
                )
            )
            // Store
            .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
                .appendNode(new DomElement("span")
                    .setText(`${this.getTranslation("store-i18n")}: `)
                )
                .appendNode(new DomElement("select")
                    .insertAggregation(this, "stores", DropdownItem)
                    .setValue(this.getProperty("store"))
                    .sortChildren()
                    .addEventListener("change", this.onStoreChange, this)
                )
            )
            // Account
            .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
                .appendNode(new DomElement("span")
                    .setText(`${this.getTranslation("account-i18n")}: `)
                )
                .appendNode(new DomElement("select")
                    .insertAggregation(this, "accounts", DropdownItem)
                    .setValue(this.getProperty("account"))
                    .sortChildren()
                    .addEventListener("change", this.onAccountChange, this)
                )
            )
            // Comments
            .appendNode(new DomElement("textarea")
                .setRows(5)
                .setValue(this.getProperty("comment"))
                .addEventListener("change", this.onCommentChange, this)
            );

        return oBase.getNode();
    }

    onDateChange (oEvent) {
        if (this.getProperty("date") !== oEvent.target.value) {
            oEvent.customData = {
                date: oEvent.target.value
            };
            this.handleEvent("dateChange", oEvent);
        }
        oEvent.preventDefault();
        oEvent.stopImmediatePropagation();
    }

    onStoreChange (oEvent) {
        oEvent.customData = {
            store: oEvent.target.value
        };
        this.handleEvent("storeChange", oEvent);
    }

    onAccountChange (oEvent) {
        oEvent.customData = {
            account: oEvent.target.value
        };
        this.handleEvent("accountChange", oEvent);
    }

    onCommentChange (oEvent) {
        oEvent.customData = {
            comment: oEvent.target.value
        };
        this.handleEvent("commentChange", oEvent);
    }
};
