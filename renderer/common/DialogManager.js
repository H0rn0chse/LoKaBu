import { View } from "../view/common/View.js";
import { DateToFull } from "./DateUtils.js";
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
            .bindProperty("cancel-trans", "lang", ["common.cancel"])
            .bindProperty("openDefault-trans", "lang", ["database.openDefault"])
            .bindProperty("abortText-trans", "lang", ["database.abort"]);
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

    databaseAbort () {
        const oDialogPromise = dialog.showMessageBox({
            type: "warning",
            message: this.getProperty("abortText-trans")
        });
        return this._cancelToReject(oDialogPromise);
    }

    databaseLocked (sMessage) {
        let sText = this.getProperty("locked-trans");
        const sDate = DateToFull(new Date(parseInt(sMessage, 10)));

        if (sText.includes("$")) {
            sText = sText.replace(/\$/g, sDate);
        } else {
            sText += " - " + sDate;
        }

        return dialog.showMessageBox({
            type: "warning",
            message: sText,
            buttons: [
                this.getProperty("cancel-trans"),
                this.getProperty("openDefault-trans"),
                this.getProperty("confirm-trans")
            ]
        })
            .then((oResult) => {
                if (oResult.response === 0) {
                    throw new Error("");
                }
                const bForceOpen = oResult.response === 2;
                return bForceOpen;
            });
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
