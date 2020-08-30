import { Controller } from "./common/Controller.js";
import { AnalysisView } from "../view/analysis/AnalysisView.js";
import { EventBus } from "../EventBus.js";

export class AnalysisController extends Controller {
    constructor (oDomRef) {
        super(oDomRef);

        const oAnalysis = new AnalysisView();
        const oAnalysisContainer = this.createContainer("analysis")
            .setContent(oAnalysis);

        oAnalysis.setParent(oAnalysisContainer.getNode());

        EventBus.listen("navigation", this.onNavigation, this);
    }

    onNavigation (sSection) {
        this.getContainer("analysis").setVisibilty(sSection === "analysis");
    }
}
