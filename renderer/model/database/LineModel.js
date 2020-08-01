import { EventBus } from "../../EventBus.js";
import { DatabaseModel } from "../common/DatabaseModel.js";

class _LineModel extends DatabaseModel {
    constructor (oData) {
        super(oData, "lines", true);
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
            Billing: 1,
            Type: 1
        };
        EventBus.sendToDatabase("lines-create", oEntry);

        const iIndex = this.get(["lines"]).length;
        const aPath = ["lines", iIndex];
        this.set(aPath, oEntry);
    }

    updateEntry (iId, iValue, iBilling, iType) {
        const oEntry = {
            Receipt: iId,
            Value: iValue,
            Billing: iBilling,
            Type: iType
        };
        EventBus.sendToDatabase("lines-update", oEntry);

        const aPath = ["lines", { ID: iId }];
        this.set(aPath, oEntry);
    }

    processCreate (oEvent, oData) {
        const aPath = ["lines", { ID: undefined }, "ID"];
        this.set(aPath, oData.lastInsertRowid);
    }

    processRead (...args) {
        super.processRead(...args);
        console.log("LinesModel loaded");
    }

    processUpdate () {}
}

export const LineModel = new _LineModel({
    lines: []
});
