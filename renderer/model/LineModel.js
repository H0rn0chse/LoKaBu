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

    addEntry (iId) {
        const oEntry = {
            Receipt: iId,
            Value: 0,
            Billing: SettingsModel.getDefault("Person"),
            Type: SettingsModel.getDefault("Type")
        };
        EventBus.sendToDatabase("lines-create", oEntry);

        this.push(["lines"], oEntry);
    }

    updateEntry (iId, iReceipt, fValue, sBilling, sType) {
        const oEntry = {
            ID: iId,
            Receipt: iReceipt,
            Value: fValue.toFixed(2),
            Billing: sBilling,
            Type: sType
        };
        const aPath = ["lines", { ID: iId }];
        this.set(aPath, deepClone(oEntry), true);

        oEntry.Value = parseInt(oEntry.Value * 100, 10);
        EventBus.sendToDatabase("lines-update", oEntry);

        this.update();
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

    processCreate (oEvent, oData) {
        const aPath = ["lines", { ID: undefined }, "ID"];
        this.set(aPath, oData.lastInsertRowid);
    }

    processRead (oEvent, aData) {
        aData.forEach(oLine => {
            oLine.Value = (oLine.Value / 100).toFixed(2);
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