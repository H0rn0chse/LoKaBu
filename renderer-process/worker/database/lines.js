const oDb = require("./databaseConnection");
const oDatabaseHelper = require("./../../helper/database");

function remove (sId) {
    const oParams = {
        ID: sId
    };
    const sSql = `
    DELETE
    FROM Lines
    WHERE ID=$ID
    `;
    const oStmt = oDb.get().prepare(sSql);
    oStmt.run(oParams);
};

function add (oLine) {
    const oParams = {
        ID: oDatabaseHelper.getNextId(oDb.get(), "Lines"),
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
    const oStmt = oDb.get().prepare(sSql);
    oStmt.run(oParams);
};

function removeByReceipt (sId) {
    const oParams = {
        ID: sId
    };
    const sSql = `
    DELETE
    FROM Lines
    WHERE Receipt=$ID
    `;
    const oStmt = oDb.get().prepare(sSql);
    oStmt.run(oParams);
};

module.exports = {
    remove,
    add,
    removeByReceipt
};
