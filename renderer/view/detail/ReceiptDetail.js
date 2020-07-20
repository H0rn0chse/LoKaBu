import { load } from "../../../assets/load.js";
import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { FlexContainer } from "../common/FlexContainer.js";
import { DropdownItem } from "../common/DropdownItem.js";

load.css("/renderer/view/detail/ReceiptDetail.css");

export class ReceiptDetail extends View {
    constructor () {
        super();
        this.addEvent("storeChange");
        this.addEvent("accountChange");
    }

    render () {
        const oBase = new FlexContainer("div", { flexDirection: "column", flexWrap: "nowrap" })
            .addClass("receipt-detail")
            // ID
            .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
                .appendNode(new DomElement("span")
                    .setText(`${this.getProperty("id-translation")}: `)
                )
                .appendNode(new DomElement("input")
                    .setDisabled()
                    .setValue(this.getProperty("id"))
                )
            )
            // Date
            .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
                .appendNode(new DomElement("span")
                    .setText(`${this.getProperty("date-translation")}: `)
                )
                .appendNode(new DomElement("input")
                    .setType("date")
                    .setValue(this.getProperty("date"))
                )
            )
            // Store
            .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
                .appendNode(new DomElement("span")
                    .setText(`${this.getProperty("store-translation")}: `)
                )
                .appendNode(new DomElement("select")
                    .insertAggregation(this, "stores", DropdownItem)
                    .setId("store")
                    .setValue(this.getProperty("store"))
                    .addEventHandler("change", this.onStoreChange, this)
                )
            )
            // Account
            .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
                .appendNode(new DomElement("span")
                    .setText(`${this.getProperty("account-translation")}: `)
                )
                .appendNode(new DomElement("select")
                    .insertAggregation(this, "accounts", DropdownItem)
                    .setId("account")
                    .setValue(this.getProperty("account"))
                    .addEventHandler("change", this.onAccountChange, this)
                )
            )
            // Comments
            .appendNode(new DomElement("textarea")
                .setRows(5)
                .setValue(this.getProperty("comment"))
            );

        return oBase.getNode();
    }

    onStoreChange (oEvent) {
        oEvent.customData = {
            store: this.getValueById("store")
        };
        this.handleEvent("storeChange", oEvent);
    }

    onAccountChange (oEvent) {
        oEvent.customData = {
            account: this.getValueById("account")
        };
        this.handleEvent("accountChange", oEvent);
    }

};
