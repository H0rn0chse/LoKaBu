import { deepClone, objectGet, objectSet } from "../../common/Utils.js";
import { EventManager } from "../../common/EventManager.js";

export class Model extends EventManager {
    constructor (oData) {
        super();
        this._data = oData;
        this.addEvents([
            "update"
        ]);
    }

    _evaluatePath (aPath) {
        return aPath.reduce((acc, vCurrentItem) => {
            if (typeof vCurrentItem === "string" || typeof vCurrentItem === "number") {
                acc.push(vCurrentItem);
            } else if (typeof vCurrentItem === "object") {
                const sIdentifier = Object.keys(vCurrentItem)[0];
                const sLookUpValue = vCurrentItem[sIdentifier];
                const vValue = this.get(acc);
                if (Array.isArray(vValue)) {
                    const iIndex = vValue.findIndex(vItem => {
                        return vItem[sIdentifier] === sLookUpValue;
                    });
                    if (iIndex > -1) {
                        acc.push(iIndex);
                    }
                }
            }
            return acc;
        }, []);
    }

    get (aPath, aBindingContextPath = []) {
        if (Array.isArray(aPath)) {
            const aContextPath = deepClone(aBindingContextPath);
            aContextPath.push(...deepClone(aPath));

            return objectGet(this._data, this._evaluatePath(aContextPath));
        }
    }

    onUpdate (oEvent) {
        this.handleEvent("update", oEvent);
    }

    set (aPath, vValue, bSuppressUpdate) {
        objectSet(this._data, this._evaluatePath(aPath), vValue);
        if (!bSuppressUpdate) {
            this.onUpdate({});
        }
    }

    mergeObjectIntoData (oData, aPath = []) {
        Object.keys(oData).forEach(sKey => {
            const aCurrentPath = aPath.concat([sKey]);
            this.set(aCurrentPath, oData[sKey], true);
        });
        this.update();
    }

    update () {
        this.onUpdate({});
    }

    addEntry (aPath, vEntry, bSuppressUpdate) {
        const aList = this.get(aPath);
        this.set(aPath.concat(aList.length), vEntry, bSuppressUpdate);
    }
};
