import { load } from "../../../assets/load.js";
import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { FlexContainer } from "../common/FlexContainer.js";
import { DropdownItem } from "../common/DropdownItem.js";

load.css("/renderer/view/detail/ReceiptDetail.css");

export class ReceiptDetail extends View {
    constructor () {
        super();
        this.addEvents([
            "accountChange",
            "dateChange",
            "storeChange"
        ]);
    }

    render () {
        const oBase = new FlexContainer("div", { flexDirection: "column", flexWrap: "nowrap" })
            .addClass("receipt-detail")
            // ID
            .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
                .appendNode(new DomElement("span")
                    .setText(`${this.getProperty("id-trans")}: `)
                )
                .appendNode(new DomElement("input")
                    .setDisabled()
                    .setValue(this.getProperty("id"))
                )
            )
            // Date
            .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
                .appendNode(new DomElement("span")
                    .setText(`${this.getProperty("date-trans")}: `)
                )
                .appendNode(new DomElement("input")
                    .setType("date")
                    .setValue(this.getProperty("date"))
                    .addEventListener("change", this.onDateChange, this)
                )
            )
            // Store
            .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
                .appendNode(new DomElement("span")
                    .setText(`${this.getProperty("store-trans")}: `)
                )
                .appendNode(new DomElement("select")
                    .insertAggregation(this, "stores", DropdownItem)
                    .setValue(this.getProperty("store"))
                    .addEventListener("change", this.onStoreChange, this)
                )
            )
            // Account
            .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
                .appendNode(new DomElement("span")
                    .setText(`${this.getProperty("account-trans")}: `)
                )
                .appendNode(new DomElement("select")
                    .insertAggregation(this, "accounts", DropdownItem)
                    .setValue(this.getProperty("account"))
                    .addEventListener("change", this.onAccountChange, this)
                )
            )
            // Comments
            .appendNode(new DomElement("textarea")
                .setRows(5)
                .setValue(this.getProperty("comment"))
            );

        return oBase.getNode();
    }

    onDateChange (oEvent) {
        oEvent.customData = {
            date: oEvent.target.value
        };
        this.handleEvent("dateChange", oEvent);
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
};
