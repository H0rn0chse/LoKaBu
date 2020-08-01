import { EventBus } from "../../EventBus.js";
import { DatabaseModel } from "../common/DatabaseModel.js";
import { UnixToInput } from "../../../assets/dateFormatter.js";

class _ReceiptModel extends DatabaseModel {
    constructor (oData) {
        super(oData, "receipts", true);
    }

    get (aPath, aBindingContextPath) {
        if (aPath[0] === "Date") {
            const iDate = super.get(aPath, aBindingContextPath);
            return iDate ? UnixToInput(iDate) : "";
        }
        return super.get(aPath, aBindingContextPath);
    }

    read (iId) {
        const oData = {
            ID: iId
        };
        EventBus.sendToDatabase(`${this.table}-read`, oData);
    }

    addEntry () {
        const oEntry = {
            Date: "",
            Account: 1,
            Comment: "",
            Store: 1
        };
        EventBus.sendToDatabase("receipts-create", oEntry);

        this.mergeObjectIntoData(oEntry);
    }

    updateEntry (iId, iDate, iAccount, sComment, iStore) {
        const oEntry = {
            ID: iId,
            Date: iDate,
            Account: iAccount,
            Comment: sComment,
            Store: iStore
        };
        EventBus.sendToDatabase("receipts-update", oEntry);

        this.mergeObjectIntoData(oEntry);
    }

    processCreate (oEvent, oData) {
        this.set(["ID"], oData.lastInsertRowid);
    }

    processRead (oEvent, oData) {
        this.mergeObjectIntoData(oData);
        console.log("ReceiptsModel loaded");
    }

    processUpdate () {}
}

export const ReceiptModel = new _ReceiptModel({
});
