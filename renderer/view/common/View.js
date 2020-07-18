import { DomElement } from "./DomElement.js";
import { BindingManager } from "../../common/BindingManager.js";
import { EventManager } from "../../common/EventManager.js";
import { MultiClass } from "../../common/MultiClass.js";

export class View extends MultiClass(BindingManager, EventManager) {
    constructor () {
        super();
        this.parent = null;
        this.models = {};
    }

    addModel (oModel, sName) {
        this.models[sName] = oModel;
        return this;
    }

    clearContent () {
        this.node.innerHTML = "";
        return this;
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

    renderAggregation (sAggregation, oDomRef, Constructor, fnChild) {
        const aItems = this.getAggregation(sAggregation);
        const oBinding = this.getAggregationBinding(sAggregation);

        aItems.forEach((oItem, iIndex) => {
            const oChild = new Constructor();
            oChild.setModels(this.getModels());
            oChild.setBindings(oBinding);
            oChild.setBindingContext(oBinding, iIndex);
            oChild.setParent(oDomRef);
            fnChild(oChild);
            oChild.update();
        });
        return this;
    }

    setParent (oDomRef) {
        this.parent = oDomRef;
        return this;
    }

    setModels (oModels) {
        this.models = oModels;
        return this;
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
        return this;
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
        return this;
    }
};
