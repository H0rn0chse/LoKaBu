/* eslint-disable quote-props */
import { Model } from "../common/Model.js";
import { EventBus } from "../../EventBus.js";
import { SettingsModel } from "../view/SettingsModel.js";
import { deepClone } from "../../common/Utils.js";

const aReservedPaths = [
    "languages",
    "translations"
];

class _LanguageModel extends Model {
    constructor (...args) {
        super(...args);

        EventBus.sendToDatabase("i18n-read-list");
        EventBus.listen("i18n-read-list", (oEvent, aData) => {
            console.log("LanguageModel loaded");
            this.set(["translations"], aData);
        });
    }

    get (aPath, aBindingContextPath = []) {
        let aContextPath = deepClone(aBindingContextPath);
        aContextPath.push(...deepClone(aPath));

        if (aReservedPaths.includes(aContextPath[0])) {
            return super.get(aPath, aBindingContextPath);
        }
        // get translation values
        const sCurrentLanguage = SettingsModel.get(["current-language"]) || "en_GB";
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
    /* ,
    "detail.section.title": "Detail",
    "history.section.title": "History",
    "settings.section.title": "Settings",
    "analysis.section.title": "Analysis",
    "receipt.id": "ID",
    "common.store": "Store",
    "common.date": "Date",
    "common.account": "Account",
    "common.value": "Value",
    "common.edit": "Edit",
    "common.default": "Default",
    "settings.databaseSettings": "Database Settings",
    "settings.currentDatabase": "Current Database",
    "settings.createDatabase": "Create Database...",
    "settings.openDatabase": "Open Database...",
    "settings.openUserDatabase": "Open User Database",
    "settings.setDefaultDatabase": "Set current Database as default",
    "settings.defaultValues": "Default values",
    "common.language": "Language",
    "settings.lists": "Lists",
    "common.persons": "Persons",
    "common.accounts": "Accounts",
    "common.types": "Types",
    "common.stores": "Stores", */
});
