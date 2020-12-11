import { SqlStatement } from "../common/SqlStatement.js";
import { Table } from "../common/Table.js";
import { SqlFilterOption } from "../common/SqlFilterOption.js";
import { DatabaseManager } from "./DatabaseManager.js";
import { EventBus } from "../../renderer/EventBus.js";

class _ReceiptListView extends Table {
    constructor () {
        super("receiptList");

        this.baseSelect = `
        SELECT *
        FROM view_ReceiptList
        `;

        EventBus.listen("receiptList-duplicates", () => {
            EventBus.sendToBrowser("receiptList-duplicates", this.findDuplicates());
        });

        EventBus.listen("receipt-summary", (oEvent, sId) => {
            EventBus.sendToBrowser("receipt-summary", this.readReceipt(sId));
        });
    }

    readSqlAction (aFilter = [], iPage = 1, sSortColumn = "ID", sSortDirection = "ASC") {
        const oSqlStatement = new SqlStatement("view_ReceiptList", "ID")
            .setDefaultSql(this.baseSelect)
            .setSort(sSortColumn, sSortDirection);

        aFilter.forEach((oFilterOption) => {
            oSqlStatement.addFilterOption(new SqlFilterOption(oFilterOption));
        });

        const aEntries = DatabaseManager.get()
            .prepare(oSqlStatement.getPageSql(iPage))
            .all();

        return {
            entries: aEntries,
            CurrentPage: iPage,
            PageCount: aEntries.length > 0 ? Math.ceil(aEntries[0].LineCount / aEntries[0].PageSize) : 1
        };
    }

    readReceipt (sId) {
        const sSql = `
        SELECT
            view.*,
            json_group_array(l.value) as Lines,
            r.DuplicateHint as DuplicateHint
        FROM view_ReceiptList view
        JOIN Lines l
            ON view.ID = l.Receipt
        JOIN Receipts r
            ON view.ID = r.ID
        WHERE view.ID = ${sId}
        `;
        return DatabaseManager.get()
            .prepare(sSql)
            .get();
    }

    findDuplicates () {
        const oDb = DatabaseManager.get();
        oDb.function("evalDuplicate", { deterministic: true, varargs: true }, this.evalDuplicate);

        let sSql = `
        SELECT
            json_group_array(DISTINCT ID) as ID,
            evalDuplicate(
                $ReceiptSum,
                ReceiptSum,
                $Date,
                Date,
                $Account,
                Account,
                $Store,
                Store
            ) as count
        FROM view_ReceiptList
        WHERE count > 1
            AND $ID != ID;
        `;
        const oDuplicateStatement = oDb.prepare(sSql);

        sSql = `
        SELECT
            view.*,
            r.DuplicateHint
        FROM view_ReceiptList view
        JOIN Receipts r
            ON r.ID = view.ID
        `;
        const oStmt = oDb.prepare(sSql);

        const aResult = [];
        for (const oItem of oStmt.iterate()) {
            const oResult = oDuplicateStatement.get(oItem);
            oResult.ID = JSON.parse(oResult.ID);

            const aDuplicateList = JSON.parse(oItem.DuplicateHint || "[]");
            oResult.ID = oResult.ID.filter(sID => {
                return !aDuplicateList.includes(sID);
            });

            if (oResult.ID.length) {
                oResult.ID.push(oItem.ID);
                oResult.ID.sort();

                const sResult = JSON.stringify(oResult);
                if (!aResult.includes(sResult)) {
                    aResult.push(sResult);
                }
            }
        }
        return aResult.map(sItem => {
            return JSON.parse(sItem);
        });
    }

    evalDuplicate (iSum1, iSum2, iDate1, iDate2, iAccount1, iAccount2, iStore1, iStore2) {
        let iCount = 0;

        if (iSum1 === iSum2) {
            iCount++;

            const iDays = 4;
            const iSeconds = 60 * 60 * 24 * iDays;
            if (iDate1 - iSeconds < iDate2 && iDate1 + iSeconds > iDate2) {
                iCount++;

                if (iAccount1 === iAccount2) {
                    iCount++;
                }

                if (iStore1 === iStore2) {
                    iCount++;
                }
            }
        }

        return iCount;
    }
}

export const ReceiptListView = new _ReceiptListView();
