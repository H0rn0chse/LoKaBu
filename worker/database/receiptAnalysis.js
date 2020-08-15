// eslint-disable-next-line no-unused-vars
import { EventBus } from "../../renderer/EventBus.js";
// import { DatabaseManager } from "./DatabaseManager.js";

function read () {
    /* const sSql = `
    SELECT *
    FROM *
    `;
    return oDb.get().get(sSql); */
};

EventBus.listen("receiptAnalysis-create", (oEvent, sMessage) => {
    // todo error handling
});

EventBus.listen("receiptAnalysis-read", (oEvent, sMessage) => {
    EventBus.sendToBrowser("receiptAnalysis-read", read());
});

EventBus.listen("receiptAnalysis-update", (oEvent, sMessage) => {
    // todo error handling
});

EventBus.listen("receiptAnalysis-delete", (oEvent, sMessage) => {
    // todo error handling
});

export const receiptAnalysis = {
    read
};
