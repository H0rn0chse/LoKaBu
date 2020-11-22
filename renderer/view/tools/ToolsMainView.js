import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";

export class ToolsMainView extends View {
    constructor () {
        super();
        this.name = "ToolsMainView";
    }

    render () {
        const oNode = new DomElement("div")
            .addClass("tools-main-view")
            .setText(this.getTranslation("description-i18n"))
            .getNode();

        return oNode;
    }
};
