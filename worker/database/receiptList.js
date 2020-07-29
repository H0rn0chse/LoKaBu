import { db } from "./databaseConnection.js";
import { ipc } from "./ipc.js";
import { SqlStatement } from "../../assets/sqlStatement.js";
import { FilterOption } from "../../assets/filterOption.js";

function read (sSql) {
    const oStmt = db.get().prepare(sSql);
    const oResult = oStmt.all();
    oResult.forEach((oLine) => {
        oLine.PageCount = Math.ceil(oLine.LineCount / oLine.PageSize);
    });
    return oResult;
};

const readDefault = `
SELECT *
FROM view_ReceiptList
`;

ipc.on("receiptList-read", (oEvent, sMessage) => {
    const oSqlStatement = new SqlStatement("view_ReceiptList", "ReceiptID");
    oSqlStatement.setDefaultSql(readDefault);
    oSqlStatement.setSort("ReceiptID", "ASC");
    ipc.sendToRenderer("receiptList-read", read(oSqlStatement.getPageSql(0)));
});

ipc.on("receiptList-create", (oEvent, sMessage) => {
    // todo error handling
});

// todo move to the respective model
ipc.on("receiptList-read-filter", (oEvent, sMessage) => {
    const aFilterOptions = [
        new FilterOption({ column: "ReceiptID", i18n: "filter.ReceiptID", valType: "number", varType: "value" }),
        new FilterOption({ column: "ReceiptDate", i18n: "filter.ReceiptDate", valType: "date", varType: "value" }),
        new FilterOption({ column: "ReceiptAccount", i18n: "filter.ReceiptAccount", valType: "text", varType: "value" }),
        new FilterOption({ column: "ReceiptStore", i18n: "filter.ReceiptStore", valType: "text", varType: "value" }),
        new FilterOption({ column: "ReceiptComment", i18n: "filter.ReceiptComment", valType: "text", varType: "value" }),
        new FilterOption({ column: "ReceiptValue", i18n: "filter.ReceiptValue", valType: "number", varType: "value", format: "0,00" }),
        new FilterOption({ column: "LineTypes", i18n: "filter.LineTypes", valType: "text", varType: "list" }),
        new FilterOption({ column: "LinePersons", i18n: "filter.LinePersons", valType: "text", varType: "list" }),
        new FilterOption({ column: "LineValues", i18n: "filter.LineValues", valType: "number", varType: "list", format: "0,00" })
    ];
    ipc.sendToRenderer("receiptList-read-filter", aFilterOptions);
});

// todo move to read
ipc.on("receiptList-write-filter", (oEvent, sMessage, sPage, sSortColumn, sSortDirection) => {
    const oSqlStatement = new SqlStatement("view_ReceiptList", "ReceiptID");
    oSqlStatement.setDefaultSql(readDefault);
    oSqlStatement.setSort(sSortColumn, sSortDirection);
    sMessage.forEach((oFilterOption) => {
        oSqlStatement.addFilterOption(new FilterOption(oFilterOption));
    });
    console.log(oSqlStatement.getPageSql(sPage));

    ipc.sendToRenderer("receiptList-read-list", read(oSqlStatement.getPageSql(sPage)));
});

ipc.on("receiptList-update", (oEvent, sMessage) => {
    // todo error handling
});

ipc.on("receiptList-delete", (oEvent, sMessage) => {
    // todo error handling
});

export const receiptList = {
    read,
    readDefault
};
