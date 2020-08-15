import { Dialog } from "../common/Dialog.js";

const { dialog } = require('electron').remote;

class _CreateDatabaseDialog extends Dialog {
    _show () {
        const oDialogPromise = dialog.showSaveDialog({
            filters: [
                {
                    name: "database",
                    extensions: ["sqlite3"]
                }
            ],
            properties: ["openFile"]
        });
        return this._cancelToReject(oDialogPromise);
    }
}

export const CreateDatabaseDialog = new _CreateDatabaseDialog();
