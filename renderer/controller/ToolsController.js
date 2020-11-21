import { Controller } from "./common/Controller.js";
import { EventBus } from "../EventBus.js";
import { ToolsView } from "../view/tools/ToolsView.js";
import { ToolsModel } from "../model/ToolsModel.js";
import { Aggregation } from "../common/Aggregation.js";

export class ToolsController extends Controller {
    constructor (oDomRef) {
        super(oDomRef);

        const oTools = new ToolsView();
        const oToolsContainer = this.createContainer("tools")
            .setContent(oTools);

        oTools.setParent(oToolsContainer.getNode())
            .addModel(ToolsModel, "viewModel");

        oTools
            .bindProperty("selectedItem", "viewModel", ["selectedItem"])
            .bindProperty("description-i18n", "viewModel", ["description-i18n"])
            .bindAggregation("items", new Aggregation("viewModel", ["items"])
                .bindProperty("id", "viewModel", ["id"])
                .bindProperty("text", "viewModel", ["text"])
                .bindProperty("selected", "viewModel", ["selected"])
            );

        EventBus.listen("navigation", this.onNavigation, this);

        oTools
            .addEventListener("nav", this.onNav, this)
    }

    onNavigation (sSection) {
        this.getContainer("tools").setVisibilty(sSection === "tools");
    }

    onNav (oEvent) {
        const oData = oEvent.customData;
        ToolsModel.setSelectedItem(oData.id);
    }
}
