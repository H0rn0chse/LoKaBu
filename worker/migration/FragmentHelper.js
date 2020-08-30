import { AccountTable } from "../database/accounts.js";
import { StoresTable } from "../database/stores.js";
import { PersonsTable } from "../database/persons.js";
import { TypesTable } from "../database/types.js";
import { ReceiptsTable } from "../database/receipts.js";
import { LinesTable } from "../database/lines.js";
import { EventBus } from "../../renderer/EventBus.js";

const fs = require("fs").promises;

class _FragmentHelper {
    constructor () {
        this.parser = new DOMParser();
    }

    import (oEvent, aFiles) {
        const aPromises = aFiles.map(sFile => {
            return fs.readFile(sFile, "utf-8")
                .then(this._fragmentToObject.bind(this))
                .then(this._mapObjectToDatabase.bind(this))
                .then(this._insertIntoDatabase.bind(this));
        });
        Promise.all(aPromises).then(() => {
            EventBus.sendToBrowser("database-open");
            EventBus.sendToBrowser("fragment-succuess");
        });
    }

    _insertIntoDatabase (oReceipt) {
        const oResult = ReceiptsTable.createSqlAction(oReceipt);

        oReceipt.lines.forEach(oLine => {
            oLine.Receipt = oResult.lastInsertRowid;
            LinesTable.createSqlAction(oLine);
        });
    }

    _mapObjectToDatabase (oObject) {
        const oReceipt = {};
        if (oObject.lines.length) {
            const oFirstLine = oObject.lines[0];

            // Receipt properties
            oReceipt.Date = parseInt(oFirstLine.ID.slice(0, -3), 10);
            oReceipt.Account = AccountTable.getOrCreate(oFirstLine.SourceAccount);
            oReceipt.Comment = "";
            oReceipt.Store = StoresTable.getOrCreate(oFirstLine.Store);

            oReceipt.lines = [];
            // Line properties
            oObject.lines.forEach(oLine => {
                const oLineOut = {
                    Receipt: undefined,
                    Value: parseInt(oLine.Value, 10),
                    Billing: PersonsTable.getOrCreate(oLine.Person),
                    Type: TypesTable.getOrCreate(oLine.Type),
                    Account: oLine.TargetAccount ? AccountTable.getOrCreate(oLine.TargetAccount) : null
                };

                oReceipt.lines.push(oLineOut);
            });
        }
        return oReceipt;
    }

    _fragmentToObject (sFragmentText) {
        console.log("got fragment text starting transformation to native object", sFragmentText);
        const sText = `<Receipt>${sFragmentText}</Receipt>`.replace(/\n/g, "");

        const xmlDoc = this.parser.parseFromString(sText, "text/xml");

        var oReceipt = {
            lines: []
        };

        if (xmlDoc) {
            const aLines = Array.from(xmlDoc.documentElement.childNodes);
            aLines.forEach(xmlLine => {
                const oLine = {};
                const oLineProps = Array.from(xmlLine.childNodes);
                oLineProps.forEach(xmlProp => {
                    oLine[xmlProp.nodeName] = xmlProp.textContent;
                });
                oReceipt.lines.push(oLine);
            });
        }

        return oReceipt;
    }
}

export const FragmentHelper = new _FragmentHelper();
