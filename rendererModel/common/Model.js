import { deepClone, objectGet, objectSet } from "../../assets/Utils.js";

export class Model {
    constructor (oData) {
        this._data = oData;
    }

    get (aPath, aBindingContextPath = []) {
        const aContextPath = deepClone(aBindingContextPath);
        aContextPath.push(...deepClone(aPath));
        return objectGet(this._data, aContextPath);
    }

    set (aPath, vValue) {
        objectSet(this._data, aPath, vValue);
    }
};
