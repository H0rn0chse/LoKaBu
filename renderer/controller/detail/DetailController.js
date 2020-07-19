import { Controller } from "../common/Controller.js";
import { Detail } from "../../view/detail/Detail.js";
import { EventBus } from "../../EventBus.js";
import { LanguageModel } from "../../model/database/LanguageModel.js";
import { DetailModel } from "../../model/view/DetailModel.js";

export class DetailController extends Controller {
    constructor (oDomRef) {
        super(oDomRef);

        const oDetail = new Detail();
        const oDetailContainer = this.createContainer("detail")
            .setContent(oDetail);

        oDetail.setParent(oDetailContainer.getNode())
            .addModel(DetailModel, "viewModel")
            .addModel(LanguageModel, "lang");

        oDetail.bindProperty("title-i18n", "viewModel", ["title"]);
        oDetail.bindProperty("title", "lang", "title-i18n");

        EventBus.listen("navigation", this.onNavigation, this);
    }

    onNavigation (sSection) {
        this.getContainer("detail").setVisibilty(sSection === "detail");
    }
}
