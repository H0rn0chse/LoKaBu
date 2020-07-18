export class DomElement {
    constructor (sTag) {
        this.node = document.createElement(sTag);
        return this;
    }

    addClass (sClass) {
        this.node.classList.add(sClass);
        return this;
    }

    appendNode (oNode) {
        this.node.appendChild(oNode.getNode());
        return this;
    }

    appendToParent (oParent) {
        oParent.appendChild(this.node);
        return this;
    }

    getNode () {
        return this.node;
    }

    setData (sKey, sValue) {
        this.node.setAttribute(`data-${sKey}`, sValue);
        return this;
    }

    setEventHandler (sEventName, fnHandler) {
        this.node.addEventListener("click", fnHandler);
        return this;
    }

    setText (sText) {
        this.node.innerText = sText;
        return this;
    }
};
