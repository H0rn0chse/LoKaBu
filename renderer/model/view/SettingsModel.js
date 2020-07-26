/* eslint-disable quote-props */
import { Model } from "../common/Model.js";

class _SettingsModel extends Model {
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
}

export const SettingsModel = new _SettingsModel({
    "database-section-i18n": ["settings.databaseSettings"],
    "current-database-i18n": ["settings.currentDatabase"],
    "database-path": "C:/somePath/to/A/File.sqlite",
    "database-create-i18n": ["settings.createDatabase"],
    "database-open-i18n": ["settings.openDatabase"],
    "database-open-user-i18n": ["settings.openUserDatabase"],
    "database-default-i18n": ["settings.setDefaultDatabase"],

    "default-section-i18n": ["settings.defaultValues"],
    "language-i18n": ["common.language"],
    "currentLanguage": "de",

    "list-section-i18n": ["settings.lists"],

    "lists": [{
        "id": "persons",
        "i18n": ["common.persons"],
        "default": "0"
    }, {
        "id": "accounts",
        "i18n": ["common.accounts"],
        "default": "1"
    }, {
        "id": "types",
        "i18n": ["common.types"],
        "default": "2"
    }, {
        "id": "stores",
        "i18n": ["common.stores"],
        "default": "0"
    }],
    "current-list": "accounts",
    "default-i18n": ["common.default"]
});
