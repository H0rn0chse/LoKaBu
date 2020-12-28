import { Component } from "./Component.js";
import { DomElement } from "./DomElement.js";

export class Node extends Component {
    constructor (oAttributes) {
        super(oAttributes);

        this.properties = ["childNodes", "type", "class", "value", "text"];
        this.events = ["change"];
        this.element = null;
    }

    render () {
        if (!this.element) {
            this.element = new DomElement("div");
        }
        this.element.appendToParent(this.getParentDomRef());
        //this.node.remove();
        // TODO how to handle rerendering
    }

    setChildNodes (value) {

    }

    setType (value) {

    }

    setClass (value) {
        this.element.addClass(value);
    }

    setValue (value) {

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
