// import { load } from "../../../assets/load.js";
import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { FlexContainer } from "../common/FlexContainer.js";
import { DropdownItem } from "../common/DropdownItem.js";

// load.css("/renderer/view/header/Header.css");

export class ReceiptDetail extends View {
    constructor () {
        super();
        this.addEvent("storeChange");
    }

    render () {
        const oBase = new FlexContainer("div", { flexDirection: "column", flexWrap: "nowrap" })
            .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
                .appendNode(new DomElement("span")
                    .setText(this.getProperty("id-translation"))
                )
                .appendNode(new DomElement("input")
                    .setValue(this.getProperty("id"))
                )
            )
            .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
                .appendNode(new DomElement("span")
                    .setText(this.getProperty("store-translation"))
                )
                .appendNode(new DomElement("select")
                    .insertAggregation(this, "stores", DropdownItem)
                    .setId("store")
                    .setValue(this.getProperty("store"))
                    .addEventHandler("change", this.onStoreChange, this)
                )
            );

        return oBase.getNode();
    }

    onStoreChange (oEvent) {
        oEvent.customData = {
            store: this.getValueById("store")
        };
        this.handleEvent("storeChange", oEvent);
    }

};
