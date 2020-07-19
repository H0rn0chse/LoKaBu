/* eslint-disable no-unused-vars */

import { accounts } from "./accounts.js";
import { db } from "./databaseConnection.js";
import { databaseInfo } from "./databaseInfo.js";
import { i18n } from "./i18n.js";
import { lines } from "./lines.js";
import { persons } from "./persons.js";
import { receiptAnalysis } from "./receiptAnalysis.js";
import { receiptDetail } from "./receiptDetail.js";
import { receiptList } from "./receiptList.js";
import { receipts } from "./receipts.js";
import { settings } from "./settings.js";
import { stores } from "./stores.js";
import { types } from "./types.js";

db.setSettings(settings);

export const main = {};
