import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { FlexContainer } from "../common/FlexContainer.js";
import { DropdownItem } from "../common/DropdownItem.js";

export class SettingListItem extends View {
    constructor () {
        super();
        this.addEvents([
            "listEntryChange"
        ]);
    }

    render () {
        const oDomElement = new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
            .appendNode(new DomElement("input")
                .setType("text")
                .setValue(this.getProperty("id"))
                .setDisabled()
            )
            .appendNode(new DomElement("input")
                .setId("text")
                .setType("text")
                .setValue(this.getProperty("text"))
                .addEventListener("change", this.onListEntryChange, this)
            );

        if (this.getProperty("select-value", true) !== null) {
            oDomElement.appendNode(new DomElement("select")
                .insertAggregation(this, "select", DropdownItem)
                .setValue(this.getProperty("select-value"))
                .addEventListener("change", this.onListEntryChange, this)
            )
                .setId("select");
        }

        oDomElement
            .appendNode(new DomElement("div")
                .setText(`${this.getProperty("default-trans")}: `)
            )
            .appendNode(new DomElement("input")
                .setId("default")
                .setType("radio")
                .setName("settings-select")
                .setChecked(this.getProperty("id") === this.getProperty("checked-id"))
                .addEventListener("change", this.onListEntryChange, this)
            );
        return oDomElement.getNode();
    }

    getPropertyDefault (sProperty) {
        switch (sProperty) {
            case "select-value":
                return null;
            default:
                return "";
        }
    }

    onListEntryChange (oEvent) {
        oEvent.customData = {
            id: this.getProperty("id"),
            name: this.getNodeById("text").value,
            select: this.getNodeById("select").value,
            default: this.getNodeById("default").checked
        };
        this.handleEvent("listEntryChange", oEvent);
    }
};
