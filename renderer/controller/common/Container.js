import { DomElement } from "../../view/common/DomElement.js";
import { loadCss } from "../../common/Utils.js";

loadCss("/renderer/controller/common/Container.css");

export class Container {
    constructor (oRoot) {
        this.node = new DomElement("div")
            .addClass("container")
            .appendToParent(oRoot)
            .getNode();
        this.content = null;
        this.visibility = true;
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

    setVisibilty (bVisible) {
        if (bVisible !== undefined) {
            this.visibility = bVisible;
        } else {
            bVisible = this.visibilty;
        }

        if (this.node !== undefined) {
            this.node.style.display = bVisible ? "" : "none";
        }
        return this;
    }
};
