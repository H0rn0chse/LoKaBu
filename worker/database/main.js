/* eslint-disable no-unused-vars */

import { AccountTable } from "./accounts.js";
import { db } from "./databaseConnection.js";
// import { databaseInfo } from "./databaseInfo.js";
import { I18nTable } from "./i18n.js";
import { LinesTable } from "./lines.js";
import { PersonsTable } from "./persons.js";
import { receiptAnalysis } from "./receiptAnalysis.js";
// import { receiptDetail } from "./receiptDetail.js";
import { ReceiptListView } from "./receiptList.js";
import { ReceiptsTable } from "./receipts.js";
import { SettingsTable } from "./settings.js";
import { StoresTable } from "./stores.js";
import { TypesTable } from "./types.js";

db.open();
db.resolveSettings(SettingsTable);

console.log("all loaded", db.get());

export const main = {};
