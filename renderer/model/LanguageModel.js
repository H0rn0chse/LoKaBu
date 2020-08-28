/* eslint-disable quote-props */
import { Model } from "./common/Model.js";
import { EventBus } from "../EventBus.js";
import { deepClone } from "../common/Utils.js";
import { SettingsModel } from "./SettingsModel.js";
import { Deferred } from "../common/Deferred.js";

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
    {
        scriptCode: "scanner.load",
        en_GB: "Load Image",
        de: "Bild laden"
    },
    {
        scriptCode: "scanner.start",
        en_GB: "Start Scanner",
        de: "Scanner starten"
    },
    {
        scriptCode: "scanner.dnd",
        en_GB: "Drop you Image here",
        de: "Bild hier ablegen"
    },
    {
        scriptCode: "scanner.result",
        en_GB: "The scanning process was successfull",
        de: "Der Scanprozess war erfolgreich"
    },
    {
        scriptCode: "scanner.append",
        en_GB: "Append to receipt lines",
        de: "An Belegpositionen anfügen"
    },
    {
        scriptCode: "scanner.replace",
        en_GB: "Replace all receipt lines",
        de: "Alle Belegpositionen ersetzen"
    }
];

class _LanguageModel extends Model {
    constructor (...args) {
        super(...args);
        this.name = "LanguageModel";

        this.languages = new Deferred();
        this.translations = new Deferred();

        EventBus.sendToDatabase("i18n-languages");
        EventBus.sendToDatabase("i18n-translations");

        EventBus.listen("i18n-translations", (oEvent, aData) => {
            aData = aData.concat(tempTranslations);
            this.set(["translations"], aData);

            console.log("LanguageModel translations loaded");
            this.translations.resolve();
        });

        EventBus.listen("i18n-languages", (oEvent, aData) => {
            aData = aData.map(sLang => {
                return {
                    value: sLang
                };
            });
            this.set(["languages"], aData);

            console.log("LanguageModel languages loaded");
            this.languages.resolve();
        });
    }

    waitForInit () {
        return Promise.all([this.languages.promise, this.translations.promise]);
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

    getNameSpace (sStartsWith) {
        const aTranslations = this.get(["translations"]).filter(oTrans => {
            return oTrans.scriptCode.startsWith(sStartsWith);
        });
        return aTranslations.map(oTrans => {
            const sCurrentLanguage = SettingsModel.get(["Language"]) || "en_GB";
            return {
                scriptCode: oTrans.scriptCode,
                trans: oTrans[sCurrentLanguage]
            };
        });
    }
}

export const LanguageModel = new _LanguageModel({
    "languages": [],
    "translations": []
});
