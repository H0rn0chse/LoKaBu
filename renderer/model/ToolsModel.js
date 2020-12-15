/* eslint-disable quote-props */
import { UnixToDate, DateToDateString } from "../../core/common/DateUtils.js";
import { deepEqual, removeDuplicates } from "../../core/common/Utils.js";
import { EventBus } from "../EventBus.js";
import { Model } from "../../core/model/Model.js";

class _ToolsModel extends Model {
    constructor (oData) {
        super(oData);
        this.name = "ToolsModel";
        window[this.name] = this;

        EventBus.listen("receipt-summary", this.processReceiptRead, this);
    }

    processReceiptRead (oEvent, oData) {
        const aList = this.getSelectedItem(["duplicates"]).list;
        const aItems = this.get(["duplicateData"]).filter(oItem => {
            return oItem.id === oData.ID;
        });
        if (!aItems.length && aList.includes(oData.ID)) {
            oData.Lines = JSON.parse(oData.Lines).map(iValue => {
                return (iValue / 100).toFixed(2);
            });
            oData.ReceiptSum = (oData.ReceiptSum / 100).toFixed(2);
            oData.Date = DateToDateString(UnixToDate(oData.Date));
            this.push(["duplicateData"], oData);
        }
    }

    get (aPath, aBindingContextPath) {
        if (deepEqual(aPath, ["selectedItem"])) {
            const oItem = this.getSelectedItem(["items"]);
            return oItem && oItem.id;
        }
        if (deepEqual(aPath, ["selectedDuplicate"])) {
            const oItem = this.getSelectedItem(["duplicates"]);
            return oItem && oItem.id;
        }
        return super.get(aPath, aBindingContextPath);
    }

    findDuplicates () {
        EventBus.sendToCurrentWindow("busy-start");
        EventBus.sendToDatabase("receiptList-duplicates");

        EventBus.listenOnce("receiptList-duplicates", (oEvent, aData) => {
            EventBus.sendToCurrentWindow("busy-stop");
            if (Array.isArray(aData)) {
                aData.forEach((oItem, iIndex) => {
                    oItem.list = oItem.ID;
                    delete oItem.ID;
                    oItem.id = `Item ${iIndex + 1}`;
                    oItem.selected = false;
                });
                this.set(["duplicates"], aData);
                this.set(["duplicateData"], []);
            }
        });
    }

    setSelected (aPath, sId) {
        this.get(aPath).forEach(oItem => {
            oItem.selected = oItem.id === sId;
        });
    }

    setSelectedItem (sItem) {
        this.setSelected(["items"], sItem);
        this.update();
    }

    setSelectedDuplicate (sItem) {
        this.setSelected(["duplicates"], sItem);
        this.set(["duplicateData"], [], true);
        const aList = this.getSelectedItem(["duplicates"]).list;
        aList.forEach(sId => {
            EventBus.sendToDatabase("receipt-summary", sId);
        });
        this.update();
    }

    getSelectedItem (aPath) {
        const oItem = this.get(aPath).find(oItem => {
            return oItem.selected;
        });
        return oItem;
    }

    deleteReceipt (iId) {
        let oEntry = {
            Receipt: iId
        };
        EventBus.sendToDatabase("lines-delete", oEntry);
        oEntry = {
            ID: iId
        };
        EventBus.sendToDatabase("receipts-delete", oEntry);

        const aList = this.get(["duplicateData"]).filter(oItem => {
            return oItem.ID !== iId;
        });

        const oSelectedItem = this.getSelectedItem(["duplicates"]);

        if (aList.length === 1) {
            // The last duplicate receipt was deleted
            const aDuplicates = this.get(["duplicates"]).filter(oItem => {
                return oItem !== oSelectedItem;
            });

            // reset duplicateData and remove duplicateEntry
            this.set(["duplicateData"], [], true);
            this.set(["duplicates"], aDuplicates, true);
        } else {
            const aIds = aList.map(oItem => {
                return oItem.ID;
            });
            this.set(["duplicates", { id: oSelectedItem.id }, "list"], aIds, true);
            this.set(["duplicateData"], aList, true);
        }
        this.update();
    }

    confirmDuplicate () {
        const aList = this.get(["duplicateData"]).map(oItem => {
            return oItem.ID;
        });
        this.get(["duplicateData"]).forEach(oItemData => {
            let aFilteredList = aList.filter(iHintId => {
                return iHintId !== oItemData.ID;
            });
            aFilteredList = removeDuplicates(JSON.parse(oItemData.DuplicateHint).concat(aFilteredList));

            const oItem = {
                ID: oItemData.ID,
                DuplicateHint: JSON.stringify(aFilteredList)
            };

            EventBus.sendToDatabase("receipts-update", oItem);
        });

        const oSelectedItem = this.getSelectedItem(["duplicates"]);
        const aDuplicates = this.get(["duplicates"]).filter(oItem => {
            return oItem !== oSelectedItem;
        });

        // reset duplicateData and remove duplicateEntry
        this.set(["duplicateData"], [], true);
        this.set(["duplicates"], aDuplicates, true);
        this.update();
    }
}

export const ToolsModel = new _ToolsModel({
    duplicates: [],
    duplicateData: [],
    items: [
        {
            id: "main",
            i18n: ["tools.items.main"],
            selected: true
        },
        {
            id: "duplicates",
            i18n: ["tools.items.duplicates"],
            selected: false
        }
    ],
    "description-i18n": ["tools.main.description"],
    "findDuplicates-i18n": ["tools.duplicates.find"],
    "confirm-i18n": ["tools.duplicates.confirm"],
    "confirmMessage-i18n": ["tools.duplicates.confirmMessage"],
    "hint-i18n": ["tools.duplicates.hint"]
});
