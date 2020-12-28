let guid = 1;
export class DomElement {
    constructor (sTag, oInlineStyles = {}) {
        this.node = document.createElement(sTag);

        Object.keys(oInlineStyles).forEach(sKey => {
            this.node.style[sKey] = oInlineStyles[sKey];
        });
        this.addClass("unselectable");
        return this;
    }

    addClass (sClass) {
        if (sClass !== "" && sClass !== undefined) {
            this.node.classList.add(sClass);
        }
        return this;
    }

    setSelectable (bValue) {
        if (bValue) {
            this.addClass("selectable");
            this.removeClass("unselectable");
        } else {
            this.addClass("unselectable");
            this.removeClass("selectable");
        }
        return this;
    }

    removeClass (sClass) {
        if (sClass !== "" && sClass !== undefined) {
            this.node.classList.remove(sClass);
        }
        return this;
    }

    addEventListener (sEventName, fnHandler, oScope) {
        const fnBoundHandler = oScope ? fnHandler.bind(oScope) : fnHandler;

        this.node.addEventListener(sEventName, fnBoundHandler);
        return this;
    }

    removeEventListener (sEventName, fnHandler, oScope) {
        const fnBoundHandler = oScope ? fnHandler.bind(oScope) : fnHandler;

        this.node.removeEventListener(sEventName, fnBoundHandler);
        return this;
    }

    appendNode (oNode) {
        if (oNode) {
            this.node.appendChild(oNode.getNode());
        }
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

    /**
     * Inserts an aggregation into the view node
     * @param {object} oView The base view where the aggregation gets included
     * @param {*} sAggregation Name of the aggregation
     * @param {*} Constructor Constructor of the aggregation child
     * @param {*} [fnAfterBinding] A method which gets called after bindings were attached
     */
    insertAggregation (oView, ...args) {
        oView.renderAggregation(this.getNode(), ...args);
        return this;
    }

    // keep in mind to avoid memory leaks
    insertTemplate (fnTemplate, vData) {
        fnTemplate(this, vData);
        return this;
    }

    setChildView (oView) {
        oView.setParent(this.getNode());
        return this;
    }

    setChecked (bChecked) {
        this.node.checked = bChecked;
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

    setName (sName) {
        this.node.setAttribute('name', sName);
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

    setText (sText = "") {
        if (typeof sText !== "string") {
            sText = sText.toString();
        }

        // make spaces non-breakable
        sText = sText.replace(/ /g, '\xa0');

        this.node.innerText = sText;
        return this;
    }

    setHTML (sText = "") {
        if (typeof sText !== "string") {
            sText = sText.toString();
        }

        // make spaces non-breakable
        sText = sText.replace(/ /g, '\xa0');

        this.node.innerHTML = sText;
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

    setSrc (sValue) {
        this.node.setAttribute('src', sValue);
        return this;
    }

    sortChildren (sDir = "ASC") {
        switch (sDir) {
            case "ASC":
                [...this.node.children]
                    .sort((a, b) => a.innerText.localeCompare(b.innerText, "de") > 0 ? 1 : -1)
                    .forEach(child => this.node.appendChild(child));
                break;
            case "DESC":
                [...this.node.children]
                    .sort((a, b) => a.innerText < b.innerText ? 1 : -1)
                    .forEach(child => this.node.appendChild(child));
                break;
            default:
        }
        return this;
    }

    removeIf (vValue) {
        if (vValue) {
            return null;
        }
        return this;
    }

    destroy () {
        this.node.remove();
    }
};
