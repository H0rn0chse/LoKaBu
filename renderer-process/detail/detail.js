const DatabaseWaiter = require("../../assets/databaseWaiter");
const oDateFormatter = require("../../assets/dateFormatter");
const oDropdown = require("../helper/dropdown");
const HtmlElement = require("../helper/htmlElement");
const oI18nHelper = require("../helper/i18n");
const oNavigation = require("./../../assets/navigation");

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

window.detailSection = {
    DomRef: document.querySelector("#section-detail"),
    initial: true,
    mode: "new",
    hasChanged: false,
    init: function () {
        if (this.initial) {
            this._updateButtonActions();
            this._updateReceiptDropdowns();
            this._updateLineDropdowns();
            this._clearLines();
            this._clearInputs();
            this.addLine(true);
            this.initial = false;
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
            aLineDetails.forEach((oLineDetail) => {
                this.addLine(true).then((oLine) => {
                    oLine.querySelector("select.BillingAccount").value = oLineDetail.LineBilling;
                    oLine.querySelector("select.Type").value = oLineDetail.LineType;
                    oLine.querySelector("input.currency").value = oLineDetail.LineValue / 100;
                });
            });
            this.hasChanged = false;
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
        oReceiptDetail.update(this._getReceiptDetails());
        window.historySection.doRefreshOnInit();
    },
    resetReceipt: function () {
        this.initial = true;
        this.init();
    },
    addReceipt: async function () {
        await oDatabaseWaiter.getPromise();
        oReceiptDetail.add(this._getReceiptDetails());
        this.resetReceipt();
        window.historySection.doRefreshOnInit();
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
    _getReceiptDetails: function () {
        const aReceiptDetails = [];
        const sReceiptID = this.DomRef.querySelector("input[name=ID]").value;
        const sReceiptDate = oDateFormatter.InputToUnix(this.DomRef.querySelector("input[name=Date]").value);
        const sReceiptStore = this.DomRef.querySelector("#Detail_Store").value;
        const sReceiptAccount = this.DomRef.querySelector("#Detail_Account").value;
        const sReceiptComment = this.DomRef.querySelector("#Detail_Comment").value;

        const aLines = this.DomRef.querySelectorAll("#Detail_Lines .flexLine");
        aLines.forEach((oLine) => {
            const oLineDetails = {
                ReceiptID: sReceiptID,
                ReceiptDate: sReceiptDate,
                ReceiptStore: sReceiptStore,
                ReceiptAccount: sReceiptAccount,
                ReceiptComment: sReceiptComment,
                LineBilling: oLine.querySelector("select.BillingAccount").value,
                LineType: oLine.querySelector("select.Type").value,
                LineValue: Math.round(oLine.querySelector("input.currency").value.replace(",", ".") * 100)
            };
            aReceiptDetails.push(oLineDetails);
        });
        return aReceiptDetails;
    }
};
