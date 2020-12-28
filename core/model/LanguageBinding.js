import { LanguageModel2 } from "../../renderer/model/LanguageModel2.js";
import { Binding } from "./Binding.js";

export class LanguageBinding extends Binding {
    constructor (oHandler, oPath) {
        super(oHandler);
        oPath.setBindingContext("translations");
        this.path = oPath;
        window.bi = this

        LanguageModel2.subscribe(oPath, oHandler);
    }

    getData () {
        return LanguageModel2.getData(this.path);
    }
}
