import { Controller } from "../common/Controller.js";
import { Header } from "../../view/header/Header.js";
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
            .addModel(HeaderModel, "viewModel");

        // do the binding
        oHeader.bindAggregation("headerItems", new Aggregation("viewModel", ["items"])
            .bindProperty("section", "viewModel", ["section"])
            .bindProperty("selected", "viewModel", ["selected"])
            .bindProperty("title-i18n", "viewModel", ["i18n"])
        );

        oHeader.addEventListener("click", this.onHeaderClick, this);

        EventBus.listen("navigation", this.onNavigation, this);
    }

    onHeaderClick (oEvent) {
        EventBus.sendToCurrentWindow("navigation", oEvent.customData.section);
    }

    onNavigation (sSection) {
        HeaderModel.setSelectedSection(sSection);
    }

    onHeaderModelUpdate (oEvent) {
        this.update();
    }
};
