import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { FlexContainer } from "../common/FlexContainer.js";
import { SortBarItem } from "./SortBarItem.js";
import { HistoryLineItem } from "./HistoryLineItem.js";
import { FilterView } from "../../filter/common/FilterView.js";
import { loadCss } from "../../common/Utils.js";
import { Icon } from "../common/Icon.js";

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
                    .insertAggregation(this, "filter", FilterView, this.addGenericListenerToChild.bind(this))
                )
                .appendNode(new Icon("plus-circle")
                    .addClass("cursorPointer")
                    .addEventListener("click", this.handleEvent.bind(this, "addFilter"))
                )
            )
            .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
                .addClass("history-sort")
                .insertAggregation(this, "sort", SortBarItem, this.addGenericListenerToChild.bind(this))
            )
            .appendNode(new FlexContainer("div", { flexDirection: "column", flexWrap: "nowrap" })
                .addClass("history-lines")
                .insertAggregation(this, "entries", HistoryLineItem, this.addGenericListenerToChild.bind(this))
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
