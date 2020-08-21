import { EventBus } from "../../renderer/EventBus.js";
const path = require("path");
const fs = require('fs');

const sI18nPath = path.join(__dirname, "../i18n");
const sTranslations = "translation.";

class _I18n {
    constructor () {
        this.translations = {};
        this.languages = {};
        this._init();
        EventBus.listen("i18n-translations", this.getTranslations, this);
        EventBus.listen("i18n-languages", this.getAvailableLanguages, this);
    }

    _init () {
        fs.readdirSync(sI18nPath, 'utf-8').forEach(sFile => {
            if (sFile.startsWith(sTranslations)) {
                // translation.xx_XX.json
                const sLang = sFile.split(".")[1];
                const sPath = path.join(sI18nPath, sFile);
                const oData = JSON.parse(fs.readFileSync(sPath, "utf-8"));
                this._merge(oData, sLang);
            }
        });
    }

    _merge (oTranslation, sLang) {
        this.languages[sLang] = true;
        Object.keys(oTranslation).forEach(sKey => {
            if (!this.translations[sKey]) {
                this.translations[sKey] = {};
            }
            this.translations[sKey][sLang] = oTranslation[sKey];
        });
    }

    getAvailableLanguages () {
        const aData = Object.keys(this.languages);
        EventBus.sendToBrowser("i18n-languages", aData);
    }

    getTranslations () {
        const aData = Object.keys(this.translations).map(sKey => {
            const oValue = {
                scriptCode: sKey
            };
            Object.keys(this.translations[sKey]).forEach(sLang => {
                oValue[sLang] = this.translations[sKey][sLang];
            });
            return oValue;
        });
        EventBus.sendToBrowser("i18n-translations", aData);
    }
}

export const I18n = new _I18n();
