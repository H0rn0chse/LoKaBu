import { Dialog } from "../common/Dialog.js";

const { dialog } = require('electron').remote;

class _ScannerResultDialog extends Dialog {
    _getTranslations () {
        return {
            "scanner-trans": ["scanner.result"],
            "replace-trans": ["scanner.replace"],
            "append-trans": ["scanner.append"],
            "cancel-trans": ["common.cancel"]
        };
    }

    _show () {
        const aButtons = [
            this.getProperty("replace-trans"),
            this.getProperty("append-trans"),
            this.getProperty("cancel-trans")
        ];
        const oDialogPromise = dialog.showMessageBox({
            type: "info",
            message: this.getProperty("scanner-trans"),
            buttons: aButtons,
            cancelId: 2
        });
        return this._cancelToReject(oDialogPromise, 2);
    }
}

export const ScannerResultDialog = new _ScannerResultDialog();
