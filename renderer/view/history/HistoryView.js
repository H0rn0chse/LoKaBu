import { View } from "../../../core/view/View.js";
import { DomElement } from "../../../core/view/DomElement.js";
import { FlexContainer } from "../../../core/view/FlexContainer.js";
import { SortBarItem } from "./SortBarItem.js";
import { HistoryLineItem } from "./HistoryLineItem.js";
import { FilterView } from "../../filter/common/FilterView.js";
import { loadCss } from "../../../core/common/Utils.js";
import { Icon } from "../../../core/view/Icon.js";

loadCss("/renderer/view/history/HistoryView.css");
export class HistoryView extends View {
    constructor () {
        super();
        this.name = "HistoryView";
    }

    render () {
        const oNode = new DomElement("section")
            .addClass("history")
            .appendNode(new DomElement("div")
                .addClass("history-filter")
                .appendNode(new DomElement("div")
                    .addClass("history-filter-scroll")
                    .insertAggregation(this, "filter", FilterView)
                )
                .appendNode(new Icon("plus-circle")
                    .addClass("cursorPointer")
                    .addEventListener("click", this.handleEvent.bind(this, "addFilter"))
                )
            )
            .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
                .addClass("history-sort")
                .insertAggregation(this, "sort", SortBarItem)
            )
            .appendNode(new FlexContainer("div", { flexDirection: "column", flexWrap: "nowrap" })
                .addClass("history-lines")
                .insertAggregation(this, "entries", HistoryLineItem)
            )
            .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap", alignItems: "center" })
                .appendNode(new Icon("chevron-left", { size: 36 })
                    .addClass("cursorPointer")
                    .addEventListener("click", this.handleEvent.bind(this, "navBefore"))
                )
                .appendNode(new DomElement("div")
                    .setText(this.getProperty("currentPage"))
                )
                .appendNode(new DomElement("div")
                    .setText("/")
                )
                .appendNode(new DomElement("div")
                    .setText(this.getProperty("pageCount"))
                )
                .appendNode(new Icon("chevron-right", { size: 36 })
                    .addClass("cursorPointer")
                    .addEventListener("click", this.handleEvent.bind(this, "navNext"))
                )
            )
            .getNode();

        return oNode;
    }
};
