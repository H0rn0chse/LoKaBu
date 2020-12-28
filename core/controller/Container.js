import { DomElement } from "../view/DomElement.js";
import { loadCss } from "../common/Utils.js";

loadCss("/core/controller/Container.css");

export class Container {
    constructor (oRoot, sId = "container") {
        this.node = new DomElement("div")
            .setId(sId)
            .addClass("container")
            .appendToParent(oRoot)
            .getNode();
        this.content = null;
        this.visibility = true;
    }

    setContent (oContent) {
        this.content = oContent;
        return this;
    }

    getContent () {
        return this.content;
    }

    getNode () {
        return this.node;
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
