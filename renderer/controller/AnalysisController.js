import { Controller } from "./common/Controller.js";
import { AnalysisView } from "../view/analysis/AnalysisView.js";
import { EventBus } from "../EventBus.js";
import { AnalysisModel } from "../model/AnalysisModel.js";
import { Aggregation } from "../common/Aggregation.js";

export class AnalysisController extends Controller {
    constructor (oDomRef) {
        super(oDomRef);

        const oAnalysis = new AnalysisView();
        const oAnalysisContainer = this.createContainer("analysis")
            .setContent(oAnalysis);

        oAnalysis.setParent(oAnalysisContainer.getNode())
            .addModel(AnalysisModel, "viewModel");

        // settings
        oAnalysis
            .bindAggregation("chartTypes", new Aggregation("viewModel", ["types"])
                .bindProperty("value", "viewModel", ["id"])
                .bindProperty("i18n", "viewModel", ["i18n"])
                .bindProperty("text", "lang", "i18n")
            );

        oAnalysis
            .addEventListener("typeChange", this.onTypeChange, this);

        EventBus.listen("navigation", this.onNavigation, this);
    }

    onNavigation (sSection) {
        this.getContainer("analysis").setVisibilty(sSection === "analysis");
    }

    onTypeChange (oEvent) {
        console.log("typeChange", oEvent);
    }
}
