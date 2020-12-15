import { Binding } from "../../../core/common/Binding.js";
import { LanguageModel } from "../../model/LanguageModel.js";
import { EventBus } from "../../EventBus.js";

export class Dialog {
    constructor () {
        this.binding = new Binding(LanguageModel, []);
        this._initTranslations();
    }

    getProperty (sProperty) {
        return this.binding.getProperty(sProperty);
    }

    _initTranslations () {
        const oBindings = this._getTranslations();
        this._getDefaultTranslations(oBindings);

        Object.keys(oBindings).forEach(sKey => {
            this.binding.bindProperty(sKey, oBindings[sKey]);
        });
    }

    show (...args) {
        EventBus.sendToCurrentWindow("blockApp");
        return LanguageModel.waitForInit()
            .then(() => {
                return this._show(...args);
            })
            .finally(() => {
                EventBus.sendToCurrentWindow("unblockApp");
            });
    }

    _getTranslations () {
        return {};
    }

    _getDefaultTranslations (oBindings) {
        const oDefaultBindings = {
            "confirm-trans": ["common.confirm"],
            "cancel-trans": ["common.cancel"]
        };
        Object.keys(oDefaultBindings).forEach(sKey => {
            if (!oBindings[sKey]) {
                oBindings[sKey] = oDefaultBindings[sKey];
            }
        });
    }

    _show () {
        // needs to be implemented by the dialog
    }

    /**
     * Returns an array of button texts:
     * Confirm, Cancel
     */
    _getDefaultButtons () {
        return [
            this.getProperty("confirm-trans"),
            this.getProperty("cancel-trans")
        ];
    }

    /**
     * Rejects the promise when it was canceled
     * @param {Promise} oPromise Promise to convert
     * @param {number} iCancel Position of the cancel button
     */
    _cancelToReject (oPromise, iCancel = -1) {
        return oPromise
            .then(oResult => {
                if (oResult.canceled || oResult.response === iCancel) {
                    return Promise.reject(oResult);
                } else {
                    return Promise.resolve(oResult);
                }
            });
    }
};
