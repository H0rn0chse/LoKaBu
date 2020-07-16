import { Model } from "../common/Model.js";

export const HeaderModel = new Model({
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
