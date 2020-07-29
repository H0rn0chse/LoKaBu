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
    try {
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
    } catch (oError) {
        return oError.toString();
    }
    return true;
};

ipc.on("settings-create", (oEvent, sMessage) => {
    // todo error handling
});

ipc.on("settings-read", (oEvent, sMessage) => {
    ipc.sendToRenderer("settings-read", read());
});

// todo handle error cases
ipc.on("settings-update", (oEvent, oSettings) => {
    const sError = write(oSettings);
    if (sError !== true) {
        ipc.sendToRenderer("settings-update", sError);
    } else {
        ipc.sendToRenderer("settings-update");
    }
});

ipc.on("settings-delete", (oEvent, sMessage) => {
    // todo error handling
});

export const settings = {
    read,
    readDefaultDir,
    write
};
