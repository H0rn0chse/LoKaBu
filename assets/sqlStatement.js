export class SqlStatement {
    constructor (sTableName, sControlColumn) {
        this.tableName = sTableName;
        this.controlColumn = sControlColumn;
        this.sql = "";
        this.sortColumn = "";
        this.sortDirection = "";
    }

    setDefaultSql (sSql) {
        this.default = sSql;
        return this;
    }

    setSort (sSortColumn, sSortDirection) {
        this.sortColumn = sSortColumn;
        this.sortDirection = sSortDirection;
        return this;
    }

    addFilterOption (oFilterOption) {
        if (!oFilterOption.hasEmptyValue()) {
            if (this.sql !== "") {
                this.sql += "INTERSECT\n";
            }
            const sFromClause = oFilterOption.getFromClause();
            const sWhereClause = oFilterOption.getWhereClause();
            const sHavingClause = oFilterOption.getHavingClause(this.controlColumn);

            this.sql += "SELECT $SelectClause\n";
            this.sql += "FROM " + this.tableName + sFromClause;
            this.sql += sWhereClause;
            this.sql += "GROUP BY " + this.controlColumn + "\n";
            this.sql += sHavingClause;
        }
        return this;
    }

    getSql () {
        let sSql = this.sql;
        if (sSql === "") {
            sSql = this.default;
        }
        if (this.sortColumn !== undefined && this.sortDirection !== undefined) {
            sSql += "ORDER BY " + this.sortColumn + " " + this.sortDirection + "\n";
        }
        return sSql.replace(/\$SelectClause/g, this.tableName + ".*");
    }

    getPageSql (iPage) {
        const sPage = parseInt(iPage, 10) - 1;
        let sSql = this.sql;
        if (sSql === "") {
            sSql = this.default;
        }
        let sSqlResult = `
        SELECT *
        FROM
            ($Data),
            (SELECT count(*) as LineCount
            FROM ($Data)),
            (SELECT PageItems as PageSize FROM Settings)
        $Sort
        LIMIT (SELECT PageItems FROM Settings) OFFSET (SELECT PageItems FROM Settings)*$PageNumber
        `
            .replace(/\$Data/g, sSql.replace(/\$SelectClause/g, this.tableName + ".*"))
            .replace(/\$PageNumber/g, sPage);
        if (this.sortColumn !== undefined && this.sortDirection !== undefined) {
            sSqlResult = sSqlResult.replace(/\$Sort/g, "ORDER BY " + this.sortColumn + " " + this.sortDirection);
        } else {
            sSqlResult = sSqlResult.replace(/\$Sort/g, "");
        }
        return sSqlResult;
    }
}
