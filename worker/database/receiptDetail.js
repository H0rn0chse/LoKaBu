const oDatabaseHelper = require("../../renderer/helper/database");
const oDb = require("./databaseConnection");

const oReceipts = require("./receipts");
const oLines = require("./lines");

function read (sId) {
    const oParams = {
        ReceiptID: sId
    };
    const sSql = `
    SELECT *
    FROM view_ReceiptDetail
    WHERE ReceiptID = $ReceiptID
    `;
    const oStmt = oDb.get().prepare(sSql);
    return {
        result: oStmt.all(oParams),
        id: sId
    };
};

window.ipcRenderer.on("receiptDetail-read-list", (oEvent, sMessage) => {
    window.ipcRenderer.sendTo(window.iRendererId, "receiptDetail-read-list", read(sMessage));
});

window.ipcRenderer.on("receiptDetail-write-list", (oEvent, aNewDetailList) => {
    let sId = aNewDetailList[0].ReceiptID;
    if (sId) {
        const aOldDetailList = read(sId).result;
        aOldDetailList.forEach((oLine) => {
            oLines.remove(oLine.LineID);
        });

        oReceipts.update(aNewDetailList[0]);
    } else {
        sId = oDatabaseHelper.getNextId(oDb.get(), "Receipts");
        aNewDetailList[0].ReceiptID = sId;
        oReceipts.add(aNewDetailList[0]);
    }

    aNewDetailList.forEach((oLine) => {
        oLine.ReceiptID = sId;
        oLines.add(oLine);
    });
});

window.ipcRenderer.on("receiptDetail-delete-list", (oEvent, sId) => {
    oReceipts.remove(sId);
    oLines.removeByReceipt(sId);
});

module.exports = {
    read
};
