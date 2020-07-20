import { Controller } from "../common/Controller.js";
import { Detail } from "../../view/detail/Detail.js";
import { EventBus } from "../../EventBus.js";
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
            .addModel(LanguageModel, "lang");

        // Main View
        oDetail.bindProperty("title-i18n", "viewModel", ["title-i18n"])
            .bindProperty("title-translation", "lang", "title-i18n");

        // ReceiptDetail
        oDetail.bindProperty("id-i18n", "viewModel", ["id-i18n"])
            .bindProperty("id-translation", "lang", "id-i18n")
            .bindProperty("id", "viewModel", ["id"])
            .bindProperty("date-i18n", "viewModel", ["date-i18n"])
            .bindProperty("date-translation", "lang", "date-i18n")
            .bindProperty("date", "viewModel", ["date"])
            .bindProperty("store-i18n", "viewModel", ["store-i18n"])
            .bindProperty("store-translation", "lang", "store-i18n")
            .bindProperty("store", "viewModel", ["store"])
            .bindAggregation("stores", new Aggregation("viewModel", ["stores"])
                .bindProperty("text", "viewModel", ["text"])
                .bindProperty("value", "viewModel", ["value"])
            )
            .bindProperty("account-i18n", "viewModel", ["account-i18n"])
            .bindProperty("account-translation", "lang", "account-i18n")
            .bindProperty("account", "viewModel", ["account"])
            .bindAggregation("accounts", new Aggregation("viewModel", ["accounts"])
                .bindProperty("text", "viewModel", ["text"])
                .bindProperty("value", "viewModel", ["value"])
            )
            .bindProperty("comment", "viewModel", ["comment"]);

        oDetail
            .addEventListener("storeChange", this.onStoreChange, this)
            .addEventListener("save", this.onSave, this);

        EventBus.listen("navigation", this.onNavigation, this);
    }

    onNavigation (sSection) {
        this.getContainer("detail").setVisibilty(sSection === "detail");
    }

    onStoreChange (oEvent) {
        console.log("storeChange", oEvent.customData);
    }

    onSave (oEvent) {
        console.log("save", oEvent);
    }
}
