const BetterSqlite3 = require("better-sqlite3");
const path = require("path");
const fs = require("fs");
const { remote } = require('electron');
const Lock = require("./../../../assets/lock");

const sDir = remote.app.getPath("userData");
const sDatabasePath = path.join(sDir, "database.sqlite3");
const sBasePath = path.join(__dirname, "/../../../base_database.sqlite3.sql");
const sSharedBasePath = path.join(__dirname, "/../../../base_database.sqlite3.sql");

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

function open () {
    oDatabase = _openOrCreateDatabase(sDatabasePath, sBasePath);

    const sSharedDatabasePath = oSettings.readSharedDir();
    if (sSharedDatabasePath !== "") {
        openOrCreateShared(sSharedDatabasePath);
    }
}

function close () {
    console.log("i should close the file");
    if (oLock) {
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
    oLock = new Lock(() => {
        console.log("lock was opened");
        window.ipcRenderer.sendTo(window.iRendererId, "database-abort");
    });
    console.log(sPath);
    if (oLock.close(path.dirname(sPath))) {
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
    get,
    openOrCreateShared
};

// require of database after module.exports due to cyclic dependencies
const oSettings = require("./settings");
