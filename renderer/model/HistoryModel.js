/* eslint-disable quote-props */
import { DatabaseModel } from "./common/DatabaseModel.js";
import { UnixToInput } from "../common/DateUtils.js";
import { ReceiptModel } from "./ReceiptModel.js";
import { EventBus } from "../EventBus.js";
import { LineModel } from "./LineModel.js";
import { ReceiptListFilter } from "../filter/ReceiptListFilter.js";

class _HistoryModel extends DatabaseModel {
    constructor (oData) {
        super(oData, "receiptList");
        this.name = "HistoryModel";
        window[this.name] = this;

        ReceiptModel.addEventListener("update", this.onModelUpdate, this);
        LineModel.addEventListener("update", this.onModelUpdate, this);
    }

    onModelUpdate (oEvent) {
        this.read();
    }

    addFilter () {
        this.push(["filter"], new ReceiptListFilter());
    }

    deleteFilter (iId) {
        const aFilter = this.get(["filter"]);
        aFilter.splice(iId, 1);
        this.set(["filter"], aFilter);
    }

    _getCurrentFilter () {
        return this.get(["filter"]).map(oFilter => {
            return oFilter.export();
        });
    }

    _getCurrentSort () {
        const oSort = this.get(["sort"]).find(oItem => {
            return oItem.direction !== "";
        });

        if (oSort !== undefined) {
            return [
                oSort.id,
                oSort.direction
            ];
        }
    }

    read (iId) {
        const aArgs = [
            this._getCurrentFilter(),
            iId || this.get(["CurrentPage"]) || 1,
            ...this._getCurrentSort()
        ];
        EventBus.sendToDatabase("receiptList-read", ...aArgs);
    }

    readNext () {
        const iCurrent = parseInt(this.get(["CurrentPage"]), 10);
        const iMax = parseInt(this.get(["PageCount"]), 10);
        const aArgs = [
            this._getCurrentFilter(),
            iCurrent < iMax ? iCurrent + 1 : null,
            ...this._getCurrentSort()
        ];
        if (!aArgs.includes(null)) {
            EventBus.sendToDatabase("receiptList-read", ...aArgs);
        }
    }

    readBefore () {
        const iCurrent = parseInt(this.get(["CurrentPage"]), 10);
        const aArgs = [
            this._getCurrentFilter(),
            iCurrent > 1 ? iCurrent - 1 : null,
            ...this._getCurrentSort()
        ];
        if (!aArgs.includes(null)) {
            EventBus.sendToDatabase("receiptList-read", ...aArgs);
        }
    }

    get (aPath, aBindingContextPath) {
        if (aPath[0] === "AccountRef") {
            const iId = super.get(["Account"], aBindingContextPath);
            return ["accounts", { ID: iId }, "DisplayName"];
        }
        return super.get(aPath, aBindingContextPath);
    }

    setFilterColumn (iFilter, iColumn) {
        this.set(["filter", iFilter, "value"], iColumn);
    }

    setSort (sId, sDirection) {
        const aSort = this.get(["sort"]);

        aSort.forEach((oItem) => {
            if (oItem.id === sId) {
                oItem.selected = true;
                oItem.direction = sDirection === "ASC" ? "DESC" : "ASC";
            } else {
                oItem.selected = false;
                oItem.direction = "";
            }
        });
        this.set(["sort"], aSort);
    }

    processRead (oEvent, oData) {
        if (oData.entries.length === 0 && oData.CurrentPage > oData.PageCount) {
            this.read(oData.PageCount);
        } else {
            oData.entries.forEach(oItem => {
                oItem.Date = oItem.Date ? UnixToInput(oItem.Date) : UnixToInput("0");
                oItem.ReceiptSum = oItem.ReceiptSum ? (oItem.ReceiptSum / 100).toFixed(2) : (0).toFixed(2);
                oItem.Types = oItem.Types ? oItem.Types : [];
                oItem.Persons = oItem.Persons ? oItem.Persons : [];
                oItem.LineValues = oItem.LineValues ? oItem.LineValues : [];
            });
            this.mergeObjectIntoData(oData);

            if (oData.entries.length === 0 && this.get(["CurrentPage"]) > this.get(["PageCount"])) {
                this.read(this.get(["PageCount"]));
            }
            console.log("HistoryModel loaded");
        }
    }
}

export const HistoryModel = new _HistoryModel({
    "filter": [],
    "sort": [{
        "id": "ID",
        "text-i18n": ["receipt.id"],
        "selected": true,
        "direction": "ASC"
    }, {
        "id": "Date",
        "text-i18n": ["common.date"],
        "selected": false,
        "direction": ""
    }, {
        "id": "Account",
        "text-i18n": ["common.account"],
        "selected": false,
        "direction": ""
    }, {
        "id": "ReceiptSum",
        "text-i18n": ["common.value"],
        "selected": false,
        "direction": ""
    }, {
        "id": "Created",
        "text-i18n": ["common.created"],
        "selected": false,
        "direction": ""
    }, {
        "id": "Updated",
        "text-i18n": ["common.updated"],
        "selected": false,
        "direction": ""
    }],
    "entries": []
});
