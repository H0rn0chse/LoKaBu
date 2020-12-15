import { Deferred } from "../../core/common/Deferred.js";
import { EventBus } from "../EventBus.js";
import { LanguageModel } from "../model/LanguageModel.js";
import { PersonModel } from "../model/PersonModel.js";
import { TypeModel } from "../model/TypeModel.js";

class _BulkDialog {
    show () {
        EventBus.sendToMain("openDialog", "renderer/modalDialogs/BulkDialog.html", 400, 200);
        this._getTranslations();
        this._getData();

        const oDeferred = new Deferred();

        EventBus.listenOnce("bulkDialog.result", (oEvent, oData) => {
            if (Object.keys(oData).length === 0) {
                oDeferred.reject();
            } else {
                oDeferred.resolve(oData);
            }
        });

        return oDeferred.promise;
    }

    _getTranslations () {
        const aTranslations = LanguageModel.getNameSpace("bulk.");
        const oTranslations = {};
        aTranslations.forEach(oTrans => {
            oTranslations[oTrans.scriptCode] = oTrans.trans;
        });
        EventBus.sendTo("bulkDialog", "translations", oTranslations);
    }

    _getData () {
        const oData = {
            types: TypeModel.get(["types"]),
            persons: PersonModel.get(["persons"])
        };
        EventBus.sendTo("bulkDialog", "data", oData);
    }
}

export const BulkDialog = new _BulkDialog();
