import { Filter } from "./common/Filter.js";
import { Enums } from "../Enums.js";
import { AccountModel } from "../model/AccountModel.js";
import { StoreModel } from "../model/StoreModel.js";
import { TypeModel } from "../model/TypeModel.js";
import { PersonModel } from "../model/PersonModel.js";
import { Binding } from "../common/Binding.js";

export class ReceiptAnalysisFilter extends Filter {
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

        this.addOption("SourceAccount", "filter.ReceiptAccount", Column.Value, Input.List, oAccountBinding);
        this.addOption("Store", "filter.ReceiptStore", Column.Value, Input.List, oStoreBinding);
        this.addOption("Comment", "filter.ReceiptComment", Column.Value, Input.Text);
        this.addOption("Type", "common.billingType", Column.Value, Input.List, oTypeBinding);
        this.addOption("Person", "common.billingAccount", Column.Value, Input.List, oPersonBinding);

        this.selectOption(0);

        this.requiredModels = [
            AccountModel,
            StoreModel,
            TypeModel,
            PersonModel
        ];
    }
}
