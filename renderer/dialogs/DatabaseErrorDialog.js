import { Dialog } from "./common/Dialog.js";
import { EventBus } from "../EventBus.js";

const { dialog } = require('electron').remote;

class _DatabaseErrorDialog extends Dialog {
    constructor () {
        super();
        EventBus.listen("database-error", this.show, this);
    }

    _getTranslations () {
        return {
            "error-trans": ["database.error"]
        };
    }

    _show (oEvent, oData) {
        const sError = oData.error;
        return dialog.showMessageBox({
            type: "error",
            message: `${this.getProperty("error-trans")}\n${sError}`
        });
    }
}

export const DatabaseErrorDialog = new _DatabaseErrorDialog();
