/* eslint-disable quote-props */
import { Model } from "../common/Model.js";
import { LanguageModel } from "../database/LanguageModel.js";
import { EventBus } from "../../EventBus.js";

class _SettingsModel extends Model {
    constructor (...args) {
        super(...args);
        this.updateLanguageModel = true;

        EventBus.sendToDatabase("settings-read");
        EventBus.listen("settings-read", (oEvent, oData) => {
            console.log("SettingsModel loaded");
            this.mergeObjectIntoData(oData);

            if (this.updateLanguageModel) {
                this.updateLanguageModel = false;
                LanguageModel.update();
            }
        });

        EventBus.listen("settings-update", (oEvent, oData) => {
            this.update();

            if (this.updateLanguageModel) {
                this.updateLanguageModel = false;
                LanguageModel.update();
            }
        });
    }

    get (aPath, aBindingContextPath = []) {
        if (aPath.length === 1 && aPath[0] === "checked-id") {
            return this.getCheckedId();
        }
        return super.get(aPath, aBindingContextPath);
    }

    getCheckedId () {
        const oCurrentList = {
            id: this.get(["current-list"])
        };
        return this.get(["lists", oCurrentList, "default"]);
    }

    updateList (sList) {
        this.set(["current-list"], sList);
    }

    setLanguage (sLanguage) {
        // views can indirectly consume this model
        this.updateLanguageModel = true;

        const aPath = ["Language"];
        this.set(aPath, sLanguage, true);
        this.save();
    }

    setDefault (sList, sId) {
        const aPath = ["lists", { "id": sList }, "default"];
        this.set(aPath, sId);
    }

    save () {
        EventBus.sendToDatabase("settings-update", this.get([]));
    }
}

export const SettingsModel = new _SettingsModel({
    "database-section-i18n": ["settings.databaseSettings"],
    "current-database-i18n": ["settings.currentDatabase"],
    "database-create-i18n": ["settings.createDatabase"],
    "database-open-i18n": ["settings.openDatabase"],
    "database-open-user-i18n": ["settings.openUserDatabase"],
    "database-default-i18n": ["settings.setDefaultDatabase"],
    "default-section-i18n": ["settings.defaultValues"],
    "language-i18n": ["common.language"],
    "list-section-i18n": ["settings.lists"],

    "lists": [{
        "id": "persons",
        "i18n": ["common.persons"],
        "default": 1
    }, {
        "id": "accounts",
        "i18n": ["common.accounts"],
        "default": 2
    }, {
        "id": "types",
        "i18n": ["common.types"],
        "default": 3
    }, {
        "id": "stores",
        "i18n": ["common.stores"],
        "default": 1
    }],
    "current-list": "persons",
    "default-i18n": ["common.default"]

    /* "database-path": "C:/somePath/to/A/File.sqlite",
    "current-language": "de", */
});
