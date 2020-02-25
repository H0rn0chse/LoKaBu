const DatabaseWaiter = require("../../assets/databaseWaiter");
const oDropdown = require("../helper/dropdown");
const HtmlElement = require("../helper/htmlElement");
const oI18nHelper = require("../helper/i18n");
const oDateFormatter = require("./../../assets/dateFormatter");
const FilterOption = require("./../../assets/filterOption");

const oReceiptList = require("../databaseObjects/receiptList");

const oDatabaseWaiter = new DatabaseWaiter();
oDatabaseWaiter.add(oReceiptList);

window.historySection = {
    filterOptions: [],
    bRefresh: false,
    reset: function () {
        document.querySelector("#History_Filter").innerHTML = "";
        document.querySelector("#History_Receipts").innerHTML = "";
    },
    init: function () {
        const oContainer = document.querySelector("#History_Filter");
        if (oContainer.childNodes.length === 0) {
            this.addLine("History_Filter");
        }

        if (this.bRefresh) {
            this.refreshPage();
            this.bRefresh = false;
        }
    },
    doRefreshOnInit: function () {
        this.bRefresh = true;
    },
    updatePageNavigationLabel: function () {
        oDatabaseWaiter.getPromise().then(() => {
            const oPages = oReceiptList.getPages();
            const oElement = document.querySelector("#History_Page span");
            if (oPages) {
                oElement.innerText = oPages.currentPage + "/" + oPages.pageCount;
            } else {
                oElement.innerText = "0/0";
            }
        });
    },
    updateReceiptList: function () {
        const oContainer = document.querySelector("#History_Receipts");
        oContainer.innerHTML = "";
        oDatabaseWaiter.getPromise().then(() => {
            oReceiptList.get().forEach((oItem) => {
                const oLine = this._getLineTemplate("History_Receipts");
                oLine.querySelector("[name=ID]").value = oItem.ReceiptID;
                oLine.querySelector("[name=Date]").value = oDateFormatter.UnixToInput(oItem.ReceiptDate);
                oLine.querySelector("[name=Account]").value = oItem.ReceiptAccount;
                oLine.querySelector("[name=Value]").value = Math.round(oItem.ReceiptValue / 100).toFixed(2);
                oContainer.appendChild(oLine);
                document.dispatchEvent(new CustomEvent("AddedTranslateableElement", { target: oLine }));
            });
        });
        this.updatePageNavigationLabel();
    },
    addLine: function (sType) {
        switch (sType) {
            case "History_Filter":
                oDatabaseWaiter.getPromise().then(() => {
                    const oLine = this._getLineTemplate("History_Filter");

                    const oElement = oLine.querySelectorAll("select")[0];
                    const aList = oReceiptList.getFilterOptions().map((oFilterOption) => {
                        return {
                            value: oFilterOption.column,
                            i18n: oFilterOption.i18n
                        };
                    });
                    oDropdown.fill(oElement, aList);

                    document.querySelector("#History_Filter").appendChild(oLine);
                    oI18nHelper.applyToChildren(oLine).then(() => {
                        oDropdown.sort(oLine.querySelectorAll("select")[0]);
                        this._changeFilterOption(oElement);
                    });
                });
                break;
        }
    },
    removeLine: function (oEvent) {
        const oLine = oEvent.target.closest(".flexLine");
        oLine.parentNode.removeChild(oLine);
    },
    _changeFilterOption: function (oEvent) {
        let oElement = oEvent;
        if (oEvent instanceof Event) {
            oElement = oEvent.target;
        }
        const oLine = oElement.parentNode;
        const aSelectElements = oLine.querySelectorAll("select");
        const oSelectedFilterOption = oReceiptList.getFilterOptions().find((oItem) => { return oItem.column === aSelectElements[0].value });
        let aList;

        if (aSelectElements[0] === oElement) {
            aList = oSelectedFilterOption.getOptions()[0].map((oFilterOption) => {
                return {
                    value: oFilterOption.value,
                    i18n: oFilterOption.i18n
                };
            });
            oDropdown.fill(aSelectElements[1], aList);
        }

        aList = oSelectedFilterOption.getOptions()[1].map((oFilterOption) => {
            return {
                value: oFilterOption.value,
                i18n: oFilterOption.i18n
            };
        });
        oDropdown.fill(aSelectElements[2], aList);

        oElement = oLine.querySelector("input");
        oElement.innerText = "";
        oElement.setAttribute("type", oSelectedFilterOption.valType);

        oI18nHelper.applyToChildren(oLine).then(() => {
            if (aSelectElements[0] === oElement) {
                oDropdown.sort(oLine.querySelectorAll("select")[1]);
            }
            oDropdown.sort(oLine.querySelectorAll("select")[2]);
        });
    },
    _getLineTemplate: function (sType) {
        const oSpan = new HtmlElement("span", { classes: ["flexLine"] });
        switch (sType) {
            case "History_Filter":
                oSpan.appendChild(new HtmlElement("select", { onchange: this._changeFilterOption }));
                oSpan.appendChild(new HtmlElement("select", { onchange: this._changeFilterOption }));
                oSpan.appendChild(new HtmlElement("select", {}));
                oSpan.appendChild(new HtmlElement("input", { type: "text", name: "FilterArgument" }));
                oSpan.appendChild(new HtmlElement("div", { classes: ["button", "removeLine"], innerText: "-", onclick: this.removeLine }));
                break;
            case "History_Receipts":
                oSpan.appendChild(new HtmlElement("input", { type: "text", name: "ID", disabled: true }));
                oSpan.appendChild(new HtmlElement("input", { type: "text", name: "Date", disabled: true }));
                oSpan.appendChild(new HtmlElement("input", { type: "text", name: "Account", disabled: true }));
                oSpan.appendChild(new HtmlElement("input", { type: "text", name: "Value", disabled: true }));
                oSpan.appendChild(new HtmlElement("div", { classes: ["button", "removeLine"], i18n: "common.edit", onclick: this.editReceipt }));
                break;
        }
        return oSpan;
    },
    changeSort: function (sSelector) {
        oDatabaseWaiter.getPromise().then(() => {
            const oLine = document.querySelector("#History_Sort");
            const oElement = oLine.querySelector(sSelector);
            if (!oElement.classList.contains("asc") && !oElement.classList.contains("desc")) {
                oLine.querySelectorAll(".button").forEach((oButton) => {
                    oButton.classList.remove("asc");
                    oButton.classList.remove("desc");
                });
                oElement.classList.add("asc");
            } else {
                oElement.classList.toggle("asc");
                oElement.classList.toggle("desc");
            }
            const sColumn = oElement.dataset.column;
            const sDirection = oElement.classList.contains("asc") ? "ASC" : "DESC";
            oReceiptList.applySort(this.getFilter(), sColumn, sDirection);
        });
    },
    getFilter: function () {
        const aFilterNodes = document.querySelectorAll("#History_Filter .flexLine");
        const aFilterOptions = oReceiptList.getFilterOptions();

        const aSelectedFilterOptions = [];
        aFilterNodes.forEach((oLine) => {
            const aSelectElements = oLine.querySelectorAll("select");
            const oInputs = {
                varType: aSelectElements[1].value,
                valType: aSelectElements[2].value,
                value: oLine.querySelector("input").value
            };
            const oClonedFilterOption = new FilterOption(Object.assign({}, aFilterOptions.find((oItem) => { return oItem.column === aSelectElements[0].value })));
            oClonedFilterOption.input = oInputs;
            oClonedFilterOption.input.value = oClonedFilterOption.formatValue();

            aSelectedFilterOptions.push(oClonedFilterOption);
        });
        return aSelectedFilterOptions;
    },
    applyFilter: function () {
        oDatabaseWaiter.getPromise().then(() => {
            oReceiptList.applyFilter(this.getFilter());
        });
    },
    editReceipt: function (oEvent) {
        const oLine = oEvent.target.closest(".flexLine");
        const sId = oLine.querySelector("[name=ID]").value;
        window.detailSection.editReceipt(sId);
    },
    nextPage: function () {
        oDatabaseWaiter.getPromise().then(() => {
            oReceiptList.nextPage(this.getFilter());
        });
    },
    prevPage: function () {
        oDatabaseWaiter.getPromise().then(() => {
            oReceiptList.prevPage(this.getFilter());
        });
    },
    refreshPage: function () {
        oDatabaseWaiter.getPromise().then(() => {
            oReceiptList.refreshPage(this.getFilter());
        });
    }
};

oReceiptList.addListener("history", window.historySection.updateReceiptList.bind(window.historySection));
