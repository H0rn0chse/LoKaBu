import { Container } from "./Container.js";

export class Controller2 {
    constructor (oDomRef) {
        this.root = oDomRef;
        this.container = {};
        this.model = new Map();

        this.initModels();
        this.initViews();
    }

    initModels () {
        // To be implemented by the controller
    }

    initViews () {
        // To be implemented by the controller
    }

    createContainer (sName) {
        this.container[sName] = new Container(this.root, sName);
        return this.container[sName];
    }

    setContainerItem (sName, oItem) {
        var oContainer = this.createContainer(sName);
        oContainer.setContent(oItem);
        oItem.setRootNode(oContainer.getNode());
        return this.container[sName];
    }

    getContainer (sName) {
        return this.container[sName];
    }

    getContainerContent (sName) {
        return this.container[sName] && this.container[sName].getContent();
    }

    getNode () {
        return this.root;
    }

    getModel (sName) {
        return this.model.get(sName);
    }
};
