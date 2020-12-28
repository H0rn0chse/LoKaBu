import { Binding } from "./Binding.js";

export class StaticBinding extends Binding {
    constructor (oHandler, oValue) {
        super(oHandler);
        this.value = oValue;
    }

    getData () {
        return this.value;
    }

    destroy () {
        super.destroy();
        this.value = null;
    }
}
