import { Binding } from "./Binding.js";

export class PropertyBinding extends Binding {
    constructor (oHandler, oModel, sPath) {
        super(oHandler);
        this.model = oModel;
        this.path = sPath;

        oModel.subscribe(sPath, oHandler);
    }

    getData () {
        return this.model.getData(this.path);
    }
}
