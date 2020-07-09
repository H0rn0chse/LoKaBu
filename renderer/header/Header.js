import { load } from "../../assets/load.js";
import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { HeaderItem } from "./HeaderItem.js";

load.css("/renderer/header/Header.css");

export class Header extends View {
    constructor () {
        super();
        this.hasChildren = true;
    }

    render () {
        const oNode = new DomElement("nav")
            .addClass("Header");

        const oDomRef = oNode.getNode();

        this.renderAggregation("headerItems", oDomRef);

        return oDomRef;
    }

    renderAggregation (sAggregation, oDomRef) {
        const aItems = this.getAggregation(sAggregation);
        const oBinding = this.getAggregationBinding(sAggregation);

        aItems.forEach((oItem, iIndex) => {
            const oHeaderItem = new HeaderItem();
            oHeaderItem.setModels(this.getModels());
            oHeaderItem.setBindings(oBinding.getPropertyBindings());
            oHeaderItem.setBindingContext(oBinding.path, iIndex);
            oHeaderItem.setParent(oDomRef);
            oHeaderItem.update();
        });
    }
};
