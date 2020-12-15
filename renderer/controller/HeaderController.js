import { Controller } from "../../core/controller/Controller.js";
import { HeaderView } from "../view/header/HeaderView.js";
import { HeaderModel } from "../model/HeaderModel.js";
import { Aggregation } from "../../core/common/Aggregation.js";
import { EventBus } from "../EventBus.js";

export class HeaderController extends Controller {
    constructor (oDomRef) {
        super(oDomRef);

        const oHeader = this.addView("header", HeaderView);

        oHeader
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
