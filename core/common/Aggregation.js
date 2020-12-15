import { BindingManager } from "./BindingManager.js";

export class Aggregation extends BindingManager {
    constructor (sModel, aPath) {
        super();
        this.model = sModel;
        this.path = aPath;
    }
};
