import { View } from "../../../core/view/View.js";
import { DomElement } from "../../../core/view/DomElement.js";
import { FlexContainer } from "../../../core/view/FlexContainer.js";
import { DropdownItem } from "../../../core/view/DropdownItem.js";
import { loadCss } from "../../../core/common/Utils.js";

loadCss("/renderer/view/detail/ReceiptDetail.css");

export class ReceiptDetail extends View {
    constructor () {
        super();
        this.name = "ReceiptDetailView";
    }

    render () {
        const oBase = new FlexContainer("div", { flexDirection: "column", flexWrap: "nowrap" })
            .addClass("receipt-detail")
            .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap", justifyContent: "space-between" })
                .appendNode(new DomElement("div")
                    // ID
                    .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap", alignItems: "center" })
                        .appendNode(new DomElement("span")
                            .setText(`${this.getTranslation("id-i18n")}: ${this.getProperty("id")}`)
                        )
                    )
                    // Date
                    .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap", alignItems: "center" })
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
                    .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap", alignItems: "center" })
                        .appendNode(new DomElement("span")
                            .setText(`${this.getTranslation("store-i18n")}: `)
                        )
                        .appendNode(new DomElement("select")
                            .insertAggregation(this, "stores", DropdownItem, () => {})
                            .sortChildren()
                            .setValue(this.getProperty("store"))
                            .addEventListener("change", this.onStoreChange, this)
                        )
                    )
                    // Account
                    .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap", alignItems: "center" })
                        .appendNode(new DomElement("span")
                            .setText(`${this.getTranslation("account-i18n")}: `)
                        )
                        .appendNode(new DomElement("select")
                            .insertAggregation(this, "accounts", DropdownItem, () => {})
                            .sortChildren()
                            .setValue(this.getProperty("account"))
                            .addEventListener("change", this.onAccountChange, this)
                        )
                    )
                )
                .appendNode(new DomElement("div")
                    .appendNode(new DomElement("div")
                        .addClass("receipt-sum")
                        .setText(`${this.getProperty("sum")} €`)
                    )
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
