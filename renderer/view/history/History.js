import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { FlexContainer } from "../common/FlexContainer.js";
import { SortBarItem } from "./SortBarItem.js";
import { HistoryLineItem } from "./HistoryLineItem.js";

export class History extends View {
    constructor () {
        super();
        this.addEvents([
            "navBefore",
            "navNext"
        ]);
    }

    render () {
        const oNode = new DomElement("section")
            .addClass("history")
            .appendNode(new DomElement("div")
                .setText("FilterBox")
            )
            .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
                .insertAggregation(this, "sort", SortBarItem, this.addGenericListenerToChild.bind(this))
            )
            .appendNode(new FlexContainer("div", { flexDirection: "column", flexWrap: "nowrap" })
                .insertAggregation(this, "entries", HistoryLineItem, this.addGenericListenerToChild.bind(this))
            )
            .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
                .appendNode(new DomElement("div")
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
                    .setText(">")
                    .addEventListener("click", this.handleEvent.bind(this, "navNext"))
                )
            )
            .getNode();

        return oNode;
    }
};
