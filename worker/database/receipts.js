const oDb = require("./databaseConnection");

function read (oLine) {
    const oParams = {
        ReceiptID: oLine.ReceiptID
    };
    const sSql = `
    SELECT *
    FROM view_ReceiptDetail
    WHERE ReceiptID = $ReceiptID
    `;
    const oStmt = oDb.get().prepare(sSql);
    return oStmt.all(oParams);
};

function add (oLine) {
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
    const oStmt = oDb.get().prepare(sSql);
    oStmt.run(oParams);
};

function update (oLine) {
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
    const oStmt = oDb.get().prepare(sSql);
    oStmt.run(oParams);
};

function remove (sId) {
    const oParams = {
        ID: sId
    };
    const sSql = `
    DELETE
    FROM Receipts
    WHERE ID=$ID;
    `;
    const oStmt = oDb.get().prepare(sSql);
    oStmt.run(oParams);
};

module.exports = {
    read,
    add,
    update,
    remove
};
