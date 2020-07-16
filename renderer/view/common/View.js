import { DomElement } from "./DomElement.js";
import { BindingManager } from "../../common/BindingManager.js";

export class View extends BindingManager {
    constructor (oParent) {
        super();
        this.parent = oParent;
        this.eventHandler = {};
        this.models = {};
    }

    addModel (oModel, sName) {
        this.models[sName] = oModel;
    }

    clearContent () {
        this.node.innerHTML = "";
    }

    getAggregation (sAggregation) {
        const oBinding = this.getAggregationBinding(sAggregation);
        if (oBinding !== undefined) {
            if (this.models[oBinding.model] !== undefined) {
                const oModel = this.models[oBinding.model];
                return oModel.get(oBinding.path);
            }
        }
    }

    getModels () {
        return this.models;
    }

    getParent () {
        return this.parent;
    }

    getProperty (sProperty) {
        const oBinding = this.getPropertyBinding(sProperty);
        if (oBinding !== undefined && this.models[oBinding.model] !== undefined) {
            const oModel = this.models[oBinding.model];
            // regular binding
            if (Array.isArray(oBinding.path)) {
                const oBindingContext = this.getBindingContext();
                if (oBinding.model === oBindingContext.model) {
                    return oModel.get(oBinding.path, oBindingContext.path);
                }
                return oModel.get(oBinding.path, []);
            // relative binding
            } else {
                const vProperty = this.getProperty(oBinding.path);
                const oBindingContext = this.getBindingContext();
                if (oBinding.model === oBindingContext.model) {
                    return oModel.get(vProperty, oBindingContext.path);
                }
                return oModel.get(vProperty, []);
            }
        }
        return this.getPropertyDefault(sProperty);
    }

    getPropertyDefault (sProperty) {
        return "";
    }

    render () {
        return new DomElement("div").getNode();
    }

    setParent (oDomRef) {
        this.parent = oDomRef;
    }

    setModels (oModels) {
        this.models = oModels;
    }

    update () {
        if (this.parent) {
            if (this.node) {
                this.clearContent();
            } else {
                this.node = new DomElement("div").getNode();
            }
            this.updateParent();
            var oNode = this.render();
            this.node.parentElement.replaceChild(oNode, this.node);
            this.node = oNode;
        }
    }

    updateParent () {
        // node has no DOM parent
        if (this.node.parentElement === null) {
            this.parent.appendChild(this.node);
        // node has different DOM parent
        } else if (this.parent !== this.node.parentElement) {
            this.node.parentElement.removeChild(this.node);
            this.parent.appendChild(this.node);
        }
    }
};
