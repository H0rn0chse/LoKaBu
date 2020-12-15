import { View } from "../../../core/view/View.js";
import { DomElement } from "../../../core/view/DomElement.js";
import { FlexContainer } from "../../../core/view/FlexContainer.js";
import { DropdownItem } from "../../../core/view/DropdownItem.js";
import { Icon } from "../../../core/view/Icon.js";

export class SettingsListItem extends View {
    constructor () {
        super();
        this.name = "SettingsListItemView";
    }

    render () {
        const oDomElement = new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap", justifyContent: "space-around" })
            .addClass("settingsListItem")
            .appendNode(new DomElement("div")
                .setText(this.getProperty("id"))
            )
            .appendNode(new DomElement("input")
                .setId("text")
                .setType("text")
                .setValue(this.getProperty("text"))
                .addEventListener("change", this.onListEntryChange, this)
            );

        if (this.getProperty("select-value", true) !== null) {
            oDomElement.appendNode(new DomElement("select")
                .setId("select")
                .insertAggregation(this, "select", DropdownItem, () => {})
                .sortChildren()
                .setValue(this.getProperty("select-value"))
                .addEventListener("change", this.onListEntryChange, this)
            );
        }

        oDomElement
            .appendNode(new DomElement("div")
                .setText(`${this.getTranslation("default-i18n")}: `)
            )
            .appendNode(new DomElement("input")
                .setId("default")
                .setType("radio")
                .setName("settings-select")
                .setChecked(this.getProperty("id") === this.getProperty("checked-id"))
                .addEventListener("change", this.onListEntryChange, this)
            )
            .appendNode(new Icon("trash-2")
                .addClass("cursorPointer")
                .addEventListener("click", this.onListEntryDelete, this)
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

    onListEntryDelete (oEvent) {
        oEvent.customData = {
            id: this.getProperty("id")
        };
        this.handleEvent("listEntryDelete", oEvent);
    }
};
