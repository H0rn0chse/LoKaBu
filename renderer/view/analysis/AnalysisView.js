import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";

export class AnalysisView extends View {
    render () {
        const oNode = new DomElement("section")
            .addClass("analysis")
            .appendNode(new DomElement("p")
                .setText("analysis-section"))
            .getNode();

        return oNode;
    }
};
