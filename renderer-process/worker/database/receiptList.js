const SqlStatement = require("./../../../assets/sqlStatement");
const FilterOption = require("./../../../assets/filterOption");
if (!window.oDatabase) {
    require("./databaseConnection");
}
const oDb = window.oDatabase;

oDb.readReceiptList = (sSql, fnCallback) => {
    const oStmt = oDb.prepare(sSql);
    const oResult = oStmt.all();
    fnCallback(null, oResult);
};

oDb.readReceiptListCallback = (oErr, oResult) => {
    if (oErr) {
        window.ipcRenderer.send("log", oErr);
    } else {
        oResult.forEach((oLine) => {
            oLine.PageCount = Math.ceil(oLine.LineCount / oLine.PageSize);
        });
        window.ipcRenderer.sendTo(window.iRendererId, "receiptList-read-list", oResult);
    }
};

oDb.readReceiptListDefault = `
SELECT *
FROM view_ReceiptList
`;

window.ipcRenderer.on("receiptList-read-list", (oEvent, sMessage) => {
    const oSqlStatement = new SqlStatement("view_ReceiptList", "ReceiptID");
    oSqlStatement.setDefaultSql(oDb.readReceiptListDefault);
    oSqlStatement.setSort("ReceiptID", "ASC");
    oDb.readReceiptList(oSqlStatement.getPageSql(0), oDb.readReceiptListCallback);
});

window.ipcRenderer.on("receiptList-read-filter", (oEvent, sMessage) => {
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
    window.ipcRenderer.sendTo(window.iRendererId, "receiptList-read-filter", aFilterOptions);
});

window.ipcRenderer.on("receiptList-write-filter", (oEvent, sMessage, sPage, sSortColumn, sSortDirection) => {
    const oSqlStatement = new SqlStatement("view_ReceiptList", "ReceiptID");
    oSqlStatement.setDefaultSql(oDb.readReceiptListDefault);
    oSqlStatement.setSort(sSortColumn, sSortDirection);
    sMessage.forEach((oFilterOption) => {
        oSqlStatement.addFilterOption(new FilterOption(oFilterOption));
    });
    console.log(oSqlStatement.getPageSql(sPage));

    oDb.readReceiptList(oSqlStatement.getPageSql(sPage), oDb.readReceiptListCallback);
});
