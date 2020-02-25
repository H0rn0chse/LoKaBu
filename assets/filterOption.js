const aValTypes = ["text", "number", "date"];
const aVarTypes = ["value", "list"];

function FilterOption (oArgs) {
    if (oArgs.column === undefined) {
        return;
    }
    if (!aValTypes.includes(oArgs.valType)) {
        return;
    }
    if (!aVarTypes.includes(oArgs.varType)) {
        return;
    }

    this.column = oArgs.column;
    this.input = oArgs.input;
    this.varType = oArgs.varType;
    this.valType = oArgs.valType;
    this.i18n = oArgs.i18n;
    this.format = oArgs.format;
};

FilterOption.prototype.hasEmptyValue = function () {
    if (this.input) {
        if (this.valType === "text" && this.input.value !== undefined) {
            return false;
        }
        if ((this.valType === "number" || this.valType === "date") && this.input.value !== "" && this.input.value !== undefined) {
            return false;
        }
    }
    return true;
};

FilterOption.prototype.getOptions = function () {
    const aOptions = [];
    switch (this.varType) {
        case "list":
            aOptions.push([
                {
                    value: "all",
                    i18n: "filter.all"
                }, {
                    value: "none",
                    i18n: "filter.none"
                }, {
                    value: "at least one",
                    i18n: "filter.atLeastOne"
                }
            ]);
            break;
        default:
            aOptions.push([]);
    }
    switch (this.valType) {
        case "text":
            aOptions.push([
                {
                    value: "equal",
                    i18n: "filter.equal",
                    sql: "="
                }, {
                    value: "unequal",
                    i18n: "filter.unequal",
                    sql: "!="
                }, {
                    value: "contains",
                    i18n: "filter.contains",
                    sql: "like"
                }, {
                    value: "contains not",
                    i18n: "filter.containsNot",
                    sql: "not like"
                }
            ]);
            break;
        case "number":
            aOptions.push([
                {
                    value: "equal",
                    i18n: "filter.equal",
                    sql: "="
                }, {
                    value: "unequal",
                    i18n: "filter.unequal",
                    sql: "!="
                }, {
                    value: "greater",
                    i18n: "filter.greater",
                    sql: ">"
                }, {
                    value: "smaller",
                    i18n: "filter.smaller",
                    sql: "<"
                }
            ]);
            break;
        case "date":
            aOptions.push([
                {
                    value: "equal",
                    i18n: "filter.equal",
                    sql: "="
                }, {
                    value: "unequal",
                    i18n: "filter.unequal",
                    sql: "!="
                }, {
                    value: "before",
                    i18n: "filter.before",
                    sql: "<"
                }, {
                    value: "after",
                    i18n: "filter.after",
                    sql: ">"
                }
            ]);
            break;
        default:
            aOptions.push([]);
    }
    return aOptions;
};

FilterOption.prototype.getWhereClause = function () {
    const oOption = this.getOptions()[1].find((oOption) => {
        return oOption.value === this.input.valType;
    });

    let sColumn = this.column;
    if (this.input.varType !== "") {
        sColumn = "json" + sColumn + ".value";
    }

    let sValue = this.input.value;
    if (oOption.sql.includes("like")) {
        sValue = "%" + sValue + "%";
    }
    if (this.valType === "text") {
        sValue = "\"" + sValue + "\"";
    }
    if (this.valType === "date") {
        sValue = new Date(sValue).getTime() / 1000;
    }

    let sNot = "";
    if (this.input.varType === "none") {
        sNot = "NOT ";
    }
    return "WHERE " + sNot + sColumn + " " + oOption.sql + " " + sValue + "\n";
};

FilterOption.prototype.getHavingClause = function (sControlColumn) {
    if (this.input.varType === "all" || this.input.varType === "none") {
        return "HAVING count(" + sControlColumn + ") = json_array_length(" + this.column + ")\n";
    }
    return "";
};

FilterOption.prototype.getFromClause = function () {
    if (this.input.varType !== "") {
        return ", json_each(" + this.column + ") as json" + this.column + "\n";
    }
    return "\n";
};

FilterOption.prototype.formatValue = function () {
    let sValue = this.input.value || "";
    switch (this.format) {
        case "0,00":
            sValue = parseFloat(sValue.replace(/,/g, ".")) || 0;
            return Math.round(sValue * 100);
        default:
            return sValue;
    }
};

module.exports = FilterOption;
