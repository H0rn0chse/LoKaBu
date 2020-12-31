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

    getPath () {
        return this.path;
    }

    updatePath (oPath) {
        this.model.unsubscribe(this.path, this.getHandler());
        this.path.destroy();
        this.path = oPath;
        this.model.subscribe(oPath, this.getHandler());
    }

    getModel () {
        return this.model;
    }

    getBindingInfo () {
        return {
            model: this.model,
            path: this.path.getDot()
        };
    }

    destroy () {
        this.model.unsubscribe(this.path, this.handler);
        super.destroy();
        this.path.destroy();
        this.path = null;
        this.model = null;
    }
}
