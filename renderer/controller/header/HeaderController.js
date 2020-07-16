import { Controller } from "../common/Controller.js";
import { Header } from "../../view/header/Header.js";
import { LanguageModel } from "../../model/database/LanguageModel.js";
import { HeaderModel } from "../../model/view/HeaderModel.js";
import { Aggregation } from "../../common/Aggregation.js";

export class HeaderController extends Controller {
    constructor (oDomRef) {
        super();
        this.node = oDomRef;

        this.header = new Header();
        this.header.setParent(this.node);
        this.header.addModel(HeaderModel, "tabs");
        this.header.addModel(LanguageModel, "lang");
        this.header.bindAggregation("headerItems", new Aggregation("tabs", ["items"]))
            .bindProperty("section", "tabs", ["link"])
            .bindProperty("i18n", "tabs", ["i18n"])
            .bindProperty("text", "lang", "i18n");

        this.header.update();
    }
};
