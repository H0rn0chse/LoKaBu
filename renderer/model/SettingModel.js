/* eslint-disable quote-props */
import { LanguageModel } from "./LanguageModel.js";
import { EventBus } from "../../EventBus.js";
import { DatabaseModel } from "../common/DatabaseModel.js";

class _SettingModel extends DatabaseModel {
    constructor (oData) {
        super(oData, "settings");
        this.updateLanguageModel = true;
    }

    processRead (oEvent, oData) {
        console.log("SettingsModel loaded");
        this.mergeObjectIntoData(oData);

        if (this.updateLanguageModel) {
            this.updateLanguageModel = false;
            LanguageModel.update();
        }
    }

    processUpdate (oEvent) {
        this.update();

        if (this.updateLanguageModel) {
            this.updateLanguageModel = false;
            LanguageModel.update();
        }
    }

    setLanguage (sLanguage) {
        this.updateLanguageModel = true;

        EventBus.sendToDatabase("settings-update", this.get([]));

        const aPath = ["Language"];
        this.set(aPath, sLanguage, true);
    }

    setDefaultDatabase () {
        EventBus.sendToDatabase("settings-update", this.get([]));
        const sPath = this.get(["CurrentDir"]);
        this.set(["DefaultDir"], sPath);
    }
}

export const SettingModel = new _SettingModel({});
