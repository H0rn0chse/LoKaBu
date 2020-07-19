import { load } from "../../../assets/load.js";
import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { HeaderItem } from "./HeaderItem.js";

load.css("/renderer/view/header/Header.css");

export class Header extends View {
    constructor () {
        super();
        this.addEvent("click");
    }

    onClick (oEvent) {
        this.handleEvent("click", oEvent);
    }

    render () {
        const oNode = new DomElement("nav")
            .addClass("Header")
            .insertAggregation(this, "headerItems", HeaderItem, this.renderHeaderItem.bind(this))
            .getNode();

        return oNode;
    }

    renderHeaderItem (oChild) {
        oChild.addEventListener("click", this.onClick, this);
    }
};
