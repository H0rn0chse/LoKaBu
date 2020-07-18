import { Controller } from "../common/Controller.js";
import { Header } from "../../view/header/Header.js";
import { LanguageModel } from "../../model/database/LanguageModel.js";
import { HeaderModel } from "../../model/view/HeaderModel.js";
import { Aggregation } from "../../common/Aggregation.js";

export class HeaderController extends Controller {
    constructor (oDomRef) {
        super(oDomRef);

        HeaderModel.addEventListener("update", this.onHeaderModelUpdate, this);

        const oHeader = new Header();
        const oHeaderContainer = this.createContainer("header")
            .setContent(oHeader);

        oHeader.setParent(oHeaderContainer.getNode())
            .addModel(HeaderModel, "viewModel")
            .addModel(LanguageModel, "lang");

        // do the binding
        oHeader.bindAggregation("headerItems", new Aggregation("viewModel", ["items"]))
            .bindProperty("section", "viewModel", ["section"])
            .bindProperty("selected", "viewModel", ["selected"])
            .bindProperty("i18n", "viewModel", ["i18n"])
            .bindProperty("text", "lang", "i18n");

        oHeader.addEventListener("click", this.onHeaderClick, this);
    }

    onHeaderClick (oEvent) {
        HeaderModel.setSelectedSection(oEvent.customData.section);
    }

    onHeaderModelUpdate (oEvent) {
        this.update();
    }

    update () {
        this.getContainer("header").getContent().update();
    }
};
