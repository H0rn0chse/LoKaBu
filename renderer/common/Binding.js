export class Binding {
    constructor (oModel, aPath) {
        this.model = oModel;
        this.path = aPath;

        this.propertyBindings = new Map();
    }

    bindProperty (sProperty, aPath) {
        this.propertyBindings.set(sProperty, aPath);
        return this;
    }

    get () {
        const vData = this.model.get(this.path);
        // returns Array containing objects according to the bound properties
        if (Array.isArray(vData) && this.propertyBindings.size > 0) {
            return vData.map((oItem, iIndex) => {
                const oData = {};
                this.propertyBindings.forEach((aValue, sKey) => {
                    oData[sKey] = this.model.get(aValue, [...this.path, iIndex]);
                });
                return oData;
            });
        }
        return vData;
    }

    getProperty (sProperty) {
        const aPath = this.propertyBindings.get(sProperty);
        return this.model.get(aPath, this.path);
    }
}
