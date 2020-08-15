import { View } from "../../view/common/View.js";
import { FlexContainer } from "../../view/common/FlexContainer.js";
import { DomElement } from "../../view/common/DomElement.js";
import { Enums } from "../../Enums.js";

export class FilterView extends View {
    constructor (...args) {
        super(...args);
        this.name = "FilterView";
    }

    render () {
        const oFilter = this.getProperty();
        oFilter.getRequiredModels().forEach(oModel => {
            this.addModel(oModel, oModel.getName());
        });

        const oElement = new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
            .appendNode(new DomElement("select")
                .insertTemplate(this._insertOptions.bind(this), oFilter.getOptionList())
                .setValue(oFilter.getSelectedOption().column)
                .addEventListener("change", this.onUpdateFilter, this)
            );

        if (oFilter.getColumnOptionList().length > 0) {
            oElement.appendNode(new DomElement("select")
                .insertTemplate(this._insertOptions.bind(this), oFilter.getColumnOptionList())
                .setValue(oFilter.getColumnOption())
                .addEventListener("change", this.onUpdateColumnOption, this)
            );
        }

        oElement.appendNode(new DomElement("select")
            .insertTemplate(this._insertOptions.bind(this), oFilter.getInputOptionList())
            .setValue(oFilter.getInputOption())
            .addEventListener("change", this.onUpdateInputOption, this)
        );

        if (oFilter.getValueType() !== Enums.InputOptions.List) {
            oElement.appendNode(new DomElement("input")
                .setType(oFilter.getValueType())
                .setValue(oFilter.getValue())
                .addEventListener("change", this.onUpdateValue, this)
            );
        } else {
            oElement.appendNode(new DomElement("select")
                .insertTemplate(this._insertOptions.bind(this), oFilter.getValueOptions())
                .setValue(oFilter.getValue())
                .addEventListener("change", this.onUpdateValue, this)
            );
        }

        oElement.appendNode(new DomElement("div")
            .addClass("buttonCircle")
            .setText("-")
            .addEventListener("click", this.onDeleteFilter, this)
        );

        return oElement.getNode();
    }

    _insertOptions (oDomElement, aItems) {
        aItems.forEach(oItem => {
            oDomElement.appendNode(new DomElement("option")
                .setText(this.getTranslation([oItem.i18n]))
                .setValue(oItem.value)
            );
        });
    }

    onUpdateFilter (oEvent) {
        const oFilter = this.getProperty();
        oFilter.selectOption(oEvent.target.value);
        this.handleEvent("updateFilter", oEvent);
    }

    onUpdateColumnOption (oEvent) {
        const oFilter = this.getProperty();
        oFilter.setColumnOption(oEvent.target.value);
        this.handleEvent("updateFilter", oEvent);
    }

    onUpdateInputOption (oEvent) {
        const oFilter = this.getProperty();
        oFilter.setInputOption(oEvent.target.value);
        this.handleEvent("updateFilter", oEvent);
    }

    onUpdateValue (oEvent) {
        const oFilter = this.getProperty();
        oFilter.setValue(oEvent.target.value);
        this.handleEvent("updateFilter", oEvent);
    }

    onDeleteFilter (oEvent) {
        const aPath = this.getBindingContext().path;
        oEvent.customData = {
            id: aPath[aPath.length - 1]
        };
        this.handleEvent("deleteFilter", oEvent);
    }
}