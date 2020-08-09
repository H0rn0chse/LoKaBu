import { Helper } from "../database/helper.js";
import { EventBus } from "../../renderer/EventBus.js";
import { Deferred } from "../../renderer/common/Deferred.js";
import { Version } from "./Version.js";
const compList = require("./worker/migration/compatibilities.json");

class _MigrationManager {
    constructor () {
        this.appVersion = new Deferred();

        EventBus.sendToMain("appVersion");
        EventBus.listen("appVersion", (oEvent, sVersion) => {
            const oVersion = new Version(sVersion);
            this.appVersion.resolve(oVersion);
        });
    }

    checkCompatibility (oDb) {
        return this.appVersion.promise.then(oAppVersion => {
            const oDbVersion = new Version(Helper.getVersion(oDb));

            const oMin = new Version(compList[oAppVersion.toString()].min);

            // database needs upgrade
            if (oDbVersion.isSmaller(oMin)) {
                EventBus.sendToCurrentWindow("i18n-read");
                EventBus.sendToBrowser("migration-upgrade", oAppVersion.toString(), oDbVersion.toString(), oMin.toString());
                throw new Error("This database version is not compatible");
            }
        });
    }
};

export const MigrationManager = new _MigrationManager();
