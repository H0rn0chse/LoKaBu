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

        oDetail.bindProperty("title-i18n", "viewModel", ["title-i18n"]);
        oDetail.bindProperty("title-translation", "lang", "title-i18n");

        oDetail.bindProperty("id-i18n", "viewModel", ["id-i18n"]);
        oDetail.bindProperty("id-translation", "lang", "id-i18n");
        oDetail.bindProperty("id", "viewModel", ["id"]);

        oDetail.bindProperty("store-i18n", "viewModel", ["store-i18n"]);
        oDetail.bindProperty("store-translation", "lang", "store-i18n");
        oDetail.bindProperty("store", "viewModel", ["store"]);
        oDetail.bindAggregation("stores", new Aggregation("viewModel", ["stores"])
            .bindProperty("text", "viewModel", ["text"])
            .bindProperty("value", "viewModel", ["value"])
        );

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
