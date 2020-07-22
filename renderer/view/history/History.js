import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { FlexContainer } from "../common/FlexContainer.js";
import { SortBarItem } from "./SortBarItem.js";
import { HistoryLineItem } from "./HistoryLineItem.js";

export class History extends View {
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
            .getNode();

        return oNode;
    }
};
