const DatabaseWaiter = require("../../assets/databaseWaiter");
const oDropdown = require("../helper/dropdown");
const HtmlElement = require("../helper/htmlElement");
const oI18nHelper = require("../helper/i18n");

const oDatabaseOpenDialog = require("./../dialogs/databaseOpen");
const oDatabaseCreateDialog = require("./../dialogs/databaseCreate");

const oSettings = require("../databaseObjects/settings");
const oPersons = require("../databaseObjects/persons");
const oAccounts = require("../databaseObjects/accounts");
const oTypes = require("../databaseObjects/types");
const oStores = require("../databaseObjects/stores");
const oDatabaseInfo = require("./../databaseObjects/databaseInfo");

const oDatabaseWaiter = new DatabaseWaiter();
oDatabaseWaiter.add(oSettings);
oDatabaseWaiter.add(oPersons);
oDatabaseWaiter.add(oAccounts);
oDatabaseWaiter.add(oTypes);
oDatabaseWaiter.add(oStores);
oDatabaseWaiter.add(oDatabaseInfo);

document.addEventListener("databaseOpened_Level_1", (oEvent) => {
    window.settingsSection.reset();
});

window.settingsSection = {
    DomRef: document.querySelector("#section-settings"),
    initial: true,
    reset: function () {
        this.init();
    },
    init: function () {
        oSettings.removeListener("settings", this.init.bind(this));
        oPersons.removeListener("settings", this.init.bind(this));
        oAccounts.removeListener("settings", this.init.bind(this));
        oTypes.removeListener("settings", this.init.bind(this));
        oStores.removeListener("settings", this.init.bind(this));
        this._clearAll();

        oDatabaseWaiter.getPromise().then(() => {
            let oElement;

            oElement = document.querySelector("#section-settings .currentDatabase");
            oElement.value = oSettings.getProperty("CurrentDir");

            oElement = document.querySelector("#section-settings .Language");
            oDropdown.fill(oElement, oI18nHelper.getLanguages().map((sKey) => {
                return { value: sKey, displayName: sKey };
            }));
            oElement.value = oSettings.getProperty("Language");

            oElement = document.querySelector("#section-settings .BillingAccount");
            oDropdown.fill(oElement, oPersons.get(), { value: "ID", displayName: "DisplayName" });
            oElement.value = oSettings.getProperty("Person");

            oElement = document.querySelector("#section-settings .Type");
            oDropdown.fill(oElement, oTypes.get(), { value: "ID", displayName: "DisplayName" });
            oElement.value = oSettings.getProperty("Type");

            // Generates the Lists
            [[oPersons, "Settings_Persons"], [oAccounts, "Settings_Accounts"], [oTypes, "Settings_Types"], [oStores, "Settings_Stores"]].forEach((aDatabase) => {
                aDatabase[0].get().forEach((oItem) => {
                    const oNewLine = this._getLineTemplate(aDatabase[1]);
                    document.querySelector("#" + aDatabase[1]).append(oNewLine);
                    oNewLine.querySelector("[name=ID]").value = oItem.ID;
                    oNewLine.querySelector("[name=DisplayName]").value = oItem.DisplayName;
                    if (oItem.Owner) {
                        oNewLine.querySelector("[name=Owner]").value = oItem.Owner;
                    }
                });
            });

            oSettings.addListener("settings", this.init.bind(this));
            oPersons.addListener("settings", this.init.bind(this));
            oAccounts.addListener("settings", this.init.bind(this));
            oTypes.addListener("settings", this.init.bind(this));
            oStores.addListener("settings", this.init.bind(this));
        });
        if (this.initial) {
            this.initial = false;
        }
    },
    _clearAll: function () {
        document.querySelector("#section-settings .BillingAccount").innerHTML = "";
        document.querySelector("#section-settings .Type").innerHTML = "";
        document.querySelector("#Settings_Persons").innerHTML = "";
        document.querySelector("#Settings_Accounts").innerHTML = "";
        document.querySelector("#Settings_Types").innerHTML = "";
        document.querySelector("#Settings_Stores").innerHTML = "";
    },
    _markAsChanged: function (oEvent) {
        oEvent.target.parentElement.classList.add("changed");
    },
    _getLineTemplate: function (sType) {
        const oSpan = new HtmlElement("span", { classes: ["flexLine"] });
        switch (sType) {
            case "Settings_Persons":
                oSpan.appendChild(new HtmlElement("input", { type: "text", name: "ID", disabled: true }));
                oSpan.appendChild(new HtmlElement("input", { type: "text", name: "DisplayName", onchange: this._markAsChanged }));
                break;
            case "Settings_Accounts":
                oSpan.appendChild(new HtmlElement("input", { type: "text", name: "ID", disabled: true }));
                oSpan.appendChild(new HtmlElement("input", { type: "text", name: "DisplayName", onchange: this._markAsChanged }));
                oSpan.appendChild(new HtmlElement("input", { type: "text", name: "Owner", onchange: this._markAsChanged }));
                break;
            case "Settings_Types":
                oSpan.appendChild(new HtmlElement("input", { type: "text", name: "ID", disabled: true }));
                oSpan.appendChild(new HtmlElement("input", { type: "text", name: "DisplayName", onchange: this._markAsChanged }));
                break;
            case "Settings_Stores":
                oSpan.appendChild(new HtmlElement("input", { type: "text", name: "ID", disabled: true }));
                oSpan.appendChild(new HtmlElement("input", { type: "text", name: "DisplayName", onchange: this._markAsChanged }));
                break;
        }
        return oSpan;
    },
    save: function () {
        oDatabaseWaiter.getPromise().then(() => {
            oSettings.setProperty("Language", document.querySelector("#section-settings .Language").value);
            oSettings.setProperty("Person", document.querySelector("#section-settings .BillingAccount").value);
            oSettings.setProperty("Type", document.querySelector("#section-settings .Type").value);

            const aChangedLines = document.querySelectorAll(".changed:not(.added)");
            aChangedLines.forEach((oLine) => {
                const sId = oLine.querySelector("[name=ID]").value;
                const oParams = {
                    DisplayName: oLine.querySelector("[name=DisplayName]").value,
                    Owner: null
                };
                if (oLine.querySelector("[name=Owner]")) {
                    oParams.Owner = oLine.querySelector("[name=Owner]").value;
                }

                switch (oLine.parentElement.id) {
                    case "Settings_Persons":
                        oPersons.update(sId, oParams);
                        break;
                    case "Settings_Accounts":
                        oAccounts.update(sId, oParams);
                        break;
                    case "Settings_Types":
                        oTypes.update(sId, oParams);
                        break;
                    case "Settings_Stores":
                        oStores.update(sId, oParams);
                        break;
                }
                oLine.classList.remove("changed");
            });
            const aAddedLines = document.querySelectorAll(".added");
            aAddedLines.forEach((oLine) => {
                const oParams = {
                    DisplayName: oLine.querySelector("[name=DisplayName]").value,
                    Owner: null
                };
                if (oLine.querySelector("[name=Owner]")) {
                    oParams.Owner = oLine.querySelector("[name=Owner]").value;
                }

                if (oParams.DisplayName !== undefined && oParams.Owner !== undefined) {
                    switch (oLine.parentElement.id) {
                        case "Settings_Persons":
                            oPersons.add(oParams);
                            break;
                        case "Settings_Accounts":
                            oAccounts.add(oParams);
                            break;
                        case "Settings_Types":
                            oTypes.add(oParams);
                            break;
                        case "Settings_Stores":
                            oStores.add(oParams);
                            break;
                    }
                    oLine.classList.remove("added");
                } else {
                    oLine.parentElement.removeChild(oLine);
                }
            });
        });
    },
    addLine: function (sType) {
        const oNewLine = this._getLineTemplate(sType);
        oNewLine.classList.add("added");
        document.querySelector("#" + sType).append(oNewLine);
    },
    createSharedDatabase: function () {
        oDatabaseCreateDialog.open().then(result => {
            if (!result.canceled) {
                oDatabaseInfo.openDatabase(result.filePath);
            }
        });
    },
    openSharedDatabase: function () {
        oDatabaseOpenDialog.open()
            .then(result => {
                if (!result.canceled) {
                    oDatabaseInfo.createDatabase(result.filePaths[0]);
                }
            });
    },
    openUserDatabase: function () {
        oDatabaseInfo.openDatabase();
    },
    setDefaultDatabase: function () {
        oSettings.setProperty("DefaultDir", document.querySelector("#section-settings .currentDatabase").value);
    }
};
