import { FilterOption } from "./FilterOption.js";

export class Filter {
    constructor () {
        this.options = [];
        this.requiredModels = [];
    }

    addOption (sColumn, sI18n, sColumnType, sInputType, oBinding) {
        this.options.push(new FilterOption(sColumn, sI18n, sColumnType, sInputType, oBinding));
    }

    getOptionList () {
        return this.options.map(oFilterOption => {
            return {
                value: oFilterOption.column,
                i18n: oFilterOption.i18n
            };
        });
    }

    selectOption (vId) {
        if (typeof vId !== "number") {
            vId = this.options.findIndex(oItem => {
                return oItem.column === vId;
            });
        }
        if (vId > -1) {
            this.selected = vId;
            this.getSelectedOption()
                .reset();
        }
    }

    getColumnOptionList () {
        return this.getSelectedOption()
            .getColumnOptions();
    }

    getColumnOption () {
        return this.getSelectedOption().columnOption;
    }

    setColumnOption (vValue) {
        const oFilterOption = this.getSelectedOption();
        oFilterOption.columnOption = vValue;
    }

    getInputOptionList () {
        return this.getSelectedOption()
            .getInputOptions();
    }

    getInputOption () {
        return this.getSelectedOption().inputOption;
    }

    setInputOption (vValue) {
        const oFilterOption = this.getSelectedOption();
        oFilterOption.inputOption = vValue;
    }

    getValue () {
        return this.getSelectedOption().value;
    }

    setValue (vValue) {
        const oFilterOption = this.getSelectedOption();
        oFilterOption.value = vValue;
    }

    getValueType () {
        return this.getSelectedOption().inputType;
    }

    getSelectedOption () {
        return this.options[this.selected];
    }

    getRequiredModels () {
        return this.requiredModels;
    }

    getValueOptions () {
        return this.getSelectedOption()
            .getValueOptions();
    }

    export () {
        return this.getSelectedOption()
            .export();
    }
}
