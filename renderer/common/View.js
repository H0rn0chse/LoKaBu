import { DomElement } from "./DomElement.js";
import { Aggregation } from "./Aggregation.js";
import { deepClone } from "../../assets/Utils.js";

export class View {
    constructor (oParent) {
        this.parent = oParent;
        this.eventHandler = {};
        this.models = {};
        this.propertyBindings = {};
        this.aggregationBindings = {};
    }

    addModel (oModel, sName) {
        this.models[sName] = oModel;
    }

    bindProperty (sProperty, sModel, aPath) {
        this.propertyBindings[sProperty] = {
            path: aPath,
            model: sModel
        };
    }

    bindAggregation (sProperty, sModel, aPath) {
        this.aggregationBindings[sProperty] = new Aggregation(sModel, aPath);
        return this.aggregationBindings[sProperty];
    }

    clearContent () {
        this.node.innerHTML = "";
    }

    getAggregation (sAggregation) {
        if (this.aggregationBindings[sAggregation] !== undefined) {
            const oBinding = this.aggregationBindings[sAggregation];
            if (this.models[oBinding.model] !== undefined) {
                const oModel = this.models[oBinding.model];
                return oModel.get(oBinding.path);
            }
        }
    }

    getAggregationBinding (sAggregation) {
        return this.aggregationBindings[sAggregation];
    }

    getModels () {
        return this.models;
    }

    getParent () {
        return this.parent;
    }

    getProperty (sProperty) {
        if (this.propertyBindings[sProperty] !== undefined) {
            const oBinding = this.propertyBindings[sProperty];
            if (this.models[oBinding.model] !== undefined) {
                const oModel = this.models[oBinding.model];
                return oModel.get(oBinding.path, this.bindingContext);
            }
        }
        return this.getPropertyDefault(sProperty);
    }

    getPropertyBinding (sProperty) {
        return this.propertyBindings[sProperty];
    }

    getPropertyBindings () {
        return this.propertyBindings;
    }

    getPropertyDefault (sProperty) {
        return "";
    }

    render () {
        return new DomElement("div").getNode();
    }

    setRelativeBindingPath (sModel, ) {

    }

    setParent (oDomRef) {
        this.parent = oDomRef;
    }

    setBindingContext (aPath, iIndex) {
        const aBindingContextPath = deepClone(aPath);
        aBindingContextPath.push(iIndex);
        this.bindingContext = aBindingContextPath;
    }

    setBindings (oBindings) {
        this.propertyBindings = oBindings;
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
