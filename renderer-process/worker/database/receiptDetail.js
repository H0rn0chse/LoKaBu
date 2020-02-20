const oDatabaseHelper = require("./../../helper/database");
if (!window.oDatabase) {
    require("./databaseConnection");
}
const oDb = window.oDatabase;

oDb.readReceiptDetail = (fnCallback, sId) => {
    const oParams = {
        ReceiptID: sId
    };
    const sSql = `
    SELECT *
    FROM view_ReceiptDetail
    WHERE ReceiptID = $ReceiptID
    `;
    const oStmt = oDb.prepare(sSql);
    const oResult = {
        result: oStmt.all(oParams),
        id: sId
    };

    if (fnCallback) {
        fnCallback(null, oResult);
    }
    return oResult;
};

oDb.readReceiptDetailCallback = (oErr, oResult) => {
    if (oErr) {
        window.ipcRenderer.send("log", oErr);
    } else {
        window.ipcRenderer.sendTo(window.iRendererId, "receiptDetail-read-list", oResult.id, oResult.result);
    }
};

window.ipcRenderer.on("receiptDetail-read-list", (oEvent, sMessage) => {
    oDb.readReceiptDetail(oDb.readReceiptDetailCallback, sMessage);
});

oDb.readReceipt = (oLine) => {
    const oParams = {
        ReceiptID: oLine.ReceiptID
    };
    const sSql = `
    SELECT *
    FROM view_ReceiptDetail
    WHERE ReceiptID = $ReceiptID
    `;
    const oStmt = oDb.prepare(sSql);
    return oStmt.run(oParams);
};

oDb.addReceipt = function (oLine) {
    const oParams = {
        ID: oLine.ReceiptID,
        Date: oLine.ReceiptDate,
        Account: oLine.ReceiptAccount,
        Comment: oLine.ReceiptComment,
        Store: oLine.ReceiptStore
    };
    const sSql = `
    INSERT INTO Receipts
        (ID, Date, Account, Comment, Store)
    Values ($ID, $Date, $Account, $Comment, $Store)
    `;
    const oStmt = oDb.prepare(sSql);
    oStmt.run(oParams);
};

oDb.updateReceipt = function (oLine) {
    const oParams = {
        ID: oLine.ReceiptID,
        Date: oLine.ReceiptDate,
        Account: oLine.ReceiptAccount,
        Comment: oLine.ReceiptComment,
        Store: oLine.ReceiptStore
    };
    const sSql = `
    UPDATE Receipts
    SET Date=$Date, Account=$Account, Comment=$Comment, Store=$Store
    WHERE ID=$ID
    `;
    const oStmt = oDb.prepare(sSql);
    oStmt.run(oParams);
};

oDb.deleteReceiptLine = function (sId) {
    const oParams = {
        ID: sId
    };
    const sSql = `
    DELETE
    FROM Lines
    WHERE ID=$ID
    `;
    const oStmt = oDb.prepare(sSql);
    oStmt.run(oParams);
};

oDb.addReceiptLine = function (oLine) {
    const oParams = {
        ID: oDatabaseHelper.getNextId(oDb, "Lines"),
        Receipt: oLine.ReceiptID,
        Value: oLine.LineValue,
        Billing: oLine.LineBilling,
        Type: oLine.LineType
    };
    const sSql = `
    INSERT INTO Lines
        (ID, Receipt, Value, Billing, Type)
    Values ($ID, $Receipt, $Value, $Billing, $Type)
    `;
    const oStmt = oDb.prepare(sSql);
    oStmt.run(oParams);
};

window.ipcRenderer.on("receiptDetail-write-list", (oEvent, aNewDetailList) => {
    let sId = aNewDetailList[0].ReceiptID;
    if (sId) {
        const aOldDetailList = oDb.readReceiptDetail(null, sId).result;
        aOldDetailList.forEach((oLine) => {
            oDb.deleteReceiptLine(oLine.LineID);
        });

        oDb.updateReceipt(aNewDetailList[0]);
    } else {
        sId = oDatabaseHelper.getNextId(oDb, "Receipts");
        aNewDetailList[0].ReceiptID = sId;
        oDb.addReceipt(aNewDetailList[0]);
    }

    aNewDetailList.forEach((oLine) => {
        oLine.ReceiptID = sId;
        oDb.addReceiptLine(oLine);
    });
});

oDb.deleteReceipt = function (sId) {
    const oParams = {
        ID: sId
    };
    let sSql = `
    DELETE
    FROM Receipts
    WHERE ID=$ID;
    `;
    let oStmt = oDb.prepare(sSql);
    oStmt.run(oParams);
    sSql = `
    DELETE
    FROM Lines
    WHERE Receipt=$ID
    `;
    oStmt = oDb.prepare(sSql);
    oStmt.run(oParams);
};

window.ipcRenderer.on("receiptDetail-delete-list", (oEvent, sId) => {
    oDb.deleteReceipt(sId);
});
