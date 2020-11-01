import { Filter } from "./common/Filter.js";
import { Enums } from "../Enums.js";
import { AccountModel } from "../model/AccountModel.js";
import { StoreModel } from "../model/StoreModel.js";
import { TypeModel } from "../model/TypeModel.js";
import { PersonModel } from "../model/PersonModel.js";
import { Binding } from "../common/Binding.js";

export class ReceiptListFilter extends Filter {
    constructor () {
        super();
        const Column = Enums.ColumnOptions;
        const Input = Enums.InputOptions;

        const oAccountBinding = new Binding(AccountModel, ["accounts"])
            .bindProperty("value", ["ID"])
            .bindProperty("i18n", ["DisplayName"]);
        const oStoreBinding = new Binding(StoreModel, ["stores"])
            .bindProperty("value", ["ID"])
            .bindProperty("i18n", ["DisplayName"]);
        const oTypeBinding = new Binding(TypeModel, ["types"])
            .bindProperty("value", ["ID"])
            .bindProperty("i18n", ["DisplayName"]);
        const oPersonBinding = new Binding(PersonModel, ["persons"])
            .bindProperty("value", ["ID"])
            .bindProperty("i18n", ["DisplayName"]);

        this.addOption("ID", "filter.ReceiptID", Column.Value, Input.Number);
        this.addOption("Date", "filter.ReceiptDate", Column.Value, Input.Date);
        this.addOption("Account", "filter.ReceiptAccount", Column.Value, Input.List, oAccountBinding);
        this.addOption("Store", "filter.ReceiptStore", Column.Value, Input.List, oStoreBinding);
        this.addOption("Comment", "filter.ReceiptComment", Column.Value, Input.Text);
        this.addOption("ReceiptSum", "filter.ReceiptValue", Column.Value, Input.Number);
        this.addOption("Types", "filter.LineTypes", Column.List, Input.List, oTypeBinding);
        this.addOption("Persons", "filter.LinePersons", Column.List, Input.List, oPersonBinding);
        this.addOption("LineValues", "filter.LineValues", Column.List, Input.Number);

        this.selectOption(0);

        this.requiredModels = [
            AccountModel,
            StoreModel,
            TypeModel,
            PersonModel
        ];
    }

    export () {
        const oResult = super.export();
        const oFilterOption = this.getSelectedOption();
        switch (oFilterOption.column) {
            case "LineValues":
            case "ReceiptSum":
                var fValue = parseFloat(oResult.value) || 0;
                fValue = (fValue * 100).toPrecision(10);
                oResult.value = parseInt(fValue, 10);
                break;
            default:
        }

        return oResult;
    }
}
