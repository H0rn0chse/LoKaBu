const oAccounts = require("../databaseObjects/accounts");
const oDatabaseInfo = require("../databaseObjects/databaseInfo");
const oPersons = require("../databaseObjects/persons");
const oReceiptAnalysis = require("../databaseObjects/receiptAnalysis");
const oReceiptDetail = require("../databaseObjects/receiptDetail");
const oReceiptList = require("../databaseObjects/receiptList");
const oSettings = require("../databaseObjects/settings");
const oTypes = require("../databaseObjects/types");

window.newSection = {
    init: function () {
        console.log("Section new was initialized");
        oAccounts.refresh(() => {
            console.log("accounts:", oAccounts.get());
        });
        oDatabaseInfo.refresh(() => {
            console.log("databaseInfo", oDatabaseInfo.get());
        });
        oPersons.refresh(() => {
            console.log("persons", oPersons.get());
        });
        oReceiptAnalysis.refresh(() => {
            console.log("receiptAnalysis", oReceiptAnalysis.get());
        });
        oReceiptDetail.refresh(() => {
            console.log("receiptDetail", oReceiptDetail.get());
        });
        oReceiptList.refresh(() => {
            console.log("receiptList", oReceiptList.get());
        });
        oSettings.refresh(() => {
            console.log("setings", oSettings.get());
        });
        oTypes.refresh(() => {
            console.log("types", oTypes.get());
        });
    },
    readConfig: function () {
        console.log("accounts:", oAccounts.get());
        console.log("databaseInfo", oDatabaseInfo.get());
        console.log("persons", oPersons.get());
        console.log("receiptAnalysis", oReceiptAnalysis.get());
        console.log("receiptDetail", oReceiptDetail.get());
        console.log("receiptList", oReceiptList.get());
        console.log("setings", oSettings.get());
        console.log("types", oTypes.get());
    }
};
