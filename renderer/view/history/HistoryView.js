import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { FlexContainer } from "../common/FlexContainer.js";
import { SortBarItem } from "./SortBarItem.js";
import { HistoryLineItem } from "./HistoryLineItem.js";
import { FilterView } from "../../filter/common/FilterView.js";

export class HistoryView extends View {
    constructor () {
        super();
        this.name = "HistoryView";

        this.addEvents([
            "navBefore",
            "navNext",
            "addFilter"
        ]);
    }

    render () {
        const oNode = new DomElement("section")
            .addClass("history")
            .insertAggregation(this, "filter", FilterView, this.addGenericListenerToChild.bind(this))
            .appendNode(new DomElement("div")
                .setText("+")
                .addClass("buttonCircle")
                .addEventListener("click", this.handleEvent.bind(this, "addFilter"))
            )
            .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
                .insertAggregation(this, "sort", SortBarItem, this.addGenericListenerToChild.bind(this))
            )
            .appendNode(new FlexContainer("div", { flexDirection: "column", flexWrap: "nowrap" })
                .insertAggregation(this, "entries", HistoryLineItem, this.addGenericListenerToChild.bind(this))
            )
            .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap", alignItems: "center" })
                .appendNode(new DomElement("div")
                    .addClass("button")
                    .setText("<")
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
                .appendNode(new DomElement("div")
                    .addClass("button")
                    .setText(">")
                    .addEventListener("click", this.handleEvent.bind(this, "navNext"))
                )
            )
            .getNode();

        return oNode;
    }
};
