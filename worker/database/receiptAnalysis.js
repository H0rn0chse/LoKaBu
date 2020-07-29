// eslint-disable-next-line no-unused-vars
import { db } from "./databaseConnection.js";
import { ipc } from "./ipc.js";

function read () {
    /* const sSql = `
    SELECT *
    FROM *
    `;
    return oDb.get().get(sSql); */
};

ipc.on("receiptAnalysis-create", (oEvent, sMessage) => {
    // todo error handling
});

ipc.on("receiptAnalysis-read", (oEvent, sMessage) => {
    ipc.sendToRenderer("receiptAnalysis-read", read());
});

ipc.on("receiptAnalysis-update", (oEvent, sMessage) => {
    // todo error handling
});

ipc.on("receiptAnalysis-delete", (oEvent, sMessage) => {
    // todo error handling
});

export const receiptAnalysis = {
    read
};
