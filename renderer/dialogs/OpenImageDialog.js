import { Dialog } from "../common/Dialog.js";

const { dialog } = require('electron').remote;

class _OpenImageDialog extends Dialog {
    _show () {
        const oDialogPromise = dialog.showOpenDialog({
            filters: [
                {
                    name: "Image",
                    extensions: ["png", "jpg", "jpeg"]
                }
            ],
            properties: ["createDirectory"]
        });
        return this._cancelToReject(oDialogPromise)
            .then(oResult => {
                return oResult.filePaths[0];
            });
    }
}

export const OpenImageDialog = new _OpenImageDialog();
