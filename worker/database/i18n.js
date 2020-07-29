import { db } from "./databaseConnection.js";
import { ipc } from "./ipc.js";

function read () {
    const sSql = `
    SELECT *
    FROM i18n
    `;
    const oStmt = db.get("user").prepare(sSql);
    return oStmt.all();
};

ipc.on("i18n-create", (oEvent, sMessage) => {
    // todo error handling
});

ipc.on("i18n-read", (oEvent, sMessage) => {
    ipc.sendToRenderer("i18n-read", read());
});

ipc.on("i18n-update", (oEvent, sMessage) => {
    // todo error handling
});

ipc.on("i18n-delete", (oEvent, sMessage) => {
    // todo error handling
});

export const i18n = {
    read
};
