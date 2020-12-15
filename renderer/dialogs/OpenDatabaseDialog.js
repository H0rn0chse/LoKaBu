import { Dialog } from "./common/Dialog.js";

const { dialog } = require('electron').remote;

class _OpenDatabaseDialog extends Dialog {
    _show () {
        const oDialogPromise = dialog.showOpenDialog({
            filters: [
                {
                    name: "database",
                    extensions: ["sqlite3"]
                }
            ],
            properties: ["createDirectory"]
        });
        return this._cancelToReject(oDialogPromise);
    }
}

export const OpenDatabaseDialog = new _OpenDatabaseDialog();
