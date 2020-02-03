const DatabaseWaiter = require("../../assets/databaseWaiter");
const oDropdown = require("../helper/dropdown");
const HtmlElement = require("../helper/htmlElement");
const oI18nHelper = require("../helper/i18n");

const oSettings = require("../databaseObjects/settings");
const oPersons = require("../databaseObjects/persons");
const oAccounts = require("../databaseObjects/accounts");
const oTypes = require("../databaseObjects/types");
const oStores = require("../databaseObjects/stores");
const oI18n = require("../databaseObjects/i18n");

window.settingsSection = {
    reset: function () {
        document.querySelector("#section-settings .BillingAccount").innerHTML = "";
        document.querySelector("#section-settings .Type").innerHTML = "";
        document.querySelector("#Settings_Persons").innerHTML = "";
        document.querySelector("#Settings_Accounts").innerHTML = "";
        document.querySelector("#Settings_Types").innerHTML = "";
        document.querySelector("#Settings_Stores").innerHTML = "";
    },
    init: function () {
        this.reset();

        const oDatabaseWaiter = new DatabaseWaiter();
        oDatabaseWaiter.add(oSettings);
        oDatabaseWaiter.add(oPersons);
        oDatabaseWaiter.add(oAccounts);
        oDatabaseWaiter.add(oTypes);
        oDatabaseWaiter.add(oStores);
        oDatabaseWaiter.add(oI18n);

        oDatabaseWaiter.getPromise().then(() => {
            let oElement;

            oElement = document.querySelector("#section-settings .Language");
            oDropdown.fill(oElement, oI18nHelper.getLanguages().map((sKey) => {
                return { ID: sKey, DisplayName: sKey };
            }));
            oElement.value = oSettings.getProperty("Language");

            oElement = document.querySelector("#section-settings .BillingAccount");
            oDropdown.fill(oElement, oPersons.get());
            oElement.value = oSettings.getProperty("Person");

            oElement = document.querySelector("#section-settings .Type");
            oDropdown.fill(oElement, oTypes.get());
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
        });
    },
    _getLineTemplate: function (sType) {
        const oSpan = new HtmlElement("span", { classes: ["flexLine"] });
        switch (sType) {
            case "Settings_Persons":
                oSpan.appendChild(new HtmlElement("input", { type: "text", name: "ID", disabled: true }));
                oSpan.appendChild(new HtmlElement("input", { type: "text", name: "DisplayName" }));
                break;
            case "Settings_Accounts":
                oSpan.appendChild(new HtmlElement("input", { type: "text", name: "ID", disabled: true }));
                oSpan.appendChild(new HtmlElement("input", { type: "text", name: "DisplayName" }));
                oSpan.appendChild(new HtmlElement("input", { type: "text", name: "Owner" }));
                break;
            case "Settings_Types":
                oSpan.appendChild(new HtmlElement("input", { type: "text", name: "ID", disabled: true }));
                oSpan.appendChild(new HtmlElement("input", { type: "text", name: "DisplayName" }));
                break;
            case "Settings_Stores":
                oSpan.appendChild(new HtmlElement("input", { type: "text", name: "ID", disabled: true }));
                oSpan.appendChild(new HtmlElement("input", { type: "text", name: "DisplayName" }));
                break;
        }
        return oSpan;
    },
    save: function () {
        const oDatabaseWaiter = new DatabaseWaiter();
        oDatabaseWaiter.add(oSettings);
        // oDatabaseWaiter.add(oPersons);
        // oDatabaseWaiter.add(oAccounts);
        // oDatabaseWaiter.add(oTypes);
        // oDatabaseWaiter.add(oStores);
        // oDatabaseWaiter.add(oI18n);

        oDatabaseWaiter.getPromise().then(() => {
            oSettings.setProperty("Language", document.querySelector("#section-settings .Language").value);
            oSettings.setProperty("Person", document.querySelector("#section-settings .BillingAccount").value);
            oSettings.setProperty("Type", document.querySelector("#section-settings .Type").value);
        });
    }
};
