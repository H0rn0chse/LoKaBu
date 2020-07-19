import { Controller } from "../common/Controller.js";
import { Analysis } from "../../view/analysis/Analysis.js";
import { EventBus } from "../../EventBus.js";

export class AnalysisController extends Controller {
    constructor (oDomRef) {
        super(oDomRef);

        const oAnalysis = new Analysis();
        const oAnalysisContainer = this.createContainer("analysis")
            .setContent(oAnalysis);

        oAnalysis.setParent(oAnalysisContainer.getNode());

        EventBus.listen("navigation", this.onNavigation, this);
    }

    onNavigation (sSection) {
        this.getContainer("analysis").getContent().setVisibilty(sSection === "analysis");
    }
}
