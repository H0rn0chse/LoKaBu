import { EventBus } from "../EventBus.js";
import { Dialog } from "./common/Dialog.js";

const { dialog } = require('electron').remote;

class _AbortDatabaseDialog extends Dialog {
    constructor () {
        super();
        EventBus.listen("database-abort", this.show, this);
    }

    _getTranslations () {
        return {
            "abort-trans": ["database.abort"]
        };
    }

    _show () {
        return dialog.showMessageBox({
            type: "warning",
            message: this.getProperty("abort-trans")
        });
    }
}

export const AbortDatabaseDialog = new _AbortDatabaseDialog();
