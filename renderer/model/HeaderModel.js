import { Model } from "./common/Model.js";

class _HeaderModel extends Model {
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
            section: "settings",
            i18n: ["settings.section.title"],
            selected: false
        }
    ]
});
