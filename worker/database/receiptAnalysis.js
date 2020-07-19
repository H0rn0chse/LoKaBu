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

ipc.on("receiptAnalysis-read-object", (oEvent, sMessage) => {
    ipc.sendToRenderer("receiptAnalysis-read-object", read());
});

export const receiptAnalysis = {
    read
};
