import { Controller } from "./common/Controller.js";
import { Header } from "./header/Header.js";
import { Model } from "../rendererModel/common/Model.js";

export class AppController extends Controller {
    constructor (oDomRef) {
        super();
        this.node = oDomRef;

        this.models = {};

        this.models.tabs = new Model({
            items: [
                {
                    link: "detail"
                },
                {
                    link: "history"
                },
                {
                    link: "analysis"
                },
                {
                    link: "settings"
                }
            ]
        });
        /* this.models.language = new Model([
            {
                section_en: "Detail",
                section_en: "History"
                section_en: "History"
                section_en: "Analysis
            },
            {
            },
            {
                section_en: "Analysis"
            },
            {
                section_en: "Settings"
            }
        ]); */
        this.header = new Header();
        this.header.setParent(this.node);
        this.header.addModel(this.models.tabs, "tabs");
        this.header.addModel(this.models.language, "lang");
        this.header.bindAggregation("headerItems", "tabs", ["items"])
            .bindProperty("text", "tabs", ["link"]);

        this.header.update();
    }
};
