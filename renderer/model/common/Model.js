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

    get (aPath, aBindingContextPath = []) {
        if (Array.isArray(aPath)) {
            let aContextPath = deepClone(aBindingContextPath);
            aContextPath.push(...deepClone(aPath));

            aContextPath = aContextPath.reduce((acc, vCurrentItem) => {
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
            return objectGet(this._data, aContextPath);
        }
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

    mergeObject (oData, aPath = []) {
        Object.keys(oData).forEach(sKey => {
            const aCurrentPath = aPath.concat([sKey]);
            this.set(aCurrentPath, oData[sKey]);
        });
    }

    update () {
        this.onUpdate({});
    }
};
