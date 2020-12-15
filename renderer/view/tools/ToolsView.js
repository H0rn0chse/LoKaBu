import { DomElement } from "../../../core/view/DomElement.js";
import { loadCss } from "../../../core/common/Utils.js";
import { FlexContainer } from "../../../core/view/FlexContainer.js";
import { ToolsListItem } from "./ToolsListItem.js";
import { MultiView } from "../../../core/view/MultiView.js";
import { DuplicateView } from "./DuplicateView.js";
import { ToolsMainView } from "./ToolsMainView.js";

loadCss("/renderer/view/tools/ToolsView.css");

export class ToolsView extends MultiView {
    constructor (...args) {
        super(...args);

        this.addView("duplicates", DuplicateView);
        this.addView("main", ToolsMainView);
    }

    render () {
        const oMainView = this.getView(this.getProperty("selectedItem"));
        const oNode = new DomElement("section")
            .addClass("tools")
            .appendNode(new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap", height: "100%" })
                .appendNode(new DomElement("div")
                    .addClass("tools-nav")
                    .insertAggregation(this, "items", ToolsListItem)
                )
                .appendNode(new DomElement("div")
                    .addClass("tools-main")
                    .setChildView(oMainView)
                )
            )
            .getNode();

        return oNode;
    }
};
