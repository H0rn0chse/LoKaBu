import { EventBus } from "../EventBus.js";
import { DatabaseModel } from "./common/DatabaseModel.js";
import { ReceiptAnalysisFilter } from "../filter/ReceiptAnalysisFilter.js";
import { AccountModel } from "./AccountModel.js";
import { StoreModel } from "./StoreModel.js";
import { TypeModel } from "./TypeModel.js";
import { PersonModel } from "./PersonModel.js";

class _AnalysisModel extends DatabaseModel {
    constructor (oData) {
        super(oData, "receiptAnalysis");
        this.name = "AnalysisModel";
    }

    addFilter () {
        this.push(["filter"], new ReceiptAnalysisFilter());
    }

    deleteFilter (iId) {
        const aFilter = this.get(["filter"]);
        aFilter.splice(iId, 1);
        this.set(["filter"], aFilter);
    }

    setFilterColumn (iFilter, iColumn) {
        this.set(["filter", iFilter, "value"], iColumn);
    }

    setGroup (iId) {
        const oModel = this.get(["selectedGroup", iId, "model"]);

        this.set(["selectedGroup"], iId, true);
        this.set(["selectedModel"], oModel);
    }

    _getCurrentFilter () {
        return this.get(["filter"]).map(oFilter => {
            return oFilter.export();
        });
    }

    _getCurrentGroup () {
        const sId = this.get(["selectedGroup"]);
        return this.get(["group", sId]);
    }

    read () {
        const aArgs = [
            this._getCurrentFilter(),
            this._getCurrentGroup().column
        ];
        EventBus.sendToDatabase("receiptAnalysis-read", ...aArgs);
    }

    processRead (oEvent, oResult) {
        const aDatasets = [];
        const aData = oResult.data || [];

        const oGroup = this._getCurrentGroup();
        const oModel = oGroup.model;
        const aPath = oGroup.path;

        const aKeys = [...new Set(aData.map(oItem => {
            return oItem.GroupValue;
        }))];

        aKeys.forEach(iKey => {
            const sLabel = oModel.get([...aPath, { ID: iKey }, "DisplayName"]);

            const aSetData = aData.filter(oItem => {
                return oItem.GroupValue === iKey;
            }).map(oItem => {
                return {
                    x: new Date(oItem.Date).getTime(),
                    y: (oItem.Value / 100).toFixed(2)
                };
            });

            aDatasets.push({
                label: sLabel,
                data: aSetData
            });
        });

        this.set(["data"], aDatasets);
        console.log("AnalysisModel loaded");
    }
}

export const AnalysisModel = new _AnalysisModel({
    "group-i18n": ["analysis.grouping"],
    filter: [],
    group: [{
        id: 0,
        column: "SourceAccount",
        i18n: ["common.account"],
        model: AccountModel,
        path: ["accounts"]
    }, {
        id: 1,
        column: "TargetAccount",
        i18n: ["common.account.transfer"],
        model: AccountModel,
        path: ["accounts"]
    }, {
        id: 2,
        column: "Store",
        i18n: ["common.store"],
        model: StoreModel,
        path: ["stores"]
    }, {
        id: 3,
        column: "Type",
        i18n: ["common.billingType"],
        model: TypeModel,
        path: ["types"]
    }, {
        id: 4,
        column: "Person",
        i18n: ["common.billingAccount"],
        model: PersonModel,
        path: ["persons"]
    }],
    selectedGroup: 3,
    data: []
});
