import { View } from "../view/common/View.js";
const { dialog } = require('electron').remote;

class _DialogManager extends View {
    constructor (...args) {
        super(...args);

        this._initTranslations();
    }

    _initTranslations () {
        this
            .bindProperty("locked-trans", "lang", ["database.locked"])
            .bindProperty("confirm-trans", "lang", ["common.confirm"])
            .bindProperty("openDefault-trans", "lang", ["database.openDefault"])
            .bindProperty("abort-trans", "lang", ["database.abort"]);
    }

    createDatabase () {
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

    openDatabase () {
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

    _cancelToReject (oPromise) {
        return new Promise((resolve, reject) => {
            oPromise.then(oResult => {
                if (oResult.canceled) {
                    reject(oResult);
                } else {
                    resolve(oResult);
                }
            });
        });
    }
}

export const DialogManager = new _DialogManager();
