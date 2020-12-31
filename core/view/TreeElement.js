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
     * The Handler calls will be awaited asynchronously.
     * @param {*} vHandler String or function.
     * @param {*} args a list of arguments
     * @returns {Promise<void>} Resolves after all handler were executed
     */
    iterateChildren (vHandler, args = []) {
        const aResults = this.children.map(async oChild => {
            if (typeof vHandler === "string" && typeof oChild[vHandler] === "function") {
                await oChild[vHandler].apply(oChild, args);
            }
            if (typeof vHandler === "function") {
                await vHandler(oChild, ...args);
            }
            return oChild.iterateChildren(vHandler, args);
        });

        return Promise.all(aResults);
    }

    /**
     * In case a string is provided the method on the parent is called (in scope of the parent)
     * The Handler calls will be awaited asynchronously.
     * @param {*} vHandler String or function.
     * @param {*} args a list of arguments
     * @returns {Promise<void>} Resolves after all handler were executed
     */
    async iterateParents (vHandler, args = []) {
        const oParent = this.parent;
        if (oParent) {
            if (typeof vHandler === "string" && typeof oParent[vHandler] === "function") {
                await oParent[vHandler].apply(oParent, args);
            }
            if (typeof vHandler === "function") {
                await vHandler(oParent, ...args);
            }
            await oParent.iterateParents(vHandler, args);
        }
    }

    getDomRef () {
        // Can be implemented by the Component
        return this.getParentDomRef();
    }

    getParentDomRef () {
        return this.parent && this.parent.getDomRef && this.parent.getDomRef();
    }

    destroyTreeElement () {
        this.parent = null;
    }
}
