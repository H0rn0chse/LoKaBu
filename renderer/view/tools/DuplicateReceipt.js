import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { FlexContainer } from "../common/FlexContainer.js";
import { AccountModel } from "../../model/AccountModel.js";
import { StoreModel } from "../../model/StoreModel.js";

export class DuplicateReceipt extends View {
    constructor () {
        super();
        this.name = "DuplicateReceipt";
    }

    render () {
        const sAccount = AccountModel.get(["accounts", { ID: this.getProperty("account") }, "DisplayName"]);
        const sStore = StoreModel.get(["stores", { ID: this.getProperty("store") }, "DisplayName"]);
        const oNode = new FlexContainer("div", { flexDirection: "column", flexWrap: "nowrap" })
            .addClass("duplicate-receipt")
            .appendNode(new DomElement("div")
                .addClass("button")
                .setText(this.getProperty("delete-trans"))
                .addEventListener("click", this.onClick, this)
            )
            .appendNode(new DomElement("div")
                .addClass("duplicate-receipt-id")
                .setSelectable(true)
                .setHTML(`<b>${this.getProperty("id-trans")}:</b> ${this.getProperty("id")}`)
            )
            .appendNode(new DomElement("div")
                .setHTML(`<b>${this.getProperty("date-trans")}:</b> ${this.getProperty("date")}`)
            )
            .appendNode(new DomElement("div")
                .setHTML(`<b>${this.getProperty("account-trans")}:</b> ${sAccount}`)
            )
            .appendNode(new DomElement("div")
                .setHTML(`<b>${this.getProperty("store-trans")}:</b> ${sStore}`)
            )
            .appendNode(new DomElement("div")
                .addClass("duplicate-receipt-sum")
                .setHTML(`<b>${this.getProperty("sum-trans")}:</b> ${this.getProperty("sum")} €`)
            )
            .appendNode(new DomElement("div")
                .addClass("duplicate-receipt-lines")
                .setHTML(`<b>${this.getProperty("lines-trans")}:</b>`)
            )
            .insertTemplate(this.getLineItems, this.getProperty("lines"))
            .appendNode(new DomElement("div")
                .addClass("duplicate-receipt-comment")
                .setSelectable(true)
                .setText(this.getProperty("comment"))
            )
            .getNode();

        return oNode;
    }

    getLineItems (oNode, aList) {
        const oList = new DomElement("ul");
        aList.forEach(sValue => {
            oList.appendNode(new DomElement("li")
                .setText(sValue)
            );
        });
        return oNode.appendNode(oList);
    }

    onClick (oEvent) {
        oEvent.customData = {
            id: this.getProperty("id")
        };
        this.handleEvent("deleteDuplicate", oEvent);
    }
};
