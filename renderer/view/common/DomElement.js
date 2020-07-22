let guid = 1;
export class DomElement {
    constructor (sTag, oInlineStyles = {}) {
        this.node = document.createElement(sTag);

        Object.keys(oInlineStyles).forEach(sKey => {
            this.node.style[sKey] = oInlineStyles[sKey];
        });
        return this;
    }

    addClass (sClass) {
        if (sClass !== "" && sClass !== undefined) {
            this.node.classList.add(sClass);
        }
        return this;
    }

    addEventHandler (sEventName, fnHandler, oScope) {
        const fnBoundHandler = oScope ? fnHandler.bind(oScope) : fnHandler;

        this.node.addEventListener(sEventName, fnBoundHandler);
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

    createGuid () {
        guid += 1;
        return guid;
    }

    getNode () {
        return this.node;
    }

    insertAggregation (oView, ...args) {
        oView.renderAggregation(this.getNode(), ...args);
        return this;
    }

    setChildView (oView) {
        oView.setParent(this.getNode());
        return this;
    }

    setData (sKey, sValue) {
        this.node.setAttribute(`data-${sKey}`, sValue);
        return this;
    }

    setDisabled () {
        this.node.setAttribute('disabled', "");
        return this;
    }

    setId (sId) {
        this.node.id = `${sId}-${this.createGuid()}`;
        return this;
    }

    setRows (iRow) {
        this.node.setAttribute('rows', iRow);
        return this;
    }

    setText (sText) {
        // make spaces non-breakable
        sText = sText.replace(/ /g, '\xa0');
        this.node.innerText = sText;
        return this;
    }

    setType (sType) {
        this.node.setAttribute('type', sType);
        return this;
    }

    setValue (sValue) {
        this.node.value = sValue;
        return this;
    }
};
