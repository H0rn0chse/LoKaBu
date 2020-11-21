import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { loadCss } from "../../common/Utils.js";

loadCss("/renderer/view/tools/ToolsView.css");

export class ToolsView extends View {
    render () {
        const oNode = new DomElement("section")
            .addClass("tools")
            .appendNode(new DomElement("div")
                .setText("Tools inc")
            )
            .getNode();

        return oNode;
    }
};
