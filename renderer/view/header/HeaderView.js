import { load } from "../../common/Load.js";
import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { HeaderItem } from "./HeaderItem.js";

load.css("/renderer/view/header/Header.css");

export class HeaderView extends View {
    constructor (...args) {
        super(...args);
        this.name = "HeaderView";
    }

    render () {
        const oNode = new DomElement("nav")
            .addClass("Header")
            .insertAggregation(this, "headerItems", HeaderItem, this.addGenericListenerToChild.bind(this))
            .getNode();

        return oNode;
    }
};
