/* eslint-disable quote-props */
import { EventBus } from "../EventBus.js";
import { Model } from "./common/Model.js";

class _ToolsModel extends Model {
    constructor (oData) {
        super(oData);
        this.name = "ToolsModel";
    }

    findDuplicates () {
        EventBus.sendToDatabase("receiptList-duplicates");
        EventBus.listenOnce("receiptList-duplicates", (oEvent, aData) => {
            if (Array.isArray(aData)) {
                this.set(["duplicates"], aData);
            }
        });
    }
}

export const ToolsModel = new _ToolsModel({
    duplicates: []
});
