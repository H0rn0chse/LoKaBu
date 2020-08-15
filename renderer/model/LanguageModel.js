/* eslint-disable quote-props */
import { Model } from "./common/Model.js";
import { EventBus } from "../EventBus.js";
import { deepClone } from "../common/Utils.js";
import { SettingsModel } from "./SettingsModel.js";

const aReservedPaths = [
    "languages",
    "translations"
];

const tempTranslations = [
    /* {
        scriptCode: "settings.createDatabase",
        en_GB: "",
        de: ""
    } */
];

class _LanguageModel extends Model {
    constructor (...args) {
        super(...args);
        this.name = "LanguageModel";
        this.loaded = false;

        EventBus.listen("database-open", (oEvent) => {
            EventBus.sendToDatabase("i18n-read");
        });

        EventBus.listen("i18n-read", (oEvent, aData) => {
            aData = aData.concat(tempTranslations);
            this.set(["translations"], aData);
            console.log("LanguageModel loaded");
        });
    }

    get (aPath, aBindingContextPath = []) {
        let aContextPath = deepClone(aBindingContextPath);
        aContextPath.push(...deepClone(aPath));

        if (aContextPath[0] === undefined || aReservedPaths.includes(aContextPath[0])) {
            return super.get(aPath, aBindingContextPath);
        }
        // get translation values
        const sCurrentLanguage = SettingsModel.get(["Language"]) || "en_GB";
        aContextPath = ["translations", { scriptCode: aPath[0] }, sCurrentLanguage];
        return super.get(aContextPath);
    }

    // Allow components to be lazily loaded
    update (...args) {
        this.loaded = true;
        return super.update(...args);
    }
}

export const LanguageModel = new _LanguageModel({
    "languages": [
        {
            value: "de"
        }, {
            value: "en_GB"
        }
    ],
    "translations": []
});
