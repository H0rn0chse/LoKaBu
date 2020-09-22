import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { BarChart } from "./BarChart.js";
import { loadCss } from "../../common/Utils.js";
import { FlexContainer } from "../common/FlexContainer.js";
import { DropdownItem } from "../common/DropdownItem.js";

loadCss("/renderer/view/Analysis/AnalysisView.css");

export class AnalysisView extends View {
    render () {
        const oNode = new DomElement("section")
            .addClass("analysis")
            .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap", alignItems: "top" })
                .appendNode(new DomElement("div")
                    .addClass("analysis-settings")
                    .appendNode(new DomElement("select")
                        .insertAggregation(this, "chartTypes", DropdownItem)
                        .addEventListener("change", this.onTypeChange, this)
                    )
                    .appendNode(new DomElement("p")
                        .addClass("analysis-filter")
                        .setText("analysis-filter")
                    )
                )
                .appendNode(new DomElement("div")
                    .addClass("analysis-chart")
                    .appendNode(new BarChart())
                )
            )
            .getNode();

        return oNode;
    }

    onTypeChange (oEvent) {
        this.handleEvent("typeChange", oEvent);
    }
};
