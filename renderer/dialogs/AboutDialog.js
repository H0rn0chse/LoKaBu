import { EventBus } from "../EventBus.js";
import { LanguageModel } from "../model/LanguageModel.js";

class _AboutDialog {
    show () {
        EventBus.sendToMain("openDialog", "renderer/modalDialogs/AboutDialog.html", 400, 600);
        this._getVersions();
        this._getTranslations();
    }

    _getVersions () {
        EventBus.sendToMain("appVersion");
        EventBus.listenOnce("appVersion", (oEvent, sVersion) => {
            EventBus.sendTo("aboutDialog", "appVersion", sVersion);
        });
        EventBus.sendToDatabase("helper-version");
        EventBus.listenOnce("helper-version", (oEvent, oVersion) => {
            EventBus.sendTo("aboutDialog", "databaseVersion", oVersion);
        });
    }

    _getTranslations () {
        const aTranslations = LanguageModel.getNameSpace("about.");
        const oTranslations = {};
        aTranslations.forEach(oTrans => {
            oTranslations[oTrans.scriptCode] = oTrans.trans;
        });
        EventBus.sendTo("aboutDialog", "translations", oTranslations);
    }
}

export const AboutDialog = new _AboutDialog();
