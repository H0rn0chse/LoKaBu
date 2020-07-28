import { Controller } from "../common/Controller.js";
import { Settings } from "../../view/settings/Settings.js";
import { EventBus } from "../../EventBus.js";
import { AccountModel } from "../../model/database/AccountModel.js";
import { StoreModel } from "../../model/database/StoreModel.js";
import { PersonModel } from "../../model/database/PersonModel.js";
import { TypeModel } from "../../model/database/TypeModel.js";
import { LanguageModel } from "../../model/database/LanguageModel.js";
import { SettingsModel } from "../../model/view/SettingsModel.js";
import { Aggregation } from "../../common/Aggregation.js";

export class SettingsController extends Controller {
    constructor (oDomRef) {
        super(oDomRef);

        const oSettings = new Settings();
        const oSettingsContainer = this.createContainer("settings")
            .setContent(oSettings);

        oSettings.setParent(oSettingsContainer.getNode())
            .addModel(SettingsModel, "viewModel")
            .addModel(AccountModel, "account")
            .addModel(StoreModel, "store")
            .addModel(PersonModel, "person")
            .addModel(TypeModel, "type")
            .addModel(LanguageModel, "lang");

        // database settings
        oSettings
            .bindProperty("database-section-i18n", "viewModel", ["database-section-i18n"])
            .bindProperty("database-section-trans", "lang", "database-section-i18n")
            .bindProperty("current-database-i18n", "viewModel", ["current-database-i18n"])
            .bindProperty("current-database-trans", "lang", "current-database-i18n")
            .bindProperty("database-path", "viewModel", ["CurrentDir"])
            .bindProperty("database-create-i18n", "viewModel", ["database-create-i18n"])
            .bindProperty("database-create-trans", "lang", "database-create-i18n")
            .bindProperty("database-open-i18n", "viewModel", ["database-open-i18n"])
            .bindProperty("database-open-trans", "lang", "database-open-i18n")
            .bindProperty("database-open-user-i18n", "viewModel", ["database-open-user-i18n"])
            .bindProperty("database-open-user-trans", "lang", "database-open-user-i18n")
            .bindProperty("database-default-i18n", "viewModel", ["database-default-i18n"])
            .bindProperty("database-default-trans", "lang", "database-default-i18n");

        // default settings
        oSettings
            .bindProperty("default-section-i18n", "viewModel", ["default-section-i18n"])
            .bindProperty("default-section-trans", "lang", "default-section-i18n")
            .bindProperty("language-i18n", "viewModel", ["language-i18n"])
            .bindProperty("language-trans", "lang", "language-i18n")
            .bindAggregation("languages", new Aggregation("lang", ["languages"])
                .bindProperty("text", "lang", ["value"])
                .bindProperty("value", "lang", ["value"])
            )
            .bindProperty("language", "viewModel", ["Language"]);

        // default settings
        oSettings
            .bindProperty("list-section-i18n", "viewModel", ["list-section-i18n"])
            .bindProperty("list-section-trans", "lang", "list-section-i18n")
            .bindAggregation("lists", new Aggregation("viewModel", ["lists"])
                .bindProperty("i18n", "viewModel", ["i18n"])
                .bindProperty("text", "lang", "i18n")
                .bindProperty("value", "viewModel", ["id"])
            )
            .bindProperty("current-list", "viewModel", ["current-list"])
            .bindAggregation("persons", new Aggregation("person", ["persons"])
                .bindProperty("id", "person", ["id"])
                .bindProperty("text", "person", ["text"])

                .bindProperty("checked-id", "viewModel", ["checked-id"])
                .bindProperty("default-i18n", "viewModel", ["default-i18n"])
                .bindProperty("default-trans", "lang", "default-i18n")
            )
            .bindAggregation("accounts", new Aggregation("account", ["accounts"])
                .bindProperty("id", "account", ["id"])
                .bindProperty("text", "account", ["text"])
                .bindAggregation("select", new Aggregation("person", ["persons"])
                    .bindProperty("value", "person", ["id"])
                    .bindProperty("text", "person", ["text"])
                )
                .bindProperty("select-value", "account", ["owner"])

                .bindProperty("checked-id", "viewModel", ["checked-id"])
                .bindProperty("default-i18n", "viewModel", ["default-i18n"])
                .bindProperty("default-trans", "lang", "default-i18n")
            )
            .bindAggregation("types", new Aggregation("type", ["types"])
                .bindProperty("id", "type", ["id"])
                .bindProperty("text", "type", ["text"])

                .bindProperty("checked-id", "viewModel", ["checked-id"])
                .bindProperty("default-i18n", "viewModel", ["default-i18n"])
                .bindProperty("default-trans", "lang", "default-i18n")
            )
            .bindAggregation("stores", new Aggregation("store", ["stores"])
                .bindProperty("id", "store", ["id"])
                .bindProperty("text", "store", ["text"])

                .bindProperty("checked-id", "viewModel", ["checked-id"])
                .bindProperty("default-i18n", "viewModel", ["default-i18n"])
                .bindProperty("default-trans", "lang", "default-i18n")
            );

        oSettings
            .addEventListener("addListItem", this.onAddListItem, this)
            .addEventListener("databaseCreate", this.onDatabaseCreate, this)
            .addEventListener("databaseOpen", this.onDatabaseOpen, this)
            .addEventListener("databaseOpenUser", this.onDatabaseOpenUser, this)
            .addEventListener("databaseDefault", this.onDatabaseDefault, this)
            .addEventListener("listChange", this.onListChange, this)
            .addEventListener("defaultChange", this.onDefaultChange, this)
            .addEventListener("nameChange", this.onNameChange, this)
            .addEventListener("selectChange", this.onSelectChange, this)
            .addEventListener("languageChange", this.onLanguageChange, this);

        EventBus.listen("navigation", this.onNavigation, this);
    }

    onNavigation (sSection) {
        this.getContainer("settings").setVisibilty(sSection === "settings");
    }

    onAddListItem (oEvent) {
        const sModel = oEvent.customData.model;
        const oModel = this.getContainer("settings").getContent().getModel(sModel);
        console.log(oModel);
    }

    onDatabaseCreate (oEvent) {
        console.log("databaseCreate", oEvent.customData);
    }

    onDatabaseOpen (oEvent) {
        console.log("databaseOpen", oEvent.customData);
    }

    onDatabaseOpenUser (oEvent) {
        console.log("databaseOpenUser", oEvent.customData);
    }

    onDatabaseDefault (oEvent) {
        console.log("databaseDefault", oEvent.customData);
    }

    onListChange (oEvent) {
        console.log("listChange", oEvent.customData);
        const sList = oEvent.customData.list;
        SettingsModel.updateList(sList);
    }

    onDefaultChange (oEvent) {
        console.log("defaultChange", oEvent.customData);
    }

    onNameChange (oEvent) {
        console.log("nameChange", oEvent.customData);
    }

    onSelectChange (oEvent) {
        console.log("selectChange", oEvent.customData);
    }

    onLanguageChange (oEvent) {
        const sLanguage = oEvent.customData.language;
        SettingsModel.setLanguage(sLanguage);
    }
};
