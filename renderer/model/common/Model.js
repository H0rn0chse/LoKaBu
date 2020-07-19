import { deepClone, objectGet, objectSet } from "../../common/Utils.js";
import { EventManager } from "../../common/EventManager.js";

export class Model extends EventManager {
    constructor (oData) {
        super();
        this._data = oData;
        this.addEvent("update");
    }

    get (aPath, aBindingContextPath = []) {
        const aContextPath = deepClone(aBindingContextPath);
        aContextPath.push(...deepClone(aPath));
        return objectGet(this._data, aContextPath);
    }

    onUpdate (oEvent) {
        this.handleEvent("update", oEvent);
    }

    set (aPath, vValue, bSuppressUpdate) {
        objectSet(this._data, aPath, vValue);
        if (!bSuppressUpdate) {
            this.onUpdate({});
        }
    }

    update () {
        this.onUpdate({});
    }
};
