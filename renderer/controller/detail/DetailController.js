import { Controller } from "../common/Controller.js";
import { Detail } from "../../view/detail/Detail.js";
import { EventBus } from "../../EventBus.js";
import { AccountModel } from "../../model/database/AccountModel.js";
import { StoreModel } from "../../model/database/StoreModel.js";
import { PersonModel } from "../../model/database/PersonModel.js";
import { TypeModel } from "../../model/database/TypeModel.js";
import { LanguageModel } from "../../model/database/LanguageModel.js";
import { DetailModel } from "../../model/view/DetailModel.js";
import { Aggregation } from "../../common/Aggregation.js";

export class DetailController extends Controller {
    constructor (oDomRef) {
        super(oDomRef);

        const oDetail = new Detail();
        const oDetailContainer = this.createContainer("detail")
            .setContent(oDetail);

        oDetail.setParent(oDetailContainer.getNode())
            .addModel(DetailModel, "viewModel")
            .addModel(AccountModel, "account")
            .addModel(StoreModel, "store")
            .addModel(PersonModel, "person")
            .addModel(TypeModel, "type")
            .addModel(LanguageModel, "lang");

        // detail base view
        oDetail
            .bindProperty("save-i18n", "viewModel", ["save-i18n"])
            .bindProperty("save-trans", "lang", "save-i18n");

        // ReceiptDetail
        oDetail
            .bindProperty("id-i18n", "viewModel", ["id-i18n"])
            .bindProperty("id-trans", "lang", "id-i18n")
            .bindProperty("id", "viewModel", ["id"])
            .bindProperty("date-i18n", "viewModel", ["date-i18n"])
            .bindProperty("date-trans", "lang", "date-i18n")
            .bindProperty("date", "viewModel", ["date"])
            .bindProperty("store-i18n", "viewModel", ["store-i18n"])
            .bindProperty("store-trans", "lang", "store-i18n")
            .bindProperty("store", "viewModel", ["store"])
            .bindAggregation("stores", new Aggregation("store", ["stores"])
                .bindProperty("text", "store", ["DisplayName"])
                .bindProperty("value", "store", ["ID"])
            )
            .bindProperty("account-i18n", "viewModel", ["account-i18n"])
            .bindProperty("account-trans", "lang", "account-i18n")
            .bindProperty("account", "viewModel", ["account"])
            .bindAggregation("accounts", new Aggregation("account", ["accounts"])
                .bindProperty("text", "account", ["DisplayName"])
                .bindProperty("value", "account", ["ID"])
            )
            .bindProperty("comment", "viewModel", ["comment"]);

        // ReceiptLines
        oDetail
            .bindAggregation("receiptLines", new Aggregation("viewModel", ["receiptLines"])
                .bindProperty("id", "viewModel", ["id"])
                .bindAggregation("persons", new Aggregation("person", ["persons"])
                    .bindProperty("text", "person", ["DisplayName"])
                    .bindProperty("value", "person", ["ID"])
                )
                .bindProperty("person", "viewModel", ["person"])
                .bindAggregation("types", new Aggregation("type", ["types"])
                    .bindProperty("text", "type", ["DisplayName"])
                    .bindProperty("value", "type", ["ID"])
                )
                .bindProperty("type", "viewModel", ["type"])
                .bindProperty("value", "viewModel", ["id"])
            );

        oDetail
            .addEventListener("accountChange", this.onAccountChange, this)
            .addEventListener("dateChange", this.onDateChange, this)
            .addEventListener("personChange", this.onPersonChange, this)
            .addEventListener("lineAdd", this.onLineAdd, this)
            .addEventListener("lineRemove", this.onLineRemove, this)
            .addEventListener("lineValueChange", this.onLineValueChange, this)
            .addEventListener("save", this.onSave, this)
            .addEventListener("storeChange", this.onStoreChange, this)
            .addEventListener("typeChange", this.onTypeChange, this);

        EventBus.listen("navigation", this.onNavigation, this);
    }

    onNavigation (sSection) {
        this.getContainer("detail").setVisibilty(sSection === "detail");
    }

    onAccountChange (oEvent) {
        console.log("accountChange", oEvent.customData);
    }

    onDateChange (oEvent) {
        console.log("dateChange", oEvent.customData);
    }

    onLineAdd (oEvent) {
        console.log("lineAdd", oEvent.customData);
    }

    onLineRemove (oEvent) {
        console.log("lineRemove", oEvent.customData);
    }

    onLineValueChange (oEvent) {
        console.log("lineValueChange", oEvent.customData);
    }

    onPersonChange (oEvent) {
        console.log("personChange", oEvent.customData);
    }

    onSave (oEvent) {
        console.log("save", oEvent);
    }

    onStoreChange (oEvent) {
        console.log("storeChange", oEvent.customData);
    }

    onTypeChange (oEvent) {
        console.log("typeChange", oEvent.customData);
    }
}
