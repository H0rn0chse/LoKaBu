import { EventBus } from "../EventBus.js";
import { Dialog } from "./common/Dialog.js";
import { DateToFull } from "../../core/common/DateUtils.js";

const { dialog } = require('electron').remote;

class _LockedDatabaseDialog extends Dialog {
    constructor () {
        super();
        EventBus.listen("database-locked", this.show, this);
    }

    _getTranslations () {
        return {
            "locked-trans": ["database.locked"],
            "confirm-trans": ["common.confirm"],
            "cancel-trans": ["common.cancel"],
            "openDefault-trans": ["database.openDefault"]
        };
    }

    _show (oEvent, sMessage, sDatabase) {
        let sText = this.getProperty("locked-trans");
        const sDate = DateToFull(new Date(parseInt(sMessage, 10)));

        if (sText.includes("$")) {
            sText = sText.replace(/\$/g, sDate);
        } else {
            sText += " - " + sDate;
        }

        const oDialogPromise = dialog.showMessageBox({
            type: "warning",
            message: sText,
            buttons: [
                this.getProperty("confirm-trans"),
                this.getProperty("openDefault-trans"),
                this.getProperty("cancel-trans")
            ],
            cancelId: 2
        });
        return this._cancelToReject(oDialogPromise, 2)
            .then((oResult) => {
                const bForceOpen = oResult.response === 0;
                EventBus.sendToDatabase("database-force", bForceOpen, sDatabase);
            })
            .catch(() => {
                EventBus.sendToDatabase("database-force", false, sDatabase);
            });
    }
}

export const LockedDatabaseDialog = new _LockedDatabaseDialog();
