import { Dialog } from "../common/Dialog.js";
import { EventBus } from "../EventBus.js";

const { dialog } = require('electron').remote;

class _UpgradeResultDialog extends Dialog {
    constructor () {
        super();
        EventBus.listen("database-upgrade-success", this.show.bind(this, "success"));
        EventBus.listen("database-upgrade-failure", this.show.bind(this, "failure"));
    }

    _getTranslations () {
        return {
            "success-trans": ["database.success"],
            "failure-trans": ["database.failure"]
        };
    }

    _show (sResult) {
        const bSuccess = sResult === "success";
        const sTrans = bSuccess ? "success-trans" : "failure-trans";
        const sType = bSuccess ? "info" : "error";

        return dialog.showMessageBox({
            type: sType,
            message: this.getProperty(sTrans)
        });
    }
}

export const UpgradeResultDialog = new _UpgradeResultDialog();
