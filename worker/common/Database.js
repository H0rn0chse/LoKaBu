import { Lock } from "./Lock.js";
import { EventBus } from "../../renderer/EventBus.js";

const BetterSqlite3 = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const sBasePath = path.join(__dirname, "../base_database.sqlite3");

export class Database {
    constructor (sPath, fnAbort) {
        this.path = sPath;
        this.fnAbort = fnAbort;

        this._openOrCreate(sPath);
    }

    _openOrCreate (sPath) {
        this.lock = new Lock(sPath, this.abort.bind(this));
        let bNewFile = !fs.existsSync(sPath);

        // It might happen that the initial installation/ upgrade fails
        // Therefore the empty file gets removed and replaced with the template database
        if (!bNewFile) {
            const oStats = fs.statSync(sPath);
            if (oStats.size === 0) {
                fs.unlinkSync(sPath);
                bNewFile = true;
            }
        }

        if (bNewFile) {
            fs.copyFileSync(sBasePath, sPath);
        }
        this.db = new BetterSqlite3(sPath, { verbose: console.log });
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
