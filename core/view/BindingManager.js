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

        if (sBindingPath.charAt(0) === "?") {
            // "?lookupBinding>/pathExtension"
            sBindingPath = sBindingPath.slice(1);

            oBindingInfo.isForwarded = true;
            oBindingInfo.contextPath = sBindingPath.split(">")[0];
            oBindingInfo.path = sBindingPath.split(">")[1].replace(/\//g, ".");
            return oBindingInfo;
        }

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
        oBindingInfo.isRelative = sBindingPath.charAt(0) === ".";
        return oBindingInfo;
    }

    setBinding (sPropertyName, oBinding) {
        this.bindings.set(sPropertyName, oBinding);
    }

    getBinding (sPropertyName) {
        return this.bindings.get(sPropertyName);
    }

    setBindingContext (oModel, oPath, sItem = "") {
        const sContextPath = `${oPath.getDot()}.${sItem}`;
        this.bindingContext.set(oModel, sContextPath);
    }

    getBindingContext (sPropertyName) {
        const oBinding = this.bindings.get(sPropertyName);
        if (oBinding) {
            return {
                path: oBinding.getPath(),
                model: oBinding.getModel()
            };
        }
        return {};
    }

    createBinding (oBindingInfo, oHandler) {
        if (oBindingInfo.operation === "i18n") {
            return new LanguageBinding(oHandler, new BindingPath(oBindingInfo.path));
        }
        if (oBindingInfo.isStatic) {
            return new StaticBinding(oHandler, oBindingInfo.value);
        }
        const oBindingPath = new BindingPath(oBindingInfo.path);
        if (oBindingInfo.isRelative) {
            const sContext = this.bindingContext.get(oBindingInfo.model) || "";
            oBindingPath.setBindingContext(sContext);
        }
        return new PropertyBinding(oHandler, oBindingInfo.model, oBindingPath);
    }

    async updateBindings () {
        this.bindings.forEach(oBinding => {
            oBinding.triggerUpdate();
        });
    }

    destroyBindingManager () {
        this.bindings.forEach(oBinding => {
            oBinding.destroy();
        });
        this.bindings = null;
        this.bindingContext = null;
    }
}
