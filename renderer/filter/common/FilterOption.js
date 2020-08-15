import { Enums } from "../../Enums.js";
import { objectGet } from "../../common/Utils.js";

export class FilterOption {
    constructor (sColumn, sI18n, sColumnType, sInputType, oBinding) {
        this.column = sColumn;
        this.i18n = sI18n;
        this.columnType = sColumnType;
        this.inputType = sInputType;
        this.binding = oBinding;

        this.reset();
    }

    reset () {
        this.columnOption = objectGet(this.getColumnOptions(), [0, "value"]);
        this.inputOption = objectGet(this.getInputOptions(), [0, "value"]);
        this.value = "";
    }

    export () {
        const oColumnOption = this.getColumnOptions().find(oOption => {
            return oOption.value === this.columnOption;
        });
        const oInputOption = this.getInputOptions().find(oOption => {
            return oOption.value === this.inputOption;
        });
        return {
            column: this.column,
            columnOption: oColumnOption || {},
            inputOption: oInputOption || {},
            inputType: this.inputType,
            value: this.value || ""
        };
    }

    getColumnOptions () {
        switch (this.columnType) {
            case Enums.ColumnOptions.List:
                return [
                    {
                        value: "all",
                        i18n: "filter.all"
                    }, {
                        value: "none",
                        i18n: "filter.none"
                    }, {
                        value: "atLeastOne",
                        i18n: "filter.atLeastOne"
                    }
                ];
            default:
                return [];
        }
    }

    getInputOptions () {
        switch (this.inputType) {
            case Enums.InputOptions.Text:
                return [
                    {
                        value: "equal",
                        i18n: "filter.equal",
                        sql: "="
                    }, {
                        value: "unequal",
                        i18n: "filter.unequal",
                        sql: "!="
                    }, {
                        value: "contains",
                        i18n: "filter.contains",
                        sql: "like"
                    }, {
                        value: "contains not",
                        i18n: "filter.containsNot",
                        sql: "not like"
                    }
                ];
            case Enums.InputOptions.Number:
                return [
                    {
                        value: "equal",
                        i18n: "filter.equal",
                        sql: "="
                    }, {
                        value: "unequal",
                        i18n: "filter.unequal",
                        sql: "!="
                    }, {
                        value: "greater",
                        i18n: "filter.greater",
                        sql: ">"
                    }, {
                        value: "smaller",
                        i18n: "filter.smaller",
                        sql: "<"
                    }
                ];
            case Enums.InputOptions.Date:
                return [
                    {
                        value: "equal",
                        i18n: "filter.equal",
                        sql: "="
                    }, {
                        value: "unequal",
                        i18n: "filter.unequal",
                        sql: "!="
                    }, {
                        value: "before",
                        i18n: "filter.before",
                        sql: "<"
                    }, {
                        value: "after",
                        i18n: "filter.after",
                        sql: ">"
                    }
                ];
            case Enums.InputOptions.List:
                return [
                    {
                        value: "equal",
                        i18n: "filter.equal",
                        sql: "="
                    }, {
                        value: "unequal",
                        i18n: "filter.unequal",
                        sql: "!="
                    }
                ];
            default:
                return [];
        }
    }

    getValueOptions () {
        return this.binding.get();
    }
}
