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
        console.error("Controller.initModels should be implemented by the derived class");
    }

    initViews () {
        console.error("Controller.initViews should be implemented by the derived class");
    }

    createContainer (sName) {
        this.container[sName] = new Container(this.root, sName);
        return this.container[sName];
    }

    getContainer (sName) {
        return this.container[sName];
    }

    setContainerElement (sName, oItem) {
        var oContainer = this.createContainer(sName);
        oContainer.setContent(oItem);
        oItem.setRootNode(oContainer.getNode());
        return this.container[sName];
    }

    getModel (sName) {
        return this.model.get(sName);
    }

    setModel (sName = "", oModel) {
        this.model.set(sName, oModel);
    }
};
