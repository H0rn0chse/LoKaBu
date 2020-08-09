import { EventBus } from "./EventBus.js";
import { DialogManager } from "./common/DialogManager.js";
const { remote } = require("electron");

class _DatabaseManager {
    constructor () {
        EventBus.listen("database-locked", this.onDatabaseLocked, this);
        EventBus.listen("database-abort", this.onDatabaseAbort, this);
        EventBus.listen("migration-upgrade", this.onMigrationUpgrade, this);
    }

    onDatabaseLocked (oEvent, sMessage) {
        DialogManager.databaseLocked(sMessage)
            .then((bForceOpen) => {
                if (bForceOpen) {
                    EventBus.sendToDatabase("database-force");
                } else {
                    EventBus.sendToDatabase("database-open");
                }
            })
            .catch(() => {});
    }

    onDatabaseAbort () {
        DialogManager.databaseAbort();
    }

    onMigrationUpgrade (oEvent, sAppVersion, sSourceVersion, sTargetVersion) {
        DialogManager.migrationUpgrade(sAppVersion, sSourceVersion, sTargetVersion)
            .then(() => {
                // todo do the upgrade
            })
            .catch(() => {
                remote.getCurrentWindow().close();
            });
    }
}

export const DatabaseManager = new _DatabaseManager();
