import { View } from "../../../core/view/View.js";
import { DomElement } from "../../../core/view/DomElement.js";
import { HeaderItem } from "./HeaderItem.js";
import { loadCss } from "../../../core/common/Utils.js";

loadCss("/renderer/view/header/Header.css");

export class HeaderView extends View {
    constructor (...args) {
        super(...args);
        this.name = "HeaderView";
    }

    render () {
        const oNode = new DomElement("nav")
            .addClass("Header")
            .insertAggregation(this, "headerItems", HeaderItem)
            .getNode();

        return oNode;
    }
};
