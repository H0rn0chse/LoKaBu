/* eslint-disable quote-props */
import { LanguageModel } from "./LanguageModel.js";
import { EventBus } from "../EventBus.js";
import { DatabaseModel } from "../../core/model/DatabaseModel.js";
import { LanguageModel2 } from "./LanguageModel2.js";

class _SettingsModel extends DatabaseModel {
    constructor (oData) {
        super(oData, "settings");
        this.name = "SettingsModel";
        window[this.name] = this;

        this.updateLanguageModel = true;
    }

    get (aPath, aBindingContextPath = []) {
        if (aPath.length === 1 && aPath[0] === "checked-id") {
            return this.getCheckedId();
        }
        return super.get(aPath, aBindingContextPath);
    }

    getCheckedId () {
        const sId = this.get(["current-list"]);
        return this.get([sId]);
    }

    updateList (sList) {
        this.set(["current-list"], sList);
    }

    setDefault (sTable, sId) {
        this.set([sTable], sId);
        this.save();
    }

    getDefault (sTable) {
        return this.get([sTable]) || 1;
    }

    processRead (oEvent, oData) {
        const bLanguageChanged = this._hasLanguageChanged(oData);
        this.mergeObjectIntoData(oData);

        if (bLanguageChanged) {
            LanguageModel.update();
            LanguageModel2.updateLanguage();
        }
        console.log("SettingsModel loaded");
    }

    processUpdate (oEvent) {
        this.update();

        if (this.updateLanguageModel) {
            this.updateLanguageModel = false;
            LanguageModel.update();
            LanguageModel2.updateLanguage();
        }
        console.log("SettingsModel updated");
    }

    _hasLanguageChanged (oData) {
        const sLanguage = this.get(["Language"]);
        return sLanguage !== oData.Language;
    }

    setLanguage (sLanguage) {
        this.updateLanguageModel = true;
        this.set(["Language"], sLanguage, true);

        this.save();
    }

    setDefaultDatabase () {
        const sPath = this.get(["CurrentDir"]);
        this.set(["DefaultDir"], sPath);
        this.save();
    }

    save () {
        EventBus.sendToDatabase("settings-update", this.get([]));
    }
}

export const SettingsModel = new _SettingsModel({
    "aboutDialog-i18n": ["about.link"],
    "database-section-i18n": ["settings.databaseSettings"],
    "current-database-i18n": ["settings.currentDatabase"],
    "database-create-i18n": ["settings.createDatabase"],
    "database-open-i18n": ["settings.openDatabase"],
    "database-open-user-i18n": ["settings.openUserDatabase"],
    "database-default-i18n": ["settings.setDefaultDatabase"],
    "language-section-i18n": ["settings.language"],
    "language-i18n": ["common.language"],
    "list-section-i18n": ["settings.lists"],
    "default-i18n": ["common.default"],
    "lists": [{
        "id": "Person",
        "i18n": ["common.persons"]
    }, {
        "id": "Account",
        "i18n": ["common.accounts"]
    }, {
        "id": "Type",
        "i18n": ["common.types"]
    }, {
        "id": "Store",
        "i18n": ["common.stores"]
    }],
    "current-list": "Person"
});
