import { Controller } from "./common/Controller.js";
import { SettingsView } from "../view/settings/SettingsView.js";
import { EventBus } from "../EventBus.js";
import { AccountModel } from "../model/AccountModel.js";
import { StoreModel } from "../model/StoreModel.js";
import { PersonModel } from "../model/PersonModel.js";
import { TypeModel } from "../model/TypeModel.js";
import { SettingsModel } from "../model/SettingsModel.js";
import { Aggregation } from "../common/Aggregation.js";
import { CreateDatabaseDialog } from "../dialogs/CreateDatabaseDialog.js";
import { OpenDatabaseDialog } from "../dialogs/OpenDatabaseDialog.js";
import { AboutDialog } from "../dialogs/AboutDialog.js";
import { ReplaceDialog } from "../dialogs/ReplaceDialog.js";

export class SettingsController extends Controller {
    constructor (oDomRef) {
        super(oDomRef);

        const oSettings = this.addView("settings", SettingsView);

        oSettings
            .addModel(SettingsModel, "viewModel")
            .addModel(AccountModel, "account")
            .addModel(StoreModel, "store")
            .addModel(PersonModel, "person")
            .addModel(TypeModel, "type");

        // about dialog link
        oSettings
            .bindProperty("aboutDialog-i18n", "viewModel", ["aboutDialog-i18n"]);

        // database settings
        oSettings
            .bindProperty("database-section-i18n", "viewModel", ["database-section-i18n"])
            .bindProperty("current-database-i18n", "viewModel", ["current-database-i18n"])
            .bindProperty("database-path", "viewModel", ["CurrentDir"])
            .bindProperty("database-create-i18n", "viewModel", ["database-create-i18n"])
            .bindProperty("database-open-i18n", "viewModel", ["database-open-i18n"])
            .bindProperty("database-open-user-i18n", "viewModel", ["database-open-user-i18n"])
            .bindProperty("database-default-i18n", "viewModel", ["database-default-i18n"]);

        // language settings
        oSettings
            .bindProperty("language-section-i18n", "viewModel", ["language-section-i18n"])
            .bindProperty("language-i18n", "viewModel", ["language-i18n"])
            .bindAggregation("languages", new Aggregation("lang", ["languages"])
                .bindProperty("text", "lang", ["value"])
                .bindProperty("value", "lang", ["value"])
            )
            .bindProperty("language", "viewModel", ["Language"]);

        // default settings
        oSettings
            .bindProperty("list-section-i18n", "viewModel", ["list-section-i18n"])
            .bindAggregation("lists", new Aggregation("viewModel", ["lists"])
                .bindProperty("i18n", "viewModel", ["i18n"])
                .bindProperty("text", "lang", "i18n")
                .bindProperty("value", "viewModel", ["id"])
            )
            .bindProperty("current-list", "viewModel", ["current-list"])
            .bindAggregation("Person", new Aggregation("person", ["persons"])
                .bindProperty("id", "person", ["ID"])
                .bindProperty("text", "person", ["DisplayName"])

                .bindProperty("checked-id", "viewModel", ["checked-id"])
                .bindProperty("default-i18n", "viewModel", ["default-i18n"])
            )
            .bindAggregation("Account", new Aggregation("account", ["accounts"])
                .bindProperty("id", "account", ["ID"])
                .bindProperty("text", "account", ["DisplayName"])
                .bindAggregation("select", new Aggregation("person", ["persons"])
                    .bindProperty("value", "person", ["ID"])
                    .bindProperty("text", "person", ["DisplayName"])
                )
                .bindProperty("select-value", "account", ["Owner"])

                .bindProperty("checked-id", "viewModel", ["checked-id"])
                .bindProperty("default-i18n", "viewModel", ["default-i18n"])
            )
            .bindAggregation("Type", new Aggregation("type", ["types"])
                .bindProperty("id", "type", ["ID"])
                .bindProperty("text", "type", ["DisplayName"])

                .bindProperty("checked-id", "viewModel", ["checked-id"])
                .bindProperty("default-i18n", "viewModel", ["default-i18n"])
            )
            .bindAggregation("Store", new Aggregation("store", ["stores"])
                .bindProperty("id", "store", ["ID"])
                .bindProperty("text", "store", ["DisplayName"])

                .bindProperty("checked-id", "viewModel", ["checked-id"])
                .bindProperty("default-i18n", "viewModel", ["default-i18n"])
            );

        oSettings
            .addEventListener("addListItem", this.onAddListItem, this)
            .addEventListener("databaseCreate", this.onDatabaseCreate, this)
            .addEventListener("databaseOpen", this.onDatabaseOpen, this)
            .addEventListener("databaseOpenUser", this.onDatabaseOpenUser, this)
            .addEventListener("databaseDefault", this.onDatabaseDefault, this)
            .addEventListener("listChange", this.onListChange, this)
            .addEventListener("listEntryChange", this.onListEntryChange, this)
            .addEventListener("listEntryDelete", this.onListEntryDelete, this)
            .addEventListener("languageChange", this.onLanguageChange, this)
            .addEventListener("openAbout", this.onOpenAbout, this);

        EventBus.listen("navigation", this.onNavigation, this);
    }

    onNavigation (sSection) {
        this.getContainer("settings").setVisibilty(sSection === "settings");
    }

    onDatabaseCreate (oEvent) {
        CreateDatabaseDialog.show()
            .then(oResult => {
                EventBus.sendToDatabase("database-create", oResult.filePath);
            })
            .catch(() => {});
    }

    onDatabaseOpen (oEvent) {
        OpenDatabaseDialog.show()
            .then(oResult => {
                EventBus.sendToDatabase("database-open", oResult.filePaths[0]);
            })
            .catch(() => {});
    }

    onDatabaseOpenUser (oEvent) {
        EventBus.sendToDatabase("database-open");
    }

    onDatabaseDefault (oEvent) {
        SettingsModel.setDefaultDatabase();
    }

    onListChange (oEvent) {
        const sList = oEvent.customData.list;
        SettingsModel.updateList(sList);
    }

    onAddListItem (oEvent) {
        const oData = oEvent.customData;
        const oModel = this.getContainer("settings").getContent().getModel(oData.model);
        oModel.addEntry();
    }

    onListEntryChange (oEvent) {
        const oData = oEvent.customData;
        const oModel = this.getContainer("settings").getContent().getModel(oData.model);
        oModel.updateEntry(oData.id, oData.name, oData.select);
        if (oData.default) {
            oModel.setDefault(oData.id);
        }
    }

    onListEntryDelete (oEvent) {
        const oData = oEvent.customData;
        const oModel = this.getContainer("settings").getContent().getModel(oData.model);

        ReplaceDialog.show(oModel, oData.id)
            .then((oResult) => {
                // eslint-disable-next-line eqeqeq
                if (oData.id != oResult.id) {
                    oModel.replaceEntry(oData.id, oResult.id);
                    oModel.deleteEntry(oData.id);
                }
            })
            .catch(() => {});
    }

    onLanguageChange (oEvent) {
        const sLanguage = oEvent.customData.language;
        SettingsModel.setLanguage(sLanguage);
    }

    onOpenAbout (oEvent) {
        AboutDialog.show();
    }
};
