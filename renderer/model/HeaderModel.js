import { Model } from "../../core/model/Model.js";

class _HeaderModel extends Model {
    constructor (...args) {
        super(...args);
        this.name = "HeaderModel";
        window[this.name] = this;
    }

    setSelectedSection (sSection) {
        this.get(["items"]).forEach(oElement => {
            oElement.selected = oElement.section === sSection;
        });
        this.update();
    }
}

export const HeaderModel = new _HeaderModel({
    items: [
        {
            section: "detail",
            i18n: ["detail.section.title"],
            selected: false
        },
        {
            section: "history",
            i18n: ["history.section.title"],
            selected: false
        },
        {
            section: "analysis",
            i18n: ["analysis.section.title"],
            selected: false
        },
        {
            section: "tools",
            i18n: ["tools.section.title"],
            selected: false
        },
        {
            section: "settings",
            i18n: ["settings.section.title"],
            selected: false
        }
    ]
});
