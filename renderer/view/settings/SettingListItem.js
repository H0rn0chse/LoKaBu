import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { FlexContainer } from "../common/FlexContainer.js";
import { DropdownItem } from "../common/DropdownItem.js";

export class SettingListItem extends View {
    constructor () {
        super();
        this.addEvents([
            "defaultChange",
            "nameChange",
            "selectChange"
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
                .setType("text")
                .setValue(this.getProperty("text"))
                .addEventHandler("change", this.onNameChange, this)
            );

        if (this.getProperty("select-value", true) !== null) {
            oDomElement.appendNode(new DomElement("select")
                .insertAggregation(this, "select", DropdownItem)
                .setValue(this.getProperty("select-value"))
                .addEventHandler("change", this.onSelectChange, this)
            );
        }

        oDomElement
            .appendNode(new DomElement("div")
                .setText(`${this.getProperty("default-trans")}: `)
            )
            .appendNode(new DomElement("input")
                .setType("radio")
                .setName("settings-select")
                .setChecked(this.getProperty("id") === this.getProperty("checked-id"))
                .addEventHandler("change", this.onDefaultChange, this)
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

    onDefaultChange (oEvent) {
        oEvent.customData = {
            id: this.getProperty("id"),
            checked: oEvent.target.checked
        };
        this.handleEvent("defaultChange", oEvent);
    }

    onNameChange (oEvent) {
        oEvent.customData = {
            id: this.getProperty("id"),
            checked: oEvent.target.value
        };
        this.handleEvent("nameChange", oEvent);
    }

    onSelectChange (oEvent) {
        oEvent.customData = {
            id: this.getProperty("id"),
            value: oEvent.target.value
        };
        this.handleEvent("selectChange", oEvent);
    }
};
