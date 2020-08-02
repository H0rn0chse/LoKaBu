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
        // views can indirectly consume this model
        this.updateLanguageModel = true;

        const aPath = ["Language"];
        this.set(aPath, sLanguage, true);
        EventBus.sendToDatabase("settings-update", this.get([]));
    }

    setDefaultDatabase () {
        const sPath = this.get(["CurrentDir"]);
        this.set(["DefaultDir"], sPath);
        EventBus.sendToDatabase("settings-update", this.get([]));
    }
}

export const SettingModel = new _SettingModel({});
