/* eslint-disable quote-props */
import { EventBus } from "../EventBus.js";
import { deepClone, objectGet } from "../../core/common/Utils.js";
import { SettingsModel } from "./SettingsModel.js";
import { Model2 } from "../../core/model/Model2.js";
import { BindingPath } from "../../core/model/BindingPath.js";

const tempTranslations = [
    /* {
        scriptCode: "settings.createDatabase",
        en_GB: "",
        de: ""
    } */
    {
        scriptCode: "some.i18n.value",
        en_GB: "en_Test",
        de: "de_Test"
    }
];

class _LanguageModel2 extends Model2 {
    constructor (...args) {
        super(...args);

        EventBus.sendToDatabase("i18n-languages");
        EventBus.sendToDatabase("i18n-translations");

        EventBus.listenOnce("i18n-translations", (oEvent, aData) => {
            aData = aData.concat(tempTranslations);
            const oData = aData.reduce((acc, item) => {
                const oItem = deepClone(item);
                const sKey = oItem.scriptCode;
                delete oItem.scriptCode;
                acc[sKey] = oItem;
                return acc;
            }, {});
            const oPath = new BindingPath("translations");
            this.setData(oPath, oData);
            console.error("Translation were set")
        });

        EventBus.listenOnce("i18n-languages", (oEvent, aData) => {
            aData = aData.map(sLang => {
                return {
                    value: sLang
                };
            });
            const oPath = new BindingPath("languages");
            this.setData(oPath, aData);
        });

        this.language = "en_GB";
        window.lm = this
    }

    notify (path, value, previousValue, name) {
        const aEvents = [];
        let oNewValue = deepClone(value);
        if (path === "translations") {
            Object.keys(value).forEach(sKeyCode => {
                aEvents.push(`translations.${sKeyCode}`);
            });
        } else {
            aEvents.push(path);
        }
        aEvents.forEach(path => {
            if (path.startsWith("translations")) {
                oNewValue = this.getData(new BindingPath(path));
            }
            this.listener.handleEvent(path, oNewValue);
        });
    }

    getData (oPath) {
        let aPath = oPath.getArray();
        if (aPath[0] === "translations" && aPath.length > 1) {
            aPath.splice(0, 1);
            aPath = ["translations", aPath.join("."), this.language];
        }
        return objectGet(this.data, aPath);
    }

    updateLanguage () {
        this.language = SettingsModel.get(["Language"]) || "en_GB";
        this.notify("translations", this.getData(new BindingPath("translations")));
    }
}

export const LanguageModel2 = new _LanguageModel2({
    "languages": [],
    "translations": []
});
