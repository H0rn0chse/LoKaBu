import { Controller } from "./common/Controller.js";
import { AnalysisView } from "../view/analysis/AnalysisView.js";
import { EventBus } from "../EventBus.js";
import { AnalysisModel } from "../model/AnalysisModel.js";
import { Aggregation } from "../common/Aggregation.js";
import { objectGet } from "../common/Utils.js";

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
            .bindAggregation("groupItems", new Aggregation("viewModel", ["group"])
                .bindProperty("value", "viewModel", ["id"])
                .bindProperty("i18n", "viewModel", ["i18n"])
                .bindProperty("text", "lang", "i18n")
            )
            .bindProperty("selectedGroup", "viewModel", ["selectedGroup"]);

        // FilterBox
        oAnalysis
            .bindAggregation("filter", new Aggregation("viewModel", ["filter"]));

        // Chart
        oAnalysis
            .bindProperty("data", "viewModel", ["data"]);

        oAnalysis
            .addEventListener("groupChange", this.onGroupChange, this)
            .addEventListener("addFilter", this.onAddFilter, this)
            .addEventListener("updateFilter", this.onUpdateFilter, this)
            .addEventListener("deleteFilter", this.onDeleteFilter, this);

        EventBus.listen("navigation", this.onNavigation, this);
    }

    onNavigation (sSection) {
        this.getContainer("analysis").setVisibilty(sSection === "analysis");
    }

    onGroupChange (oEvent) {
        AnalysisModel.setGroup(oEvent.customData.group);
        AnalysisModel.read();
    }

    onAddFilter (oEvent) {
        AnalysisModel.addFilter();
    }

    onUpdateFilter (oEvent) {
        const oCustomData = objectGet(oEvent, ["customData"]);
        if (oCustomData) {
            AnalysisModel.setFilterColumn(oCustomData.filter, oCustomData.column);
        }
        AnalysisModel.read();
    }

    onDeleteFilter (oEvent) {
        AnalysisModel.deleteFilter(oEvent.customData.id);
        AnalysisModel.read();
    }
}
