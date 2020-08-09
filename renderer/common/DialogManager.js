import { View } from "../view/common/View.js";
import { DateToFull } from "./DateUtils.js";
import { Deferred } from "./Deferred.js";
import { LanguageModel } from "../model/LanguageModel.js";
import { EventBus } from "../EventBus.js";
const { dialog } = require('electron').remote;

class _DialogManager extends View {
    constructor (...args) {
        super(...args);

        this._initTranslations();
        this.Model = new Deferred();
        LanguageModel.addEventListener("update", this.Model.resolve);
    }

    getProperty (...args) {
        return super.getProperty(...args) || "";
    }

    _initTranslations () {
        const oBindings = {
            "locked-trans": ["database.locked"],
            "confirm-trans": ["common.confirm"],
            "cancel-trans": ["common.cancel"],
            "openDefault-trans": ["database.openDefault"],
            "abortText-trans": ["database.abort"],
            "migrationUpgrade-trans": ["migration.upgrade"],
            "dialogConfirm-trans": ["dialog.confirm"]
        };
        Object.keys(oBindings).forEach(sKey => {
            this.bindProperty(sKey, "lang", oBindings[sKey]);
        });
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
        return dialog.showMessageBox({
            type: "warning",
            message: this.getProperty("abortText-trans")
        });
    }

    databaseLocked (sMessage) {
        let sText = this.getProperty("locked-trans");
        const sDate = DateToFull(new Date(parseInt(sMessage, 10)));

        if (sText.includes("$")) {
            sText = sText.replace(/\$/g, sDate);
        } else {
            sText += " - " + sDate;
        }

        const oDialogPromise = dialog.showMessageBox({
            type: "warning",
            message: sText,
            buttons: [
                this.getProperty("confirm-trans"),
                this.getProperty("openDefault-trans"),
                this.getProperty("cancel-trans")
            ],
            cancelId: 2
        });
        return this._cancelToReject(oDialogPromise, 2)
            .then((oResult) => {
                const bForceOpen = oResult.response === 2;
                return bForceOpen;
            });
    }

    migrationUpgrade (sAppVersion, sSourceVersion, sTargetVersion) {
        EventBus.sendToCurrentWindow("blockApp");
        return this.Model.promise
            .then(() => {
                let sText = this.getProperty("migrationUpgrade-trans");

                sText = sText
                    .replace(/\$AppVersion/g, sAppVersion)
                    .replace(/\$SourceVersion/g, sSourceVersion)
                    .replace(/\$TargetVersion/g, sTargetVersion);

                const oDialogPromise = dialog.showMessageBox({
                    type: "error",
                    message: sText,
                    buttons: this._getDefaultButtons(),
                    cancelId: 1
                });
                return this._cancelToReject(oDialogPromise, 1)
                    .then(this.confirm.bind(this));
            })
            .then(() => {
                EventBus.sendToCurrentWindow("unblockApp");
            });
    }

    confirm () {
        const oDialogPromise = dialog.showMessageBox({
            type: "warning",
            message: this.getProperty("dialogConfirm-trans"),
            buttons: this._getDefaultButtons(),
            cancelId: 1
        });
        return this._cancelToReject(oDialogPromise, 1);
    }

    _getDefaultButtons () {
        return [
            this.getProperty("confirm-trans"),
            this.getProperty("cancel-trans")
        ];
    }

    _cancelToReject (oPromise, iCancel = -1) {
        return new Promise((resolve, reject) => {
            oPromise.then(oResult => {
                if (oResult.canceled || oResult.response === iCancel) {
                    reject(oResult);
                } else {
                    resolve(oResult);
                }
            });
        });
    }
}

export const DialogManager = new _DialogManager();
