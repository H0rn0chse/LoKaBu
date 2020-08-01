import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { FlexContainer } from "../common/FlexContainer.js";
import { DropdownItem } from "../common/DropdownItem.js";
import { SettingListItem } from "./SettingListItem.js";

export class Settings extends View {
    constructor () {
        super();
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
                    .setText(this.getProperty("database-section-trans"))
                )
                .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
                    .appendNode(new DomElement("div")
                        .setText(`${this.getProperty("current-database-trans")}: `)
                    )
                    .appendNode(new DomElement("input")
                        .setType("text")
                        .setDisabled()
                        .setValue(this.getProperty("database-path"))
                    )
                )
                .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
                    .appendNode(new DomElement("div")
                        .setText(this.getProperty("database-create-trans"))
                        .addEventListener("click", this.onDatabaseCreate, this)
                    )
                    .appendNode(new DomElement("div")
                        .setText(this.getProperty("database-open-trans"))
                        .addEventListener("click", this.onDatabaseOpen, this)
                    )
                    .appendNode(new DomElement("div")
                        .setText(this.getProperty("database-open-user-trans"))
                        .addEventListener("click", this.onDatabaseOpenUser, this)
                    )
                    .appendNode(new DomElement("div")
                        .setText(this.getProperty("database-default-trans"))
                        .addEventListener("click", this.onDatabaseDefault, this)
                    )
                )
                // default values
                .appendNode(new DomElement("div")
                    .setText(this.getProperty("default-section-trans"))
                )
                .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
                    .appendNode(new DomElement("div")
                        .setText(`${this.getProperty("language-trans")}: `)
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
                    .setText(this.getProperty("list-section-trans"))
                )
                .appendNode(new DomElement("select")
                    .insertAggregation(this, "lists", DropdownItem)
                    .setValue(this.getProperty("current-list"))
                    .sortChildren()
                    .addEventListener("change", this.onListChange, this)
                )
                .appendNode(new FlexContainer("div", { flexDirection: "column", flexWrap: "nowrap" })
                    .insertAggregation(this, this.getProperty("current-list"), SettingListItem, this._addSettingListItemEventHandler.bind(this))
                    .appendNode(new DomElement("div")
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
