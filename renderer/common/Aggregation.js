export class Aggregation {
    constructor (sModel, aPath) {
        this.model = sModel;
        this.path = aPath;
        this.bindings = {};
    }

    bindProperty (sProperty, sModel, aPath) {
        this.bindings[sProperty] = {
            path: aPath,
            model: sModel
        };
    }

    getPropertyBindings () {
        return this.bindings;
    }
};
