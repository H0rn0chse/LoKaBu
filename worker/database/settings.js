import { db } from "./databaseConnection.js";
import { ipc } from "./ipc.js";

function read () {
    const sSql = `
    SELECT *
    FROM Settings
    `;
    const oStmt = db.get().prepare(sSql);
    const oResult = oStmt.get();
    oResult.DefaultDir = readDefaultDir();
    oResult.CurrentDir = db.get().name;
    return oResult;
};

function readDefaultDir () {
    const sSql = `
    SELECT DefaultDir
    FROM Settings
    `;
    const oStmt = db.get("user").prepare(sSql);
    return oStmt.get().DefaultDir;
}

function write (oSettings) {
    let oParams = {
        Person: oSettings.Person,
        Type: oSettings.Type,
        Language: oSettings.Language
    };
    let sSql = `
    UPDATE Settings
    SET Person = $Person,
        Type = $Type,
        Language = $Language
    `;
    let oStmt = db.get().prepare(sSql);
    oStmt.run(oParams);
    // User specific defaults
    oParams = {
        DefaultDir: oSettings.DefaultDir
    };
    sSql = `
    UPDATE Settings
    SET DefaultDir = $DefaultDir
    `;
    oStmt = db.get("user").prepare(sSql);
    oStmt.run(oParams);
};

ipc.on("settings-read-object", (oEvent, sMessage) => {
    ipc.sendToRenderer("settings-read-object", read());
});

ipc.on("settings-write-object", (oEvent, oSettings) => {
    write(oSettings);
    ipc.sendToRenderer("settings-read-object", read());
});

export const settings = {
    read,
    readDefaultDir,
    write
};
