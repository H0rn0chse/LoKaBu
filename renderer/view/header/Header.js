import { load } from "../../../assets/load.js";
import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { HeaderItem } from "./HeaderItem.js";

load.css("/renderer/view/header/Header.css");

export class Header extends View {
    constructor () {
        super();
        this.hasChildren = true;
    }

    render () {
        const oNode = new DomElement("nav")
            .addClass("Header");

        const oDomRef = oNode.getNode();

        this.renderAggregation("headerItems", oDomRef, HeaderItem);

        return oDomRef;
    }

    renderAggregation (sAggregation, oDomRef, Constructor) {
        const aItems = this.getAggregation(sAggregation);
        const oBinding = this.getAggregationBinding(sAggregation);

        aItems.forEach((oItem, iIndex) => {
            const oChild = new Constructor();
            oChild.setModels(this.getModels());
            oChild.setBindings(oBinding);
            oChild.setBindingContext(oBinding, iIndex);
            oChild.setParent(oDomRef);
            oChild.update();
        });
    }
};
