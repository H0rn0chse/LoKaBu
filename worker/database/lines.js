import { db } from "./databaseConnection.js";
import { databaseHelper } from "./databaseHelper.js";

function remove (sId) {
    const oParams = {
        ID: sId
    };
    const sSql = `
    DELETE
    FROM Lines
    WHERE ID=$ID
    `;
    const oStmt = db.get().prepare(sSql);
    oStmt.run(oParams);
};

function add (oLine) {
    const oParams = {
        ID: databaseHelper.getNextId(db.get(), "Lines"),
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
    const oStmt = db.get().prepare(sSql);
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
    const oStmt = db.get().prepare(sSql);
    oStmt.run(oParams);
};

export const lines = {
    remove,
    add,
    removeByReceipt
};
