import { EventBus } from "../EventBus.js";
import { Dialog } from "../common/Dialog.js";
import { ConfirmDialog } from "./ConfirmDialog.js";

const { dialog } = require('electron').remote;

class _UpgradeDatabaseDialog extends Dialog {
    constructor () {
        super();
        EventBus.listen("database-upgrade", this.show, this);
    }

    _getTranslations () {
        return {
            "upgrade-trans": ["database.upgrade"]
        };
    }

    _show (oEvent, sAppVersion, sSourceVersion, sTargetVersion, sPath) {
        let sText = this.getProperty("upgrade-trans");

        sText = sText
            .replace(/\$AppVersion/g, sAppVersion)
            .replace(/\$SourceVersion/g, sSourceVersion)
            .replace(/\$TargetVersion/g, sTargetVersion);

        const oDialogPromise = dialog.showMessageBox({
            type: "error",
            message: sText,
            buttons: this._getDefaultButtons(),
            cancelId: 1
        });
        return this._cancelToReject(oDialogPromise, 1)
            .then(() => {
                return ConfirmDialog.show();
            })
            .then(() => {
                EventBus.sendToDatabase("database-upgrade", true, sPath);
            })
            .catch(() => {
                EventBus.sendToDatabase("database-upgrade", false, sPath);
            });
    }
}

export const UpgradeDatabaseDialog = new _UpgradeDatabaseDialog();
