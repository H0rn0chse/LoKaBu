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
}
