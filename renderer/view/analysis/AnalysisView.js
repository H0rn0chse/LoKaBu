import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { BarChart } from "./BarChart.js";

export class AnalysisView extends View {
    render () {
        const oNode = new DomElement("section")
            .addClass("analysis")
            .appendNode(new BarChart())
            .getNode();

        return oNode;
    }
};
