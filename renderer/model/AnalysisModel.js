import { Model } from "./common/Model.js";

class _AnalysisModel extends Model {
    constructor (...args) {
        super(...args);
        this.name = "AnalysisModel";
    }
}

export const AnalysisModel = new _AnalysisModel({
    types: [{
        id: "line",
        i18n: ["analysis.chart.line"]
    }, {
        id: "bar",
        i18n: ["analysis.chart.bar"]
    }]
});
