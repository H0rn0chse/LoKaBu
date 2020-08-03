import { Controller } from "../common/Controller.js";
import { Detail } from "../../view/detail/Detail.js";
import { EventBus } from "../../EventBus.js";
import { AccountModel } from "../../model/AccountModel.js";
import { StoreModel } from "../../model/StoreModel.js";
import { PersonModel } from "../../model/PersonModel.js";
import { TypeModel } from "../../model/TypeModel.js";
import { DetailModel } from "../../model/DetailModel.js";
import { Aggregation } from "../../common/Aggregation.js";
import { ReceiptModel } from "../../model/ReceiptModel.js";
import { LineModel } from "../../model/LineModel.js";

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
            .addModel(TypeModel, "type");

        // detail base view
        oDetail
            .bindProperty("new-i18n", "viewModel", ["new-i18n"])
            .bindProperty("delete-i18n", "viewModel", ["delete-i18n"]);

        // ReceiptDetail
        oDetail
            .bindProperty("id-i18n", "viewModel", ["id-i18n"])
            .bindProperty("date-i18n", "viewModel", ["date-i18n"])
            .bindProperty("store-i18n", "viewModel", ["store-i18n"])
            .bindProperty("account-i18n", "viewModel", ["account-i18n"])
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
            .addEventListener("lineChange", this.onLineChange, this)
            .addEventListener("lineAdd", this.onLineAdd, this)
            .addEventListener("lineRemove", this.onLineRemove, this)
            .addEventListener("storeChange", this.onStoreChange, this)
            .addEventListener("new", this.onNew, this)
            .addEventListener("delete", this.onDelete, this);

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

    onStoreChange (oEvent) {
        ReceiptModel.setStore(oEvent.customData.store);
    }

    onCommentChange (oEvent) {
        ReceiptModel.setComment(oEvent.customData.comment);
    }

    onLineAdd (oEvent) {
        LineModel.addEntry(oEvent.customData.id);
    }

    onLineChange (oEvent) {
        const oData = oEvent.customData;
        LineModel.updateEntry(oData.id, oData.receipt, oData.value, oData.person, oData.type);
    }

    onLineRemove (oEvent) {
        LineModel.deleteEntry(oEvent.customData.id);
    }

    onNew (oEvent) {
        DetailModel.newReceipt();
    }

    onDelete (oEvent) {
        DetailModel.deleteReceipt(oEvent.customData.id);
    }
}
