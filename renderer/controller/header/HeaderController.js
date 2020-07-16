import { Controller } from "../common/Controller.js";
import { Header } from "../../view/header/Header.js";
import { LanguageModel } from "../../model/database/LanguageModel.js";
import { HeaderModel } from "../../model/view/HeaderModel.js";
import { Aggregation } from "../../common/Aggregation.js";

export class HeaderController extends Controller {
    constructor (oDomRef) {
        super();
        this.node = oDomRef;

        HeaderModel.addEventListener("update", this.onHeaderModelUpdate, this);

        this.header = new Header();
        this.header.setParent(this.node);
        this.header.addModel(HeaderModel, "viewModel");
        this.header.addModel(LanguageModel, "lang");
        this.header.bindAggregation("headerItems", new Aggregation("viewModel", ["items"]))
            .bindProperty("section", "viewModel", ["section"])
            .bindProperty("selected", "viewModel", ["selected"])
            .bindProperty("i18n", "viewModel", ["i18n"])
            .bindProperty("text", "lang", "i18n");

        this.header.addEventListener("click", this.onHeaderClick, this);

        this.header.update();
    }

    onHeaderClick (oEvent) {
        HeaderModel.setSelectedSection(oEvent.customData.section);
    }

    onHeaderModelUpdate (oEvent) {
        this.header.update();
    }
};
