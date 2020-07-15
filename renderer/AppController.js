import { Controller } from "./common/Controller.js";
import { Header } from "./header/Header.js";
import { Model } from "../rendererModel/common/Model.js";
import { Aggregation } from "./common/Aggregation.js";

export class AppController extends Controller {
    constructor (oDomRef) {
        super();
        this.node = oDomRef;

        this.models = {};

        this.models.tabs = new Model({
            items: [
                {
                    link: "detail",
                    i18n: ["detail.section.title"]
                },
                {
                    link: "history",
                    i18n: ["history.section.title"]
                },
                {
                    link: "analysis",
                    i18n: ["analysis.section.title"]
                },
                {
                    link: "settings",
                    i18n: ["settings.section.title"]
                }
            ]
        });
        this.models.language = new Model({
            "detail.section.title": "Detail",
            "history.section.title": "History",
            "settings.section.title": "Settings",
            "analysis.section.title": "Analysis"
        });
        this.header = new Header();
        this.header.setParent(this.node);
        this.header.addModel(this.models.tabs, "tabs");
        this.header.addModel(this.models.language, "lang");
        this.header.bindAggregation("headerItems", new Aggregation("tabs", ["items"]))
            .bindProperty("section", "tabs", ["link"])
            .bindProperty("i18n", "tabs", ["i18n"])
            .bindProperty("text", "lang", "i18n");

        this.header.update();
    }
};
