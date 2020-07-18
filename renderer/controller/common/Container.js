import { load } from "../../../assets/load.js";
import { DomElement } from "../../view/common/DomElement.js";

load.css("/renderer/controller/common/Container.css");

export class Container {
    constructor (oRoot) {
        this.node = new DomElement("div")
            .addClass("container")
            .appendToParent(oRoot)
            .getNode();
        this.content = null;
    }

    getContent () {
        return this.content;
    }

    getNode () {
        return this.node;
    }

    setContent (oContent) {
        this.content = oContent;
        return this;
    }
};
