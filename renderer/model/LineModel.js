import { EventBus } from "../EventBus.js";
import { DatabaseModel } from "./common/DatabaseModel.js";
import { deepClone, findAndSplice } from "../common/Utils.js";
import { SettingsModel } from "./SettingsModel.js";

class _LineModel extends DatabaseModel {
    constructor (oData) {
        super(oData, "lines", true);
        this.name = "LineModel";
        window[this.name] = this;
    }

    getReceiptId () {
        const aList = this.get(["lines"]);
        if (aList.length) {
            return aList[0].Receipt;
        }
    }

    readReceiptLines (iReceiptId) {
        const oData = {
            Receipt: iReceiptId
        };
        EventBus.sendToDatabase(`${this.table}-read`, oData);
    }

    addEntry (iId, fValue) {
        fValue = fValue || 0;
        const oEntry = {
            Selected: false,
            Receipt: iId,
            Value: fValue.toFixed(2),
            Billing: SettingsModel.getDefault("Person"),
            Type: SettingsModel.getDefault("Type")
        };
        this.push(["lines"], deepClone(oEntry));

        oEntry.Value = parseInt((oEntry.Value * 100).toPrecision(15), 10);
        EventBus.sendToDatabase("lines-create", oEntry);
    }

    updateEntry (iId, iReceipt, fValue, sBilling, sType, bSupressUpdate = false) {
        let aPath = ["lines", { ID: iId }];
        const oOldEntry = this.get(aPath);

        const oEntry = {
            ID: iId,
            Receipt: iReceipt,
            Value: fValue.toFixed(2),
            Billing: sBilling,
            Type: sType,
            Selected: oOldEntry.Selected
        };
        aPath = this.set(aPath, deepClone(oEntry), true);

        oEntry.Value = parseInt((oEntry.Value * 100).toPrecision(15), 10);
        EventBus.sendToDatabase("lines-update", oEntry);

        if (!bSupressUpdate) {
            this.update();
        }
        return {
            index: aPath[aPath.length - 1]
        };
    }

    updateBulk (vBilling, vType) {
        const aLines = this.get(["lines"]).reduce((aAcc, oLine) => {
            if (oLine.Selected) {
                aAcc.push(oLine);
            }
            return aAcc;
        }, []);

        aLines.forEach(oLine => {
            vBilling = vBilling || oLine.Billing;
            vType = vType || oLine.Type;
            this.updateEntry(oLine.ID, oLine.Receipt, parseFloat(oLine.Value), vBilling, vType, true);
        });
        if (aLines.length) {
            this.update();
        }
    }

    deleteEntry (iId) {
        const oEntry = {
            ID: iId
        };
        const aList = this.get(["lines"]);
        if (findAndSplice(aList, "ID", iId)) {
            EventBus.sendToDatabase("lines-delete", oEntry);
        }
    }

    selectEntry (iId, bSelected) {
        this.set(["lines", { ID: iId }, "Selected"], bSelected);
    }

    deleteReceipt (iId) {
        const oEntry = {
            Receipt: iId
        };
        EventBus.sendToDatabase("lines-delete", oEntry);
        this.emptyList();
    }

    emptyList () {
        this.set(["lines"], []);
    }

    selectAll () {
        const aLines = this.get(["lines"]);
        aLines.forEach(line => {
            line.Selected = true;
        });
        this.update();
    }

    unselectAll () {
        const aLines = this.get(["lines"]);
        aLines.forEach(line => {
            line.Selected = false;
        });
        this.update();
    }

    processCreate (oEvent, oData) {
        const aPath = ["lines", { ID: undefined }, "ID"];
        this.set(aPath, oData.lastInsertRowid);
    }

    processRead (oEvent, aData) {
        aData.forEach(oLine => {
            oLine.Value = (oLine.Value / 100).toFixed(2);
            oLine.Checked = false;
        });
        super.processRead(oEvent, aData);
        console.log("LinesModel loaded");
    }

    processUpdate () {
        console.log("LinesModel updated");
    }

    processReplace () {
        this.readReceiptLines(this.getReceiptId());
    }
}

export const LineModel = new _LineModel({
    lines: []
});
