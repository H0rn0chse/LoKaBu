import { Lock } from "./Lock.js";
import { EventBus } from "../../renderer/EventBus.js";

const BetterSqlite3 = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const sBasePath = path.join(__dirname, "../base_database.sqlite3.sql");

export class Database {
    constructor (sPath, fnAbort) {
        this.path = sPath;
        this.fnAbort = fnAbort;

        this._openOrCreate(sPath);
    }

    _openOrCreate (sPath) {
        this.lock = new Lock(sPath, this.abort.bind(this));
        const bNewFile = !fs.existsSync(sPath);
        this.db = new BetterSqlite3(sPath, { verbose: console.log });

        if (bNewFile) {
            const sSql = fs.readFileSync(sBasePath, "utf8");
            this.db.exec(`PRAGMA foreign_keys = OFF; ${sSql} PRAGMA foreign_keys = ON;`);
        }
    }

    abort () {
        this.db.close();
        this.lock.forceOpen();
        this.fnAbort(this);
    }

    applyBackup (sPath) {
        this.db.close();
        fs.unlinkSync(this.path);
        fs.renameSync(sPath, this.path);
        this.db = new BetterSqlite3(sPath, { verbose: console.log });
    }

    close () {
        this.db.close();
        this.lock.open();
    }

    closeLock () {
        return new Promise((resolve, reject) => {
            if (this.lock.close()) {
                resolve();
                return;
            }

            this.fnResolveForce = resolve;
            this.fnRejectForce = reject;

            EventBus.listen("database-force", this._handleDatabaseForce, this);
            EventBus.sendToBrowser("database-locked", this.lock.getTimestamp(), this.path);
        });
    }

    _handleDatabaseForce (oEvent, bForce, sPath) {
        if (sPath === this.path) {
            if (bForce) {
                this.lock.forceClose();
                this.fnResolveForce();
            } else {
                this.fnRejectForce();
            }

            EventBus.removeHandler("database-force", this._handleDatabaseForce, this);
        }
    }
}
