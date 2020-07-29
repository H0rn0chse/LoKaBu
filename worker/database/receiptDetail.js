import { db } from "./databaseConnection.js";
import { ipc } from "./ipc.js";
import { databaseHelper } from "./databaseHelper.js";
import { receipts } from "./receipts.js";
import { lines } from "./lines.js";

function read (sId) {
    const oParams = {
        ReceiptID: sId
    };
    const sSql = `
    SELECT *
    FROM view_ReceiptDetail
    WHERE ReceiptID = $ReceiptID
    `;
    const oStmt = db.get().prepare(sSql);
    return {
        result: oStmt.all(oParams),
        id: sId
    };
};

ipc.on("receiptDetail-create", (oEvent, sMessage) => {
    // todo implementation
});

ipc.on("receiptDetail-read", (oEvent, sMessage) => {
    ipc.sendToRenderer("receiptDetail-read", read(sMessage));
});

ipc.on("receiptDetail-update", (oEvent, aNewDetailList) => {
    let sId = aNewDetailList[0].ReceiptID;
    if (sId) {
        const aOldDetailList = read(sId).result;
        aOldDetailList.forEach((oLine) => {
            lines.remove(oLine.LineID);
        });

        receipts.update(aNewDetailList[0]);
    } else {
        sId = databaseHelper.getNextId(db.get(), "Receipts");
        aNewDetailList[0].ReceiptID = sId;
        receipts.add(aNewDetailList[0]);
    }

    aNewDetailList.forEach((oLine) => {
        oLine.ReceiptID = sId;
        lines.add(oLine);
    });
});

ipc.on("receiptDetail-delete", (oEvent, sId) => {
    receipts.remove(sId);
    lines.removeByReceipt(sId);
});

export const receiptDetail = {
    read
};
