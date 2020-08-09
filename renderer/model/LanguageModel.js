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
    },
    {
        scriptCode: "detail.noReceipt",
        en_GB: "There are no receipts to edit",
        de: "Es gibt keine Belege zum bearbeiten"
    },
    {
        scriptCode: "settings.language",
        en_GB: "Language Settings",
        de: "Spracheinstellungen"
    },
    {
        scriptCode: "migration.upgrade",
        en_GB: "The database you opended does not have the required minimum version. If you want to proceed using the version $AppVersion of Lokabu, you need to do a database upgrade from $SourceVersion to $TargetVersion.",
        de: "Die geöffnete Datenbank erfüllt die erforderte Mindestversion nicht. Um die Version $AppVersion von Lokabu weiter nutzen zu können, müssen sie ein Datenbankupgrade von $SourceVersion zu $TargetVersion vornehmen."
    },
    {
        scriptCode: "dialog.confirm",
        en_GB: "Are you sure you want to proceed? This action is not reversible and may affect other users.",
        de: "Sind sie sicher, dass sie fortfahren wollen? Diese Aktion ist nicht umkehrbar und kann andere Nutzer beeinträchtigen."
    }
];

class _LanguageModel extends Model {
    constructor (...args) {
        super(...args);
        this.name = "LanguageModel";

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
