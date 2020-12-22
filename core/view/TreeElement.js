export class TreeElement {
    constructor () {
        this.parent = null;
        this.children = [];
    }

    setParentComponent (oParent) {
        this.parent = oParent;
        oParent._addChildComponent(this);
    }

    addChildComponent (oChild) {
        this.children.push(oChild);
        oChild._setParentComponent(this);
    }

    _setParentComponent (oParent) {
        this.parent = oParent;
    }

    _addChildComponent (oChild) {
        this.children.push(oChild);
    }

    /**
     * In case a string is provided the method on the child is called (in scope of the child)
     * @param {*} vHandler String or function.
     * @param {*} args a list of arguments
     */
    iterateChildren (vHandler, args = []) {
        this.children.forEach(oChild => {
            if (typeof vHandler === "string" && typeof oChild[vHandler] === "function") {
                oChild[vHandler].apply(oChild, args);
            }
            if (typeof vHandler === "function") {
                vHandler(oChild, ...args);
            }
            oChild.iterateChildren(vHandler, args);
        });
    }

    _iterateChildren (vHandler, args) {
        this.children.forEach(oChild => {
            if (typeof vHandler === "string" && typeof oChild[vHandler] === "function") {
                oChild[vHandler].apply(oChild, args);
            }
            if (typeof vHandler === "function") {
                vHandler(oChild, ...args);
            }
            oChild._iterateChildren(vHandler, ...args);
        });
    }

    getDomRef () {
        // Can be implemented by the Component
        return this.getParentDomRef();
    }

    getParentDomRef () {
        return this.parent && this.parent.getDomRef && this.parent.getDomRef();
    }
}
