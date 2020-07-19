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

ipc.on("i18n-read-list", (oEvent, sMessage) => {
    ipc.sendToRenderer("i18n-read-list", read());
});

export const i18n = {
    read
};
