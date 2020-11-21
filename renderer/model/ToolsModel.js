/* eslint-disable quote-props */
import { deepEqual } from "../common/Utils.js";
import { EventBus } from "../EventBus.js";
import { Model } from "./common/Model.js";

class _ToolsModel extends Model {
    constructor (oData) {
        super(oData);
        this.name = "ToolsModel";
    }

    get (aPath, aBindingContextPath) {
        if (deepEqual(aPath, ["selectedItem"])) {
            return this.getSelectedItem();
        }
        return super.get(aPath, aBindingContextPath);
    }

    findDuplicates () {
        EventBus.sendToDatabase("receiptList-duplicates");
        EventBus.listenOnce("receiptList-duplicates", (oEvent, aData) => {
            if (Array.isArray(aData)) {
                this.set(["duplicates"], aData);
            }
        });
    }

    setSelectedItem (sItem) {
        this.get(["items"]).forEach(oItem => {
            oItem.selected = oItem.id === sItem;
        });
        this.update();
    }

    getSelectedItem () {
        const oItem = this.get(["items"]).find(oItem => {
            return oItem.selected;
        });
        return oItem.id;
    }
}

export const ToolsModel = new _ToolsModel({
    duplicates: [],
    items: [
        {
            id: "main",
            text: "Main",
            selected: true
        },
        {
            id: "duplicates",
            text: "Duplicates",
            selected: false
        }
    ],
    "description-i18n": ["tools.main.description"]
});
