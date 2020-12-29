import { Handler } from "../common/Handler.js";
import { MultiClass } from "../common/MultiClass.js";
import { ContainerElement } from "./ContainerElement.js";
import { TreeElement } from "./TreeElement.js";

export class View2 extends MultiClass(ContainerElement, TreeElement) {
    constructor (controller) {
        super();
        this.controller = controller;
        this.nodeTree = null;
    }

    async init () {
        await this.buildTree();
        await this.initTree();
    }

    async buildTree () {
        console.error("View.buildTree should be implemented by the derived class");
    }

    async initTree () {
        console.error("View.initTree should be implemented by the derived class");
    }

    getEventHandler (sName) {
        return new Handler(this.controller[sName], this.controller);
    }

    getModel (sName) {
        return this.controller.getModel(sName);
    }

    getDomRef () {
        return this.getRootNode();
    }
}
