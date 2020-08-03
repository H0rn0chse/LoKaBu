/* eslint-disable quote-props */
import { DatabaseModel } from "../common/DatabaseModel.js";
import { UnixToInput } from "../../common/DateUtils.js";
import { ReceiptModel } from "../database/ReceiptModel.js";
import { EventBus } from "../../EventBus.js";
import { LineModel } from "../database/LineModel.js";

class _HistoryModel extends DatabaseModel {
    constructor (oData) {
        super(oData, "receiptList");

        ReceiptModel.addEventListener("update", this.read, this);
        LineModel.addEventListener("update", this.read, this);
    }

    read () {
        const aArgs = [
            [],
            this.get(["CurrentPage"]) || 1
        ];
        EventBus.sendToDatabase("receiptList-read", ...aArgs);
    }

    readNext () {
        const iCurrent = parseInt(this.get(["CurrentPage"]), 10);
        const iMax = parseInt(this.get(["PageCount"]), 10);
        const aArgs = [
            [],
            iCurrent < iMax ? iCurrent + 1 : null
        ];
        if (!aArgs.includes(null)) {
            EventBus.sendToDatabase("receiptList-read", ...aArgs);
        }
    }

    readBefore () {
        const iCurrent = parseInt(this.get(["CurrentPage"]), 10);
        const aArgs = [
            [],
            iCurrent > 1 ? iCurrent - 1 : null
        ];
        if (!aArgs.includes(null)) {
            EventBus.sendToDatabase("receiptList-read", ...aArgs);
        }
    }

    processRead (oEvent, oData) {
        console.log("HistoryModel loaded");

        oData.entries.forEach(oItem => {
            oItem.Date = oItem.Date ? UnixToInput(oItem.Date) : UnixToInput("0");
            oItem.ReceiptSum = oItem.ReceiptSum ? (oItem.ReceiptSum / 100).toFixed(2) : (0).toFixed(2);
            oItem.Types = oItem.Types ? oItem.Types : [];
            oItem.Persons = oItem.Persons ? oItem.Persons : [];
            oItem.LineValues = oItem.LineValues ? oItem.LineValues : [];
        });

        this.mergeObjectIntoData(oData);
    }

    get (aPath, aBindingContextPath) {
        if (aPath[0] === "AccountRef") {
            const iId = super.get(["Account"], aBindingContextPath);
            return ["accounts", { ID: iId }, "DisplayName"];
        }
        return super.get(aPath, aBindingContextPath);
    }
}

export const HistoryModel = new _HistoryModel({
    "sort": [{
        "id": "id",
        "text-i18n": ["receipt.id"],
        "selected": true,
        "direction": "asc"
    }, {
        "id": "date",
        "text-i18n": ["common.date"],
        "selected": false,
        "direction": ""
    }, {
        "id": "account",
        "text-i18n": ["common.account"],
        "selected": false,
        "direction": ""
    }, {
        "id": "value",
        "text-i18n": ["common.value"],
        "selected": false,
        "direction": ""
    }],
    "entries": []
});
