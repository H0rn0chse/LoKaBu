import { Lock } from "../common/Lock.js";
import { EventBus } from "../../renderer/EventBus.js";
import { Deferred } from "../../renderer/common/Deferred.js";
import { MigrationManager } from "../migration/MigrationManager.js";
const BetterSqlite3 = require("better-sqlite3");
const path = require("path");
const fs = require("fs");
const { remote } = require('electron');

const sDir = remote.app.getPath("userData");
const sDatabasePath = path.join(sDir, "database.sqlite3");
const sBasePath = path.join(__dirname, "./base_database.sqlite3.sql");
const sSharedBasePath = path.join(__dirname, "./base_database.sqlite3.sql");

let oLock;

let oDatabase;
let oSharedDatabase;
const pSettings = new Deferred();

EventBus.listen("database-open", (oEvent, sMessage) => {
    // open user database as default
    if (!sMessage) {
        close();
        open(true);
    } else {
        openOrCreateShared(sMessage);
    }
});

EventBus.listen("database-create", (oEvent, sMessage) => {
    openOrCreateShared(sMessage);
});

function _openOrCreateDatabase (sPath, sBasePath) {
    let oRef;
    try {
        fs.accessSync(sPath, (fs.constants || fs).F_OK);
        oRef = new BetterSqlite3(sPath, { verbose: console.log });

        EventBus.sendToMain("log", "database was loaded", sPath);
    } catch (err) {
        oRef = new BetterSqlite3(sPath, { verbose: console.log });

        const sSql = fs.readFileSync(sBasePath, "utf8");
        oRef.exec("PRAGMA foreign_keys = OFF;");
        sSql.split(";").forEach((sStmt) => {
            oRef.exec(sStmt);
        });
        oRef.exec("PRAGMA foreign_keys = ON;");

        EventBus.sendToMain("log", "database was created", sPath);
    }
    MigrationManager.checkCompatibility(oRef)
        .then(() => {
            EventBus.sendToBrowser("database-open");
        }).catch(() => {
            //todo do some error handling
        });
    return oRef;
}

function open (bSupressShared = false) {
    oDatabase = _openOrCreateDatabase(sDatabasePath, sBasePath);

    if (!bSupressShared) {
        return pSettings.promise
            .then(oSettings => {
                const sDefaultDatabasePath = oSettings._readDefaultDir();
                if (JSON.stringify(path.parse(sDatabasePath)) !== JSON.stringify(path.parse(sDefaultDatabasePath)) && sDefaultDatabasePath !== "") {
                    openOrCreateShared(sDefaultDatabasePath);
                }
            });
    }
}

function close () {
    closeShared();
}

function closeShared () {
    if (oSharedDatabase) {
        oSharedDatabase.close();
        oSharedDatabase = null;
        oLock.open();
    }
}

function get (sLayer) {
    switch (sLayer) {
        case "user":
            return oDatabase;
        case "shared":
            return oSharedDatabase;
        default:
            if (oSharedDatabase) {
                return oSharedDatabase;
            }
            return oDatabase;
    }
}

function openOrCreateShared (sPath) {
    closeShared();

    oLock = new Lock(() => {
        console.log("lock was opened");
        if (oSharedDatabase) {
            oSharedDatabase.close();
            oSharedDatabase = null;
            oLock.forceOpen();
            EventBus.sendToBrowser("database-abort");
            EventBus.sendToBrowser("database-open");
        }
    });
    console.log("try to close lock: ", sPath);
    if (oLock.close(sPath)) {
        console.log("lock was successfully closed");

        oSharedDatabase = _openOrCreateDatabase(sPath, sSharedBasePath);

    // if lock file exists
    } else {
        console.log("lock could not be closed");
        EventBus.sendToBrowser("database-locked", oLock.getTimestamp());

        EventBus.listen("database-force", () => {
            oLock.forceClose();
            oSharedDatabase = _openOrCreateDatabase(sPath, sSharedBasePath);
        });
    }
}

function resolveSettings (oSettingsTable) {
    pSettings.resolve(oSettingsTable);
}

export const db = {
    open,
    close,
    closeShared,
    get,
    openOrCreateShared,
    resolveSettings
};
