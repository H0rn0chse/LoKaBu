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
    {
        scriptCode: "settings.createDatabase",
        en_GB: "Create Database...",
        de: "Datenbank erstellen..."
    },
    {
        scriptCode: "settings.openDatabase",
        en_GB: "Open Database...",
        de: "Datenbank öffnen"
    },
    {
        scriptCode: "common.default",
        en_GB: "Default",
        de: "Standard"
    },
    {
        scriptCode: "detail.newReceipt",
        en_GB: "New Receipt...",
        de: "Neuer Beleg..."
    },
    {
        scriptCode: "detail.deleteReceipt",
        en_GB: "Delete Receipt...",
        de: "Beleg löschen..."
    }
];

class _LanguageModel extends Model {
    constructor (...args) {
        super(...args);

        EventBus.sendToDatabase("i18n-read");
        EventBus.listen("i18n-read", (oEvent, aData) => {
            console.log("LanguageModel loaded");
            aData = aData.concat(tempTranslations);
            this.set(["translations"], aData);
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
