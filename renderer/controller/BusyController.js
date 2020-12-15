import { Controller } from "../../core/controller/Controller.js";
import { BusyView } from "../view/busy/BusyView.js";
import { EventBus } from "../EventBus.js";

export class BusyController extends Controller {
    constructor (oDomRef) {
        super(oDomRef);

        this.addView("busy", BusyView);
        this.getContainer("busy").setVisibilty(false);

        EventBus.listen("busy-start", this.start, this);
        EventBus.listen("busy-stop", this.stop, this);
    }

    start () {
        this.getContainer("busy").setVisibilty(true);
    }

    stop () {
        this.getContainer("busy").setVisibilty(false);
    }
}
