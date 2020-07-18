import { Container } from "./Container.js";

export class Controller {
    constructor (oDomRef) {
        this.root = oDomRef;
        this.container = {};
    }

    createContainer (sName) {
        this.container[sName] = new Container(this.root);
        return this.container[sName];
    }

    getContainer (sName) {
        return this.container[sName];
    }
};
