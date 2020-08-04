import { db } from "./databaseConnection.js";
import { SqlStatement } from "../common/SqlStatement2.js";
import { Table } from "../common/Table.js";
import { SqlFilterOption } from "../common/SqlFilterOption.js";

class _ReceiptListView extends Table {
    constructor () {
        super("receiptList");

        this.baseSelect = `
        SELECT *
        FROM view_ReceiptList
        `;
    }

    readSqlAction (aFilter = [], iPage = 1, sSortColumn = "ID", sSortDirection = "ASC") {
        const oSqlStatement = new SqlStatement("view_ReceiptList", "ID")
            .setDefaultSql(this.baseSelect)
            .setSort(sSortColumn, sSortDirection);

        aFilter.forEach((oFilterOption) => {
            oSqlStatement.addFilterOption(new SqlFilterOption(oFilterOption));
        });

        const aEntries = db.get()
            .prepare(oSqlStatement.getPageSql(iPage))
            .all();

        return {
            entries: aEntries,
            CurrentPage: iPage,
            PageCount: aEntries.length > 0 ? Math.ceil(aEntries[0].LineCount / aEntries[0].PageSize) : 1
        };
    }
}

export const ReceiptListView = new _ReceiptListView();
