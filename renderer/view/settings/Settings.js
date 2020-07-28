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
            "languageChange"
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
                        .addEventHandler("click", this.onDatabaseCreate, this)
                    )
                    .appendNode(new DomElement("div")
                        .setText(this.getProperty("database-open-trans"))
                        .addEventHandler("click", this.onDatabaseOpen, this)
                    )
                    .appendNode(new DomElement("div")
                        .setText(this.getProperty("database-open-user-trans"))
                        .addEventHandler("click", this.onDatabaseOpenUser, this)
                    )
                    .appendNode(new DomElement("div")
                        .setText(this.getProperty("database-default-trans"))
                        .addEventHandler("click", this.onDatabaseDefault, this)
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
                        .addEventHandler("change", this.onLanguageChange, this)
                    )
                )
                // list values
                .appendNode(new DomElement("div")
                    .setText(this.getProperty("list-section-trans"))
                )
                .appendNode(new DomElement("select")
                    .insertAggregation(this, "lists", DropdownItem)
                    .setValue(this.getProperty("current-list"))
                    .addEventHandler("change", this.onListChange, this)
                )
                .appendNode(new FlexContainer("div", { flexDirection: "column", flexWrap: "nowrap" })
                    .insertAggregation(this, this.getProperty("current-list"), SettingListItem, this.addGenericListenerToChild.bind(this))
                    .appendNode(new DomElement("div")
                        .setText("+")
                        .addEventHandler("click", this.onAddListItem, this)
                    )
                )
            )
            .getNode();

        return oNode;
    }

    onAddListItem (oEvent) {
        const sCurrentList = this.getProperty("current-list");
        oEvent.customData = {
            model: this.getAggregationBinding(sCurrentList).model
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
