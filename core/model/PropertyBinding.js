import { Binding } from "./Binding.js";

export class PropertyBinding extends Binding {
    constructor (oHandler, oModel, oPath) {
        super(oHandler);
        this.model = oModel;
        this.path = oPath;

        oModel.subscribe(oPath, oHandler);
    }

    getData () {
        return this.model.getData(this.path);
    }

    getModel () {
        return this.model;
    }

    getPath () {
        return this.path.getDot();
    }

    destroy () {
        this.model.unsubscribe(this.path, this.handler);
        super.destroy();
        this.path.destroy();
        this.path = null;
        this.model = null;
    }
}
