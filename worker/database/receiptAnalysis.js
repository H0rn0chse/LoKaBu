import { Table } from "../common/Table.js";
import { DatabaseManager } from "./DatabaseManager.js";
import { SqlStatement } from "../common/SqlStatement.js";
import { SqlFilterOption } from "../common/SqlFilterOption.js";

class _AnalysisView extends Table {
    constructor () {
        super("receiptAnalysis");

        this.baseSelect = `
        SELECT *
        FROM view_Analysis
        `;
    }

    readSqlAction (aFilter = [], sGroupColumn = "Type") {
        const oSqlStatement = new SqlStatement("view_Analysis", "ID")
            .setDefaultSql(this.baseSelect);

        aFilter.forEach((oFilterOption) => {
            oSqlStatement.addFilterOption(new SqlFilterOption(oFilterOption));
        });

        const sSql = `
        SELECT
            Date as Date,
            sum(Value) as Value,
            ${sGroupColumn} as GroupValue,
            '${sGroupColumn}' as GroupColumn
        FROM (${oSqlStatement.getSql()})
        GROUP BY Date, ${sGroupColumn}
        `;

        const aEntries = DatabaseManager.get()
            .prepare(sSql)
            .all();

        return {
            data: aEntries
        };
    }
}

export const AnalysisView = new _AnalysisView();
