import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { BarChart } from "./BarChart.js";
import { loadCss } from "../../common/Utils.js";
import { FlexContainer } from "../common/FlexContainer.js";
import { DropdownItem } from "../common/DropdownItem.js";
import { FilterView } from "../../filter/common/FilterView.js";

loadCss("/renderer/view/Analysis/AnalysisView.css");

export class AnalysisView extends View {
    render () {
        const oNode = new DomElement("section")
            .addClass("analysis")
            .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap", alignItems: "top" })
                .appendNode(new DomElement("div")
                    .addClass("analysis-settings")
                    .appendNode(new DomElement("select")
                        .insertAggregation(this, "groupItems", DropdownItem)
                        .addEventListener("change", this.onGroupChange, this)
                        .setValue(this.getProperty("selectedGroup"))
                    )
                    .appendNode(new DomElement("div")
                        .addClass("analysis-filter")
                        .appendNode(new DomElement("div")
                            .addClass("analysis-filter-scroll")
                            .insertAggregation(this, "filter", FilterView, this.addGenericListenerToChild.bind(this))
                        )
                        .appendNode(new DomElement("div")
                            .setText("+")
                            .addClass("buttonCircle")
                            .addEventListener("click", this.handleEvent.bind(this, "addFilter"))
                        )
                    )
                )
                .appendNode(new DomElement("div")
                    .addClass("analysis-chart")
                    .appendNode(new BarChart()
                        .setData(this.getProperty("data"))
                    )
                )
            )
            .getNode();

        return oNode;
    }

    onGroupChange (oEvent) {
        oEvent.customData = {
            group: oEvent.target.value
        };
        this.handleEvent("groupChange", oEvent);
    }
};
