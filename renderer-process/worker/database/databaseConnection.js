const BetterSqlite3 = require("better-sqlite3");
const path = require("path");
const fs = require("fs");
const { remote } = require('electron');
const sDir = remote.app.getPath("userData");

const sDatabasePath = path.join(sDir, "database.sqlite3");

try {
    fs.accessSync(sDatabasePath, (fs.constants || fs).F_OK);
    window.oDatabase = new BetterSqlite3(sDatabasePath, { verbose: console.log });
    window.ipcRenderer.send("log", "database was loaded");
    console.log("all fine ", sDatabasePath);
} catch (err) {
    console.log(err);
    window.oDatabase = new BetterSqlite3(sDatabasePath, { verbose: console.log });
    const sPath = path.join(__dirname, "/../../../base_database.sqlite3.sql");
    console.log(sPath);
    const sSql = fs.readFileSync(sPath, "utf8");
    console.log(sSql);
    window.oDatabase.exec("PRAGMA foreign_keys = OFF;");
    sSql.split(";").forEach((sStmt) => {
        window.oDatabase.exec(sStmt);
    });
    window.oDatabase.exec("PRAGMA foreign_keys = ON;");
    window.ipcRenderer.send("log", "database was created");
    console.log("all fine2 ", sDatabasePath);
}
