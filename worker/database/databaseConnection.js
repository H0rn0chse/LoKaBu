const BetterSqlite3 = require("better-sqlite3");
const path = require("path");
const fs = require("fs");
const { remote } = require('electron');
const Lock = require("../../assets/lock");

const sDir = remote.app.getPath("userData");
const sDatabasePath = path.join(sDir, "database.sqlite3");
const sBasePath = path.join(__dirname, "/../../base_database.sqlite3.sql");
const sSharedBasePath = path.join(__dirname, "/../../base_database.sqlite3.sql");

let oLock;

let oDatabase;
let oSharedDatabase;

function _openOrCreateDatabase (sPath, sBasePath) {
    let oRef;
    try {
        fs.accessSync(sPath, (fs.constants || fs).F_OK);
        oRef = new BetterSqlite3(sPath, { verbose: console.log });

        window.ipcRenderer.send("log", "database was loaded", sPath);
    } catch (err) {
        oRef = new BetterSqlite3(sPath, { verbose: console.log });

        const sSql = fs.readFileSync(sBasePath, "utf8");
        oRef.exec("PRAGMA foreign_keys = OFF;");
        sSql.split(";").forEach((sStmt) => {
            oRef.exec(sStmt);
        });
        oRef.exec("PRAGMA foreign_keys = ON;");

        window.ipcRenderer.send("log", "database was created", sPath);
    }
    window.ipcRenderer.sendTo(window.iRendererId, "database-open");
    return oRef;
}

function open (bSupressShared = false) {
    oDatabase = _openOrCreateDatabase(sDatabasePath, sBasePath);

    if (!bSupressShared) {
        const sDefaultDatabasePath = oSettings.readDefaultDir();
        if (JSON.stringify(path.parse(sDatabasePath)) !== JSON.stringify(path.parse(sDefaultDatabasePath))) {
            openOrCreateShared(sDefaultDatabasePath);
        }
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
            window.ipcRenderer.sendTo(window.iRendererId, "database-abort");
            window.ipcRenderer.sendTo(window.iRendererId, "database-open");
        }
    });
    console.log(sPath);
    if (oLock.close(sPath)) {
        console.log("lock was successfully closed");

        oSharedDatabase = _openOrCreateDatabase(sPath, sSharedBasePath);

    // if lock file exists
    } else {
        console.log("lock could not be closed");
        window.ipcRenderer.sendTo(window.iRendererId, "database-locked", oLock.getTimestamp());

        window.ipcRenderer.once("database-force", () => {
            oLock.forceClose();
            oSharedDatabase = _openOrCreateDatabase(sPath, sSharedBasePath);
        });
    }
}

module.exports = {
    open,
    close,
    closeShared,
    get,
    openOrCreateShared
};

// require of database after module.exports due to cyclic dependencies
const oSettings = require("./settings");
