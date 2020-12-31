import { LanguageModel2 } from "../../renderer/model/LanguageModel2.js";
import { Binding } from "./Binding.js";

export class LanguageBinding extends Binding {
    constructor (oHandler, oPath) {
        super(oHandler);
        oPath.setBindingContext("translations");
        this.path = oPath;

        LanguageModel2.subscribe(oPath, oHandler);
    }

    getData () {
        return LanguageModel2.getData(this.path);
    }

    getPath () { }

    updatePath () { }

    getModel () { }

    getBindingInfo () {
        return {
            operation: "i18n",
            path: this.path.getDot()
        };
    }

    destroy () {
        LanguageModel2.unsubscribe(this.path, this.handler);
        super.destroy();
        this.path.destroy();
        this.path = null;
    }
}
