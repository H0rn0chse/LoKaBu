import { Controller } from "../common/Controller.js";
import { Header } from "../../view/header/Header.js";
import { LanguageModel } from "../../model/database/LanguageModel.js";
import { HeaderModel } from "../../model/view/HeaderModel.js";
import { Aggregation } from "../../common/Aggregation.js";
import { EventBus } from "../../EventBus.js";

export class HeaderController extends Controller {
    constructor (oDomRef) {
        super(oDomRef);

        const oHeader = new Header();
        const oHeaderContainer = this.createContainer("header")
            .setContent(oHeader);

        oHeader.setParent(oHeaderContainer.getNode())
            .addModel(HeaderModel, "viewModel")
            .addModel(LanguageModel, "lang");

        // do the binding
        oHeader.bindAggregation("headerItems", new Aggregation("viewModel", ["items"])
            .bindProperty("section", "viewModel", ["section"])
            .bindProperty("selected", "viewModel", ["selected"])
            .bindProperty("title-i18n", "viewModel", ["i18n"])
            .bindProperty("title-trans", "lang", "title-i18n")
        );

        oHeader.addEventListener("click", this.onHeaderClick, this);

        EventBus.listen("navigation", this.onNavigation, this);
    }

    onHeaderClick (oEvent) {
        EventBus.sendToBrowser("navigation", oEvent.customData.section);
    }

    onNavigation (sSection) {
        HeaderModel.setSelectedSection(sSection);
    }

    onHeaderModelUpdate (oEvent) {
        this.update();
    }
};
