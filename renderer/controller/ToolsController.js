import { Controller } from "./common/Controller.js";
import { EventBus } from "../EventBus.js";
import { ToolsView } from "../view/tools/ToolsView.js";
import { ToolsModel } from "../model/ToolsModel.js";

export class ToolsController extends Controller {
    constructor (oDomRef) {
        super(oDomRef);

        const oTools = new ToolsView();
        const oToolsContainer = this.createContainer("tools")
            .setContent(oTools);

        oTools.setParent(oToolsContainer.getNode())
            .addModel(ToolsModel, "viewModel");

        EventBus.listen("navigation", this.onNavigation, this);
    }

    onNavigation (sSection) {
        this.getContainer("tools").setVisibilty(sSection === "tools");
    }
}
