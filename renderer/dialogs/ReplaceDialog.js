import { Deferred } from "../../core/common/Deferred.js";
import { EventBus } from "../EventBus.js";
import { LanguageModel } from "../model/LanguageModel.js";

class _ReplaceDialog {
    show (oModel, vId) {
        EventBus.sendToMain("openDialog", "renderer/modalDialogs/ReplaceDialog.html", 400, 300);
        this._getTranslations();
        this._getData(oModel, vId);

        const oDeferred = new Deferred();

        EventBus.listenOnce("replaceDialog.result", (oEvent, oData) => {
            if (Object.keys(oData).length === 0) {
                oDeferred.reject();
            } else {
                oDeferred.resolve(oData);
            }
        });

        return oDeferred.promise;
    }

    _getTranslations () {
        const aTranslations = LanguageModel.getNameSpace("replace.");
        const oTranslations = {};
        aTranslations.forEach(oTrans => {
            oTranslations[oTrans.scriptCode] = oTrans.trans;
        });
        EventBus.sendTo("replaceDialog", "translations", oTranslations);
    }

    _getData (oModel, vId) {
        const oData = {
            list: oModel.getEntries(),
            id: vId
        };
        EventBus.sendTo("replaceDialog", "data", oData);
    }
}

export const ReplaceDialog = new _ReplaceDialog();
