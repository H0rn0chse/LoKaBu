/* eslint-disable no-unused-vars */

import { DatabaseManager } from "./database/DatabaseManager.js";
import { AccountTable } from "./database/accounts.js";
import { I18nTable } from "./database/i18n.js";
import { LinesTable } from "./database/lines.js";
import { PersonsTable } from "./database/persons.js";
import { receiptAnalysis } from "./database/receiptAnalysis.js";
import { ReceiptListView } from "./database/receiptList.js";
import { ReceiptsTable } from "./database/receipts.js";
import { SettingsTable } from "./database/settings.js";
import { StoresTable } from "./database/stores.js";
import { TypesTable } from "./database/types.js";
import { Helper } from "./database/helper.js";

DatabaseManager.init().then(() => {
    const sPath = SettingsTable.readDefaultDir();
    if (sPath !== "" && sPath !== undefined) {
        DatabaseManager.handleOpen(null, sPath);
    }
});

export const database = {};
