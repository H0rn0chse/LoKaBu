import { db } from "./databaseConnection.js";
import { ipc } from "./ipc.js";

function read () {
    const sSql = `
    SELECT *
    FROM Persons
    `;
    const oStmt = db.get().prepare(sSql);
    return oStmt.all();
};

function write (oPersons) {
    if (Array.isArray(oPersons)) {
        // overwrite all
        const sSql = `
        UPDATE Persons
        SET DisplayName = $DisplayName
        WHERE ID = $ID
        `;
        const oStmt = db.get().prepare(sSql);
        oPersons.forEach((oParams) => {
            oStmt.run(oParams);
        });
    } else if (oPersons.ID !== undefined) {
        // update
        const sSql = `
        UPDATE Persons
        SET DisplayName = $DisplayName
        WHERE ID = $ID
        `;
        const oStmt = db.get().prepare(sSql);
        oStmt.run(oPersons);
    } else {
        // add
        const sSql = `
        INSERT INTO Persons
        (DisplayName) VALUES ($DisplayName)
        `;
        const oStmt = db.get().prepare(sSql);
        oStmt.run(oPersons);
    }
};

ipc.on("persons-create", (oEvent, sMessage) => {
    // todo implementation
});

ipc.on("persons-read", (oEvent, sMessage) => {
    ipc.sendToRenderer("persons-read", read());
});

ipc.on("persons-update", (oEvent, oPersons) => {
    write(oPersons);
    ipc.sendToRenderer("persons-read", read());
});

ipc.on("persons-delete", (oEvent, sMessage) => {
    // todo error handling
});

export const persons = {
    read,
    write
};
