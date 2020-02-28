const DatabaseWaiter = require("../../assets/databaseWaiter");
const oDateFormatter = require("../../assets/dateFormatter");
const oDropdown = require("../helper/dropdown");
const HtmlElement = require("../helper/htmlElement");
const oI18nHelper = require("../helper/i18n");
const oNavigation = require("./../../assets/navigation");
const stringMath = require('string-math');

const oSettings = require("../databaseObjects/settings");
const oStores = require("../databaseObjects/stores");
const oPersons = require("../databaseObjects/persons");
const oAccounts = require("../databaseObjects/accounts");
const oTypes = require("../databaseObjects/types");
const oReceiptDetail = require("../databaseObjects/receiptDetail");

const oDatabaseWaiter = new DatabaseWaiter();
oDatabaseWaiter.add(oSettings);
oDatabaseWaiter.add(oStores);
oDatabaseWaiter.add(oPersons);
oDatabaseWaiter.add(oAccounts);
oDatabaseWaiter.add(oTypes);
oDatabaseWaiter.add(oReceiptDetail);

document.addEventListener("databaseOpened_Level_1", (oEvent) => {
    window.detailSection.reset();
});

window.detailSection = {
    DomRef: document.querySelector("#section-detail"),
    initial: true,
    mode: "new",
    hasChanged: false,
    reset: function () {
        this.initial = true;
        this.init();
    },
    init: function () {
        if (this.initial) {
            this.initial = false;
            this._updateButtonActions();
            this._updateReceiptDropdowns();
            this._updateLineDropdowns();
            this._clearLines();
            this._clearInputs();
            this.addLine(true);
            this._calcResult();
            this.hasChanged = false;
        }
    },
    editReceipt: async function (sId) {
        oNavigation.navigateToSection("detail");
        let bResult = true;
        if (this.hasChanged) {
            const sMessage = await oI18nHelper.getProperty("detail.message.override");
            bResult = window.confirm(sMessage);
        }
        if (bResult) {
            this.mode = "edit";
            this._clearLines();
            this._clearInputs();
            const aLineDetails = await oReceiptDetail.get(sId);
            this._updateButtonActions();
            this.DomRef.querySelector("input[name=ID]").value = aLineDetails[0].ReceiptID;
            this.DomRef.querySelector("input[name=Date]").value = oDateFormatter.UnixToInput(aLineDetails[0].ReceiptDate);
            this.DomRef.querySelector("#Detail_Store").value = aLineDetails[0].ReceiptStore;
            this.DomRef.querySelector("#Detail_Account").value = aLineDetails[0].ReceiptAccount;
            this.DomRef.querySelector("#Detail_Comment").value = aLineDetails[0].ReceiptComment;
            Promise.all(aLineDetails.map((oLineDetail) => {
                return this.addLine(true).then((oLine) => {
                    oLine.querySelector("select.BillingAccount").value = oLineDetail.LineBilling;
                    oLine.querySelector("select.Type").value = oLineDetail.LineType;
                    oLine.querySelector("input.currency").value = oLineDetail.LineValue / 100;
                });
            })).then(() => {
                this.hasChanged = false;
                this._calcResult();
            });
        }
    },
    cancelEdit: function () {
        this.mode = "new";
        this.resetReceipt();
        oNavigation.navigateToSection("history");
    },
    deleteReceipt: async function () {
        await oDatabaseWaiter.getPromise();
        oReceiptDetail.delete(this.DomRef.querySelector("input[name=ID]").value);
        this.mode = "new";
        this.resetReceipt();
        window.historySection.doRefreshOnInit();
        oNavigation.navigateToSection("history");
    },
    saveReceipt: async function () {
        await oDatabaseWaiter.getPromise();
        const oDetails = this._getReceiptDetails();
        if (oDetails) {
            oReceiptDetail.update(oDetails);
            window.historySection.doRefreshOnInit();
        }
    },
    resetReceipt: function () {
        this.initial = true;
        this.init();
    },
    addReceipt: async function () {
        await oDatabaseWaiter.getPromise();
        const oDetails = this._getReceiptDetails();
        if (oDetails) {
            oReceiptDetail.add(oDetails);
            this.resetReceipt();
            window.historySection.doRefreshOnInit();
        }
    },
    addLine: async function (bSupressChange = false) {
        if (!bSupressChange) {
            this.changeReceipt();
        }
        const oLine = this._getLineTemplate("Detail_Lines");
        return this._updateLineDropdowns(oLine).then(() => {
            this.DomRef.querySelector("#Detail_Lines").appendChild(oLine);
            return oLine;
        });
    },
    removeLine: function (oEvent) {
        const oLine = oEvent.target.closest(".flexLine");
        oLine.parentNode.removeChild(oLine);
        this.changeReceipt();
    },
    changeReceipt: function () {
        this.hasChanged = true;
        this._calcResult();
    },
    _clearLines: function () {
        this.DomRef.querySelector("#Detail_Lines").innerHTML = "";
    },
    _clearInputs: function () {
        this.DomRef.querySelectorAll("input").forEach((oNode) => {
            oNode.value = "";
        });
        this.DomRef.querySelectorAll("textarea").forEach((oNode) => {
            oNode.value = "";
        });
    },
    _updateReceiptDropdowns: function () {
        return oDatabaseWaiter.getPromise().then(() => {
            let oElement = this.DomRef.querySelector("#Detail_Store");
            oDropdown.fill(oElement, oStores.get(), { value: "ID", displayName: "DisplayName" });

            oElement = this.DomRef.querySelector("#Detail_Account");
            oDropdown.fill(oElement, oAccounts.get(), { value: "ID", displayName: "DisplayName" });
        });
    },
    _updateLineDropdowns: function (aLineNodes) {
        if (aLineNodes === undefined) {
            aLineNodes = this.DomRef.querySelectorAll("#Detail_Lines .flexLine");
        } else if (aLineNodes instanceof Node) {
            aLineNodes = [aLineNodes];
        }
        return oDatabaseWaiter.getPromise().then(() => {
            aLineNodes.forEach((oLine) => {
                let oElement = oLine.querySelector("select.BillingAccount");
                oDropdown.fill(oElement, oPersons.get(), { value: "ID", displayName: "DisplayName" });
                oElement.value = oSettings.getProperty("Person");

                oElement = oLine.querySelector("select.Type");
                oDropdown.fill(oElement, oTypes.get(), { value: "ID", displayName: "DisplayName" });
                oElement.value = oSettings.getProperty("Type");
            });
        });
    },
    _updateButtonActions: function () {
        const oLine = this.DomRef.querySelector("#Detail_ReceiptActions");
        const aButtons = oLine.querySelectorAll(".button");
        const aVisibleButtons = [];
        switch (this.mode) {
            case "new":
                aVisibleButtons.push("reset");
                aVisibleButtons.push("add");
                break;
            case "edit":
                aVisibleButtons.push("cancel");
                aVisibleButtons.push("delete");
                aVisibleButtons.push("save");
                break;
        };

        aButtons.forEach((oButton) => {
            let bShouldBeVisible = false;
            aVisibleButtons.forEach((sClass) => {
                if (oButton.classList.contains(sClass)) {
                    bShouldBeVisible = true;
                }
            });
            if (bShouldBeVisible) {
                oButton.classList.remove("is-hidden");
            } else {
                oButton.classList.add("is-hidden");
            }
        });
    },
    _getLineTemplate: function (sType) {
        const oSpan = new HtmlElement("span", { classes: ["flexLine"] });
        switch (sType) {
            case "Detail_Lines":
                oSpan.appendChild(new HtmlElement("select", { classes: ["BillingAccount"], onchange: this.changeReceipt.bind(this) }));
                oSpan.appendChild(new HtmlElement("select", { classes: ["Type"], onchange: this.changeReceipt.bind(this) }));
                oSpan.appendChild(new HtmlElement("input", { classes: ["currency"], type: "text", name: "Value", onchange: this.changeReceipt.bind(this) }));
                oSpan.appendChild(new HtmlElement("div", { classes: ["button", "removeLine"], innerText: "-", onclick: this.removeLine.bind(this) }));
                break;
        }

        return oSpan;
    },
    _calcResult: function () {
        let fResult = 0;
        const aLineValues = this.DomRef.querySelectorAll("#Detail_Lines .flexLine input.currency");
        aLineValues.forEach((oValue) => {
            const sValue = oValue.value.replace(/,/g, ".");
            try {
                const fBefore = stringMath(sValue);
                const fAfter = (fBefore * 100).toString().split(".")[0] / 100;
                fResult += fAfter;
                if (fBefore !== fAfter) {
                    oValue.classList.add("converted");
                } else {
                    oValue.classList.remove("converted");
                }
                oValue.classList.remove("invalid");
            } catch (oErr) {
                oValue.classList.add("invalid");
            }
        });
        this.DomRef.querySelector("#Detail_Result").innerText = fResult.toFixed(2);
    },
    _getReceiptDetails: function () {
        const aReceiptDetails = [];
        const sReceiptID = this.DomRef.querySelector("input[name=ID]").value;
        const sReceiptDate = oDateFormatter.InputToUnix(this.DomRef.querySelector("input[name=Date]").value);
        if (Number.isNaN(sReceiptDate)) {
            this.DomRef.querySelector("input[name=Date]").classList.add("invalid");
        }
        const sReceiptStore = this.DomRef.querySelector("#Detail_Store").value;
        const sReceiptAccount = this.DomRef.querySelector("#Detail_Account").value;
        const sReceiptComment = this.DomRef.querySelector("#Detail_Comment").value;

        const aLines = this.DomRef.querySelectorAll("#Detail_Lines .flexLine");
        aLines.forEach((oLine) => {
            let sValue = oLine.querySelector("input.currency").value.replace(/,/g, ".");
            try {
                sValue = (stringMath(sValue) * 100).toString().split(".")[0];
            } catch (oErr) {
                oLine.querySelector("input.currency").classList.add("invalid");
                sValue = 0;
            }
            const oLineDetails = {
                ReceiptID: sReceiptID,
                ReceiptDate: sReceiptDate,
                ReceiptStore: sReceiptStore,
                ReceiptAccount: sReceiptAccount,
                ReceiptComment: sReceiptComment,
                LineBilling: oLine.querySelector("select.BillingAccount").value,
                LineType: oLine.querySelector("select.Type").value,
                LineValue: sValue
            };
            aReceiptDetails.push(oLineDetails);
        });
        if (this.DomRef.querySelectorAll(".invalid").length === 0) {
            return aReceiptDetails;
        }
    }
};
