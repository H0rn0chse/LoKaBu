import { Container } from "./Container.js";

export class Controller {
    constructor (oDomRef) {
        this.root = oDomRef;
        this.container = {};
    }

    addView (sName, View) {
        const oView = new View();
        const oContainer = this.createContainer(sName)
            .setContent(oView);
        oView.setParent(oContainer.getNode());
        return oView;
    }

    createContainer (sName) {
        this.container[sName] = new Container(this.root, sName);
        return this.container[sName];
    }

    getAllContainer () {
        return Object.values(this.container);
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

    update () {
        this.getAllContainer().forEach(oContainer => {
            oContainer.getContent().update();
        });
        return this;
    }
};
