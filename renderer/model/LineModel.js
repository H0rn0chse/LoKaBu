import { EventBus } from "../EventBus.js";
import { DatabaseModel } from "./common/DatabaseModel.js";
import { deepClone } from "../common/Utils.js";
import { SettingsModel } from "./SettingsModel.js";

class _LineModel extends DatabaseModel {
    constructor (oData) {
        super(oData, "lines", true);
        this.name = "LineModel";
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

        oEntry.Value = parseInt(oEntry.Value * 100, 10);
        EventBus.sendToDatabase("lines-create", oEntry);
    }

    updateEntry (iId, iReceipt, fValue, sBilling, sType, bSupressUpdate = false) {
        const aPath = ["lines", { ID: iId }];
        const oOldEntry = this.get(aPath);

        const oEntry = {
            ID: iId,
            Receipt: iReceipt,
            Value: fValue.toFixed(2),
            Billing: sBilling,
            Type: sType,
            Selected: oOldEntry.Selected
        };
        this.set(aPath, deepClone(oEntry), true);

        oEntry.Value = parseInt(oEntry.Value * 100, 10);
        EventBus.sendToDatabase("lines-update", oEntry);

        if (!bSupressUpdate) {
            this.update();
        }
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
        const iIndex = aList.findIndex(oLine => {
            return oLine.ID === iId;
        });
        if (iIndex > -1) {
            aList.splice(iIndex, 1);
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
}

export const LineModel = new _LineModel({
    lines: []
});
