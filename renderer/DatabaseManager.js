import { EventBus } from "./EventBus.js";
import { DialogManager } from "./common/DialogManager.js";

class _DatabaseManager {
    constructor () {
        EventBus.listen("database-locked", this.onDatabaseLocked, this);
        EventBus.listen("database-abort", this.onDatabaseAbort, this);
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
}

export const DatabaseManager = new _DatabaseManager();
