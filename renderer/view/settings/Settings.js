import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { FlexContainer } from "../common/FlexContainer.js";
import { DropdownItem } from "../common/DropdownItem.js";
import { SettingsListItem } from "./SettingsListItem.js";

export class Settings extends View {
    constructor () {
        super();
        this.name = "SettingsView";

        this.addEvents([
            "addListItem",
            "databaseCreate",
            "databaseOpen",
            "databaseOpenUser",
            "databaseDefault",
            "listChange",
            "languageChange",
            "listEntryChange"
        ]);
    }

    render () {
        const oNode = new DomElement("section")
            .addClass("settings")
            .appendNode(new FlexContainer("div", { flexDirection: "column", flexWrap: "nowrap" })
                // database settings
                .appendNode(new DomElement("div")
                    .setText(this.getTranslation("database-section-i18n"))
                )
                .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
                    .appendNode(new DomElement("div")
                        .setText(`${this.getTranslation("current-database-i18n")}: `)
                    )
                    .appendNode(new DomElement("div")
                        .setText(this.getProperty("database-path"))
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
                // default values
                .appendNode(new DomElement("div")
                    .setText(this.getTranslation("default-section-i18n"))
                )
                .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
                    .appendNode(new DomElement("div")
                        .setText(`${this.getTranslation("language-i18n")}: `)
                    )
                    .appendNode(new DomElement("select")
                        .insertAggregation(this, "languages", DropdownItem)
                        .setValue(this.getProperty("language"))
                        .sortChildren()
                        .addEventListener("change", this.onLanguageChange, this)
                    )
                )
                // list values
                .appendNode(new DomElement("div")
                    .setText(this.getTranslation("list-section-i18n"))
                )
                .appendNode(new DomElement("select")
                    .insertAggregation(this, "lists", DropdownItem)
                    .setValue(this.getProperty("current-list"))
                    .sortChildren()
                    .addEventListener("change", this.onListChange, this)
                )
                .appendNode(new FlexContainer("div", { flexDirection: "column", flexWrap: "nowrap" })
                    .insertAggregation(this, this.getProperty("current-list"), SettingsListItem, this._addSettingListItemEventHandler.bind(this))
                    .appendNode(new DomElement("div")
                        .addClass("buttonCircle")
                        .setText("+")
                        .addEventListener("click", this.onAddListItem, this)
                    )
                )
            )
            .getNode();

        return oNode;
    }

    _addSettingListItemEventHandler (oItem) {
        oItem
            .addEventListener("listEntryChange", this.onListEntryChange, this);
    }

    _getListModel () {
        const sCurrentList = this.getProperty("current-list");
        return this.getAggregationBinding(sCurrentList).model;
    }

    onListEntryChange (oEvent) {
        oEvent.customData.model = this._getListModel();
        this.handleEvent("listEntryChange", oEvent);
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
};
