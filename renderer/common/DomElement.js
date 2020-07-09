export class DomElement {
    constructor (sTag) {
        this.node = document.createElement(sTag);
        return this;
    }

    setText (sText) {
        this.node.innerText = sText;
        return this;
    }

    setData (sKey, sValue) {
        this.node.setAttribute(`data-${sKey}`, sValue);
        return this;
    }

    getNode () {
        return this.node;
    }

    addClass (sClass) {
        this.node.classList.add(sClass);
        return this;
    }

    appendNode (oNode) {
        this.node.appendChild(oNode.getNode());
        return this;
    }
};
