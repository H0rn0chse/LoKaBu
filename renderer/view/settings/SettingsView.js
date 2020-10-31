import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { FlexContainer } from "../common/FlexContainer.js";
import { DropdownItem } from "../common/DropdownItem.js";
import { SettingsListItem } from "./SettingsListItem.js";
import { loadCss } from "../../common/Utils.js";
import { Icon } from "../common/Icon.js";

loadCss("/renderer/view/settings/SettingsView.css");
export class SettingsView extends View {
    constructor () {
        super();
        this.name = "SettingsView";
    }

    render () {
        const oNode = new DomElement("section")
            .addClass("settings")
            .appendNode(new FlexContainer("div", { flexDirection: "column", flexWrap: "nowrap" })
                // about dialog
                .appendNode(new DomElement("div")
                    .addClass("settings-aboutLink")
                    .setText(this.getTranslation("aboutDialog-i18n"))
                    .addEventListener("click", this.onOpenAbout, this)
                )
                // database settings
                .appendNode(new DomElement("div")
                    .addClass("group-header")
                    .setText(this.getTranslation("database-section-i18n"))
                )
                .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
                    .appendNode(new DomElement("div")
                        .setText(`${this.getTranslation("current-database-i18n")}: `)
                    )
                    .appendNode(new DomElement("div")
                        .setText(this.getProperty("database-path"))
                        .addEventListener("click", this.copyCurrentPath, this)
                    )
                )
                .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
                    .appendNode(new DomElement("div")
                        .addClass("button")
                        .setText(this.getTranslation("database-create-i18n"))
                        .addEventListener("click", this.onDatabaseCreate, this)
                    )
                    .appendNode(new DomElement("div")
                        .addClass("button")
                        .setText(this.getTranslation("database-open-i18n"))
                        .addEventListener("click", this.onDatabaseOpen, this)
                    )
                    .appendNode(new DomElement("div")
                        .addClass("button")
                        .setText(this.getTranslation("database-open-user-i18n"))
                        .addEventListener("click", this.onDatabaseOpenUser, this)
                    )
                    .appendNode(new DomElement("div")
                        .addClass("button")
                        .setText(this.getTranslation("database-default-i18n"))
                        .addEventListener("click", this.onDatabaseDefault, this)
                    )
                )
                // LanguageSettings
                .appendNode(new DomElement("div")
                    .addClass("group-header")
                    .setText(this.getTranslation("language-section-i18n"))
                )
                .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
                    .appendNode(new DomElement("div")
                        .setText(`${this.getTranslation("language-i18n")}: `)
                    )
                    .appendNode(new DomElement("select")
                        .insertAggregation(this, "languages", DropdownItem)
                        .sortChildren()
                        .setValue(this.getProperty("language"))
                        .addEventListener("change", this.onLanguageChange, this)
                    )
                )
                // list values
                .appendNode(new DomElement("div")
                    .addClass("group-header")
                    .setText(this.getTranslation("list-section-i18n"))
                )
                .appendNode(new DomElement("select")
                    .addClass("settings-lists-select")
                    .insertAggregation(this, "lists", DropdownItem)
                    .sortChildren()
                    .setValue(this.getProperty("current-list"))
                    .addEventListener("change", this.onListChange, this)
                )
                .appendNode(new FlexContainer("div", { flexDirection: "column", flexWrap: "nowrap" })
                    .addClass("settings-lists-list")
                    .appendNode(new DomElement("div")
                        .addClass("settings-lists-scroll")
                        .insertAggregation(this, this.getProperty("current-list"), SettingsListItem, this._addSettingListItemEventHandler.bind(this))
                    )
                    .appendNode(new Icon("plus-circle")
                        .addClass("cursorPointer")
                        .addEventListener("click", this.onAddListItem, this)
                    )
                )
            )
            .getNode();

        return oNode;
    }

    _addSettingListItemEventHandler (oItem) {
        oItem
            .addEventListener("listEntryChange", this.onListEntryChange, this)
            .addEventListener("listEntryDelete", this.onListEntryDelete, this);
    }

    _getListModel () {
        const sCurrentList = this.getProperty("current-list");
        return this.getAggregationBinding(sCurrentList).model;
    }

    onListEntryChange (oEvent) {
        oEvent.customData.model = this._getListModel();
        this.handleEvent("listEntryChange", oEvent);
    }

    onListEntryDelete (oEvent) {
        oEvent.customData.model = this._getListModel();
        this.handleEvent("listEntryDelete", oEvent);
    }

    onAddListItem (oEvent) {
        oEvent.customData = {
            model: this._getListModel()
        };
        this.handleEvent("addListItem", oEvent);
    }

    onDatabaseCreate (oEvent) {
        this.handleEvent("databaseCreate", oEvent);
    }

    onDatabaseOpen (oEvent) {
        this.handleEvent("databaseOpen", oEvent);
    }

    onDatabaseOpenUser (oEvent) {
        this.handleEvent("databaseOpenUser", oEvent);
    }

    onDatabaseDefault (oEvent) {
        this.handleEvent("databaseDefault", oEvent);
    }

    onListChange (oEvent) {
        oEvent.customData = {
            list: oEvent.target.value
        };
        this.handleEvent("listChange", oEvent);
    }

    onLanguageChange (oEvent) {
        oEvent.customData = {
            language: oEvent.target.value
        };
        this.handleEvent("languageChange", oEvent);
    }

    copyCurrentPath (oEvent) {
        const sText = this.getProperty("database-path");
        navigator.clipboard.writeText(sText);
    }

    onOpenAbout (oEvent) {
        this.handleEvent("openAbout", oEvent);
    }
};
