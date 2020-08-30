import { Helper } from "../database/helper.js";
import { EventBus } from "../../renderer/EventBus.js";
import { Deferred } from "../../renderer/common/Deferred.js";
import { Version } from "../common/Version.js";

const path = require('path');
const { remote } = require('electron');
const { readFile } = require('fs').promises;

const sUserData = remote.app.getPath("userData");
const sBackup = path.join(sUserData, "backup.sqlite3");

const versionInfo = require("./migration/versionInfo.json");

class _MigrationHelper {
    constructor () {
        this.appVersion = new Deferred();

        EventBus.sendToMain("appVersion");
        EventBus.listen("appVersion", (oEvent, sVersion) => {
            const oVersion = new Version(sVersion);
            this.appVersion.resolve(oVersion);
        });
    }

    ensureVersion (oDb) {
        return this.checkCompatibility(oDb)
            // Database needs upgrade
            .catch((oResult) => {
                console.log("database needs upgrade");
                return this.askForPermission(oResult, oDb)
                    // User accepted to do the upgrade
                    .then(() => {
                        console.log("database upgrade starts");
                        return this.handleUpgrade(oDb);
                    })
                    // Upgrade successful
                    .then(() => {
                        EventBus.sendToBrowser("database-upgrade-success");
                    })
                    // Upgrade failed
                    .catch(() => {
                        EventBus.sendToBrowser("database-upgrade-failure");
                        return Promise.reject();
                    });
            });
    }

    askForPermission (oResult, oDb) {
        return new Promise((resolve, reject) => {
            EventBus.sendToBrowser("database-upgrade", oResult.app, oResult.current, oResult.min, oDb.path);

            EventBus.listenOnce("database-upgrade", (oEvent, bDoUpdate, sPath) => {
                if (sPath === oDb.path) {
                    if (bDoUpdate) {
                        resolve(true);
                    } else {
                        reject();
                    }
                }
            });
        });
    }

    handleUpgrade (oDb) {
        return oDb.db.backup(sBackup)
            .then(() => {
                return this.upgradeToNext(oDb.db);
            })
            .catch((oErr) => {
                oDb.applyBackup(sBackup);
                return Promise.reject("failed");
            })
            .then(() => {
                return this.checkCompatibility(oDb);
            })
            .catch((vError) => {
                // database is still not up to date
                if (vError !== "failed") {
                    return this.handleUpgrade(oDb);
                }
                return Promise.reject();
            });
    }

    checkCompatibility (oDb) {
        return this.appVersion.promise.then(oAppVersion => {
            return new Promise((resolve, reject) => {
                let oMin;
                const oDbVersion = new Version(Helper.getVersion(oDb.db));

                // catch development use case
                try {
                    oMin = new Version(versionInfo.compatibility[oAppVersion.toString()].min);
                } catch (oErr) {
                    console.error(oErr);
                    oMin = oDbVersion;
                }

                console.log("Minimum:", oMin.toString(), "Current:", oDbVersion.toString());

                // database needs upgrade
                if (oDbVersion.isSmaller(oMin)) {
                    const oVersions = {
                        app: oAppVersion.toString(),
                        current: oDbVersion.toString(),
                        min: oMin.toString()
                    };
                    reject(oVersions);
                } else {
                    resolve();
                }
            });
        });
    }

    upgradeToNext (oDb) {
        const sDbVersion = Helper.getVersion(oDb);

        // update is available
        if (versionInfo.upgrades[sDbVersion]) {
            const sUpgradeFilePath = path.join(__dirname, versionInfo.upgrades[sDbVersion]);

            return readFile(sUpgradeFilePath, "utf8")
                .then(sSql => {
                    oDb.exec(sSql);
                });
        }
        return Promise.reject();
    }
};

export const MigrationHelper = new _MigrationHelper();
