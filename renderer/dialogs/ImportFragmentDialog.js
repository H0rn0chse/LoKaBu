import { Dialog } from "../common/Dialog.js";

const { dialog } = require('electron').remote;

class _ImportFragmentDialog extends Dialog {
    _getTranslations () {
        return {
            "scanner-trans": ["scanner.import"]
        };
    }

    _show (iCount) {
        const sText = this.getProperty("scanner-trans")
            .replace(/\$count/g, iCount);
        const oDialogPromise = dialog.showMessageBox({
            type: "info",
            message: sText,
            buttons: this._getDefaultButtons(),
            cancelId: 1
        });
        return this._cancelToReject(oDialogPromise, 1);
    }
}

export const ImportFragmentDialog = new _ImportFragmentDialog();
