import { deepClone } from "./Utils.js";

export class BindingManager {
    constructor () {
        this.propertyBindings = new Map();
        this.aggregationBindings = new Map();
        this.bindingContext = {};
    }

    bindProperty (sProperty, sModel, aPath) {
        const oBinding = {
            path: aPath,
            model: sModel
        };
        this.propertyBindings.set(sProperty, oBinding);
        return this;
    }

    bindAggregation (sProperty, oAggregation) {
        this.aggregationBindings.set(sProperty, oAggregation);
        return this;
    }

    getAggregationBinding (sAggregation) {
        return this.aggregationBindings.get(sAggregation);
    }

    getBindingContext () {
        return this.bindingContext;
    }

    getPropertyBinding (sProperty) {
        return this.propertyBindings.get(sProperty);
    }

    getPropertyBindings () {
        return this.propertyBindings;
    }

    setBindingContext (oBinding, iIndex) {
        const aBindingContextPath = deepClone(oBinding.path);
        aBindingContextPath.push(iIndex);
        this.bindingContext = {
            path: aBindingContextPath,
            model: oBinding.model
        };
    }

    setBindings (oBinding) {
        this.propertyBindings = new Map(oBinding.propertyBindings);
        this.aggregationBindings = new Map(oBinding.aggregationBindings);
    }
};
