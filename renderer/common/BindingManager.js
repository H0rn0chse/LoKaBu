import { deepClone } from "./Utils.js";

export class BindingManager {
    constructor () {
        this.propertyBindings = {};
        this.aggregationBindings = {};
        this.bindingContext = {};
    }

    bindProperty (sProperty, sModel, aPath) {
        this.propertyBindings[sProperty] = {
            path: aPath,
            model: sModel
        };
        return this;
    }

    bindAggregation (sProperty, oAggregation) {
        this.aggregationBindings[sProperty] = oAggregation;
        return this;
    }

    getAggregationBinding (sAggregation) {
        return this.aggregationBindings[sAggregation];
    }

    getBindingContext () {
        return this.bindingContext;
    }

    getPropertyBinding (sProperty) {
        return this.propertyBindings[sProperty];
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
        this.propertyBindings = oBinding.propertyBindings;
        this.aggregationBindings = oBinding.aggregationBindings;
    }
};
