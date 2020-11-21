import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { FlexContainer } from "../common/FlexContainer.js";

export class DuplicateView extends View {
    constructor () {
        super();
        this.name = "DuplicateView";
    }

    render () {
        const oNode = new FlexContainer("div", { flexDirection: "row", flexWrap: "nowrap" })
            .addClass("duplicate-view")
            .setText("Duplicate View")
            .getNode();

        return oNode;
    }
};
