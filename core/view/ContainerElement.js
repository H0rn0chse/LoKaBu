export class ContainerElement {
    constructor () {
        this.rootNode = null;
    }

    setRootNode (oDomRef) {
        this.rootNode = oDomRef;
    }

    getRootNode () {
        return this.rootNode;
    }
}
