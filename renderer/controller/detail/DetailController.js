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
import { ReceiptModel } from "../../model/database/ReceiptModel.js";
import { LineModel } from "../../model/database/LineModel.js";

export class DetailController extends Controller {
    constructor (oDomRef) {
        super(oDomRef);

        const oDetail = new Detail();
        const oDetailContainer = this.createContainer("detail")
            .setContent(oDetail);

        oDetail.setParent(oDetailContainer.getNode())
            .addModel(DetailModel, "viewModel")
            .addModel(ReceiptModel, "receipt")
            .addModel(LineModel, "lines")
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
            .bindProperty("date-i18n", "viewModel", ["date-i18n"])
            .bindProperty("date-trans", "lang", "date-i18n")
            .bindProperty("store-i18n", "viewModel", ["store-i18n"])
            .bindProperty("store-trans", "lang", "store-i18n")
            .bindProperty("account-i18n", "viewModel", ["account-i18n"])
            .bindProperty("account-trans", "lang", "account-i18n")
            .bindAggregation("stores", new Aggregation("store", ["stores"])
                .bindProperty("text", "store", ["DisplayName"])
                .bindProperty("value", "store", ["ID"])
            )
            .bindAggregation("accounts", new Aggregation("account", ["accounts"])
                .bindProperty("text", "account", ["DisplayName"])
                .bindProperty("value", "account", ["ID"])
            )
            .bindProperty("id", "receipt", ["ID"])
            .bindProperty("date", "receipt", ["Date"])
            .bindProperty("store", "receipt", ["Store"])
            .bindProperty("account", "receipt", ["Account"])
            .bindProperty("comment", "receipt", ["Comment"]);

        // ReceiptLines
        oDetail
            .bindAggregation("receiptLines", new Aggregation("lines", ["lines"])
                .bindAggregation("persons", new Aggregation("person", ["persons"])
                    .bindProperty("text", "person", ["DisplayName"])
                    .bindProperty("value", "person", ["ID"])
                )
                .bindAggregation("types", new Aggregation("type", ["types"])
                    .bindProperty("text", "type", ["DisplayName"])
                    .bindProperty("value", "type", ["ID"])
                )
                .bindProperty("id", "lines", ["ID"])
                .bindProperty("person", "lines", ["Billing"])
                .bindProperty("type", "lines", ["Type"])
                .bindProperty("value", "lines", ["Value"])
            );

        oDetail
            .addEventListener("accountChange", this.onAccountChange, this)
            .addEventListener("dateChange", this.onDateChange, this)
            .addEventListener("commentChange", this.onCommentChange, this)
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
        ReceiptModel.setAccount(oEvent.customData.account);
    }

    onDateChange (oEvent) {
        ReceiptModel.setDate(oEvent.customData.date);
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
        ReceiptModel.setStore(oEvent.customData.store);
    }

    onCommentChange (oEvent) {
        ReceiptModel.setComment(oEvent.customData.comment);
    }

    onTypeChange (oEvent) {
        console.log("typeChange", oEvent.customData);
    }
}
