import { BindingPath } from "../model/BindingPath.js";
import { LanguageBinding } from "../model/LanguageBinding.js";
import { PropertyBinding } from "../model/PropertyBinding.js";
import { StaticBinding } from "../model/StaticBinding.js";

export class BindingManager {
    constructor () {
        this.bindings = new Map();
        this.bindingContext = new Map();
    }

    parseBindingPath (sBindingPath) {
        const oBindingInfo = {};

        if (sBindingPath.charAt(0) !== "$") {
            oBindingInfo.isStatic = true;
            oBindingInfo.value = sBindingPath;
            return oBindingInfo;
        }

        // "$i18n:modelName>property"
        // "$i18n:>/property"

        sBindingPath = sBindingPath.slice(1);

        oBindingInfo.operation = sBindingPath.split(":")[0];
        sBindingPath = sBindingPath.split(":")[1];

        oBindingInfo.model = sBindingPath.split(">")[0];
        oBindingInfo.path = sBindingPath = sBindingPath.split(">")[1].replace(/\//g, ".");
        oBindingInfo.isRelative = sBindingPath.charAt(0) === "/";
        return oBindingInfo;
    }

    setBinding (sName, oBinding) {
        this.bindings.set(sName, oBinding);
    }

    createBinding (oBindingInfo, oHandler) {
        if (oBindingInfo.operation === "i18n") {
            return new LanguageBinding(oHandler, new BindingPath(oBindingInfo.path));
        }
        if (oBindingInfo.isStatic) {
            return new StaticBinding(oHandler, oBindingInfo.value);
        }
        return new PropertyBinding(oHandler, oBindingInfo.model, new BindingPath(oBindingInfo.path));
    }

    destroyBindingManager () {
        this.bindings.forEach(oBinding => {
            oBinding.destroy();
        });
        this.bindings = null;
        this.bindingContext = null;
    }
}
