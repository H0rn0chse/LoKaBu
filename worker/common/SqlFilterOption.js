import { Enums } from "../../renderer/Enums.js";

export class SqlFilterOption {
    constructor (oInput) {
        this.column = oInput.column;
        this.columnOption = oInput.columnOption;
        this.inputOption = oInput.inputOption;
        this.inputType = oInput.inputType;
        this.value = oInput.value;
        this.table = "";
    }

    setTable (sTable) {
        this.table = sTable;
    }

    hasEmptyValue () {
        const Input = Enums.InputOptions;

        switch (this.inputType) {
            case Input.Text:
                return this.value === undefined;
            case Input.Number:
                return this.value === "" || this.value === undefined;
            case Input.Date:
                return this.value === "" || this.value === undefined;
            case Input.List:
                return this.value === "" || this.value === undefined;
        }
        return true;
    }

    getWhereClause () {
        const Input = Enums.InputOptions;

        // build aggregated column if there is a column option selected
        const sColumn = this.columnOption.value ? `json${this.column}.value` : `${this.table}.${this.column}`;

        let sValue = this.value;
        if (this.inputOption.sql.includes("like")) {
            sValue = `%${sValue}%`;
        }
        if (this.inputType === Input.Text) {
            sValue = `'${sValue}'`;
        }
        if (this.inputType === Input.Date) {
            sValue = new Date(sValue).getTime() / 1000;
        }
        const sNot = this.columnOption.value === "none" ? "NOT " : "";

        return `WHERE ${sNot}${sColumn} ${this.inputOption.sql} ${sValue}\n`;
    }

    getHavingClause (sControlColumn) {
        if (this.columnOption.value === "all" || this.columnOption.value === "none") {
            return `HAVING count(${sControlColumn}) = json_array_length(${this.table}.${this.column})\n`;
        }
        return "";
    }

    getFromClause () {
        if (this.columnOption.value !== "" && this.columnOption.value !== undefined) {
            return `, json_each(${this.table}.${this.column}) as json${this.column}\n`;
        }
        return "\n";
    }
}
