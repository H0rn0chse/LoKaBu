import { Controller } from "../common/Controller.js";
import { History } from "../../view/history/History.js";
import { EventBus } from "../../EventBus.js";

export class HistoryController extends Controller {
    constructor (oDomRef) {
        super(oDomRef);

        const oHistory = new History();
        const oHistoryContainer = this.createContainer("history")
            .setContent(oHistory);

        oHistory.setParent(oHistoryContainer.getNode());

        EventBus.listen("navigation", this.onNavigation, this);
    }

    onNavigation (sSection) {
        this.getContainer("history").setVisibilty(sSection === "history");
    }
}
