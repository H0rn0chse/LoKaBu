import { EventBus } from "../../renderer/EventBus.js";
import { MigrationHelper } from "../migration/MigrationHelper.js";
import { Database } from "../common/Database.js";

const path = require("path");
const { remote } = require('electron');

const sUserData = remote.app.getPath("userData");
const sUserDatabase = path.join(sUserData, "database.sqlite3");

class _DatabaseManager {
    constructor () {
        this.current = null;

        EventBus.listen("database-open", this.handleOpen, this);
        EventBus.listen("database-create", this.handleOpen, this);
    }

    init () {
        return this.handleOpen(null, sUserDatabase);
    }

    _isLoaded (sPath) {
        if (this.user && this.user.path === sPath) {
            return true;
        }
        if (this.shared && this.shared.path === sPath) {
            return true;
        }
        return false;
    }

    getInstance (sDatabase) {
        if (sDatabase === undefined) {
            sDatabase = this.current === null ? "user" : this.current;
        }

        if (sDatabase === "user") {
            return this.user;
        } else if (sDatabase === "shared") {
            return this.shared;
        }
    }

    get (sDatabase) {
        const oDb = this.getInstance(sDatabase);
        return oDb && oDb.db;
    }

    getPath (sDatabase) {
        return this.getInstance(sDatabase).path;
    }

    handleOpen (oEvent, sPath = sUserDatabase) {
        const sType = sPath === sUserDatabase ? "user" : "shared";

        if (!this._isLoaded(sPath)) {
            console.log(`opening database: ${sPath}`);
            const oDb = new Database(sPath, this.databaseAbort.bind(this));

            this._updateDatabase(oDb, sType);
            return this._openDatabase(oDb, sType);
        }
        console.log("database was already loaded");
        this.current = sType;
        EventBus.sendToBrowser("database-open");
        return Promise.resolve();
    }

    _openDatabase (oDb, sType) {
        return oDb.closeLock()
            // Lock is closed and checking for upgrades
            .then(() => {
                console.log("check database for upgrades");
                return MigrationHelper.ensureVersion(oDb);
            })
            // Database could be upgraded or didn't needed a upgrade
            .then(() => {
                console.log("database successfully opened");
                this.current = sType;
                EventBus.sendToBrowser("database-open");
            })
            // Lock could not be closed, Database will not get an update or update failed
            .catch(() => {
                if (sType === "user") {
                    // close app in case the user database cannot be updated
                    remote.getCurrentWindow().close();
                } else {
                    this._updateDatabase(null, sType);
                    this.current = null;
                }
            });
    }

    _updateDatabase (oDb, sType) {
        if (this[sType]) {
            this[sType].close();
            this[sType] = null;
        }
        this[sType] = oDb;
    }

    databaseAbort (oDb) {
        console.log("lock was opened forcefully");
        const sType = oDb.path === sUserDatabase ? "user" : "shared";

        // shutdown app in case user database was closed
        const bShutdown = sType === "user";

        if (this[sType]) {
            this[sType] = null;
        }

        this.current = null;
        EventBus.sendToBrowser("database-abort", bShutdown);
        EventBus.sendToBrowser("database-open");
    }

    close () {
        this._updateDatabase(null, "user");
        this._updateDatabase(null, "shared");
    }
}

export const DatabaseManager = new _DatabaseManager();
