import { DomElement } from "./DomElement.js";
import { load } from "../../../assets/load.js";

load.css("/renderer/view/common/FlexContainer.css");

export class FlexContainer extends DomElement {
    constructor (sTag, oFlex) {
        super(sTag);

        this.addClass("flexContainer");
        Object.keys(oFlex).forEach(sKey => {
            this.getNode().style[sKey] = oFlex[sKey];
        });
    }

    appendNode (oNode) {
        oNode.addClass("flexItem");
        super.appendNode(oNode);
        return this;
    }

    createItem (sTag) {
        const oItem = new DomElement(sTag)
            .addClass("flexItem");
        this.appendNode(oItem);
        return oItem;
    }
};
