import { db } from "./databaseConnection.js";
import { SqlStatement } from "../../assets/sqlStatement.js";
import { FilterOption } from "../../assets/filterOption.js";
import { Table } from "../common/Table.js";
import { EventBus } from "../../renderer/EventBus.js";

class _ReceiptListView extends Table {
    constructor () {
        super("receiptList");

        this.baseSelect = `
        SELECT *
        FROM view_ReceiptList
        `;
    }

    readSqlAction (aFilter = [], sPage = "0", sSortColumn = "ReceiptID", sSortDirection = "ASC") {
        const oSqlStatement = new SqlStatement("view_ReceiptList", "ReceiptID")
            .setDefaultSql(this.baseSelect)
            .setSort(sSortColumn, sSortDirection);

        aFilter.forEach((oFilterOption) => {
            oSqlStatement.addFilterOption(new FilterOption(oFilterOption));
        });

        return db.get()
            .prepare(oSqlStatement.getPageSql(sPage))
            .all()
            .map((oItem) => {
                oItem.PageCount = Math.ceil(oItem.LineCount / oItem.PageSize);
            });
    }
}

export const ReceiptListView = new _ReceiptListView();

// todo move to the respective model
EventBus.listen("receiptList-read-filter", (oEvent, sMessage) => {
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
    EventBus.sendToBrowser("receiptList-read-filter", aFilterOptions);
});
