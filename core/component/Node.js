import { Deferred } from "../common/Deferred.js";
import { Component } from "./Component.js";
import { DomElement } from "../view/DomElement.js";

export class Node extends Component {
    constructor (oAttributes) {
        super(oAttributes);
        this.name = "Node";

        this.properties = [
            "childNodes",
            "childTemplate",
            "type",
            "class",
            "value",
            "text"
        ];
        this.events = ["click", "change"];
        this.element = null;
        this.observerPromise = new Deferred();
    }

    render () {
        if (!this.element) {
            const sTag = this.attributes.type || "div";
            this.element = new DomElement(sTag);
            this.element.appendToParent(this.getParentDomRef());

            this.observerPromise.resolve(this.element.getNode());
        }
        this.status.push("rendered");
    }

    async getObserverTarget () {
        return this.observerPromise.promise;
    }

    attachClick (oHandler) {
        if (!oHandler.isBound) {
            oHandler.bindProperties(this);
        }
        this.attachEventHandler("click", oHandler, this.element);
    }

    attachChange (oHandler) {
        if (!oHandler.isBound) {
            oHandler.bindProperties(this);
        }
        this.attachEventHandler("change", oHandler, this.element);
    }

    async setChildNodes (aItems, iIndex) {
        if (iIndex !== undefined) {
            this.removeItem("childNodes", iIndex);
        }
        await this.defaultItemFactory(aItems, "childNodes", this.childTemplate);
        this.afterChildUpdate();
    }

    afterChildUpdate () {
        // This can be overwritten for parent access to its childs
    }

    setType (value) {
        // the tag type is set during initial rendering and should not be changed afterwards
    }

    setClass (value) {
        this.element.addClass(value);
    }

    setValue (value) {
        this.element.setValue(value);
    }

    setText (value) {
        this.element.setText(value);
    }

    getDomRef () {
        return this.element.getNode();
    }

    destroy () {
        this.element.destroy();
        super.destroy();
    }
}
