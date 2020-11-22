import { Dialog } from "../common/Dialog.js";

const { dialog } = require('electron').remote;

class _ConfirmDialog extends Dialog {
    _getTranslations () {
        return {
            "dialogConfirm-trans": ["dialog.confirm"]
        };
    }

    _show (sCustomConfirmText) {
        const oDialogPromise = dialog.showMessageBox({
            type: "warning",
            message: sCustomConfirmText || this.getProperty("dialogConfirm-trans"),
            buttons: this._getDefaultButtons(),
            cancelId: 1
        });
        return this._cancelToReject(oDialogPromise, 1);
    }
}

export const ConfirmDialog = new _ConfirmDialog();
