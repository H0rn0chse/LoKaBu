import { Dialog } from "../common/Dialog.js";

const { dialog } = require('electron').remote;

class _ImportFragmentSuccessDialog extends Dialog {
    _getTranslations () {
        return {
            "success-trans": ["scanner.import.success"]
        };
    }

    _show () {
        const oDialogPromise = dialog.showMessageBox({
            type: "info",
            message: this.getProperty("success-trans")
        });
        return this._cancelToReject(oDialogPromise);
    }
}

export const ImportFragmentSuccessDialog = new _ImportFragmentSuccessDialog();
