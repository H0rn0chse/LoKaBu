import { Controller } from "../common/Controller.js";
import { Detail } from "../../view/detail/Detail.js";
import { EventBus } from "../../EventBus.js";

export class DetailController extends Controller {
    constructor (oDomRef) {
        super(oDomRef);

        const oDetail = new Detail();
        const oDetailContainer = this.createContainer("detail")
            .setContent(oDetail);

        oDetail.setParent(oDetailContainer.getNode());

        EventBus.listen("navigation", this.onNavigation, this);
    }

    onNavigation (sSection) {
        this.getContainer("detail").getContent().setVisibilty(sSection === "detail");
    }
}
