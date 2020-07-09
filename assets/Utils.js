export function deepClone (oObject) {
    return JSON.parse(JSON.stringify(oObject));
};

export function objectGet (oObject, aPath) {
    let vValue = oObject;
    for (let i = 0; i < aPath.length; i++) {
        if (vValue === undefined) {
            break;
        }
        vValue = vValue[aPath[i]];
    }
    return vValue;
};

export function objectSet (oObject, aPath, vValue) {
    oObject = oObject || {};
    let oTemp = oObject;
    for (let i = 0; i < aPath.length - 1; i++) {
        if (oTemp[aPath[i]] === undefined) {
            if (Number.isInteger(aPath[i])) {
                oTemp[aPath[i]] = new Array(aPath[i]).fill();
            } else {
                oTemp[aPath[i]] = {};
            }
        }
        oTemp = oTemp[aPath[i]];
    }
    oTemp[aPath[aPath.length - 1]] = vValue;
    return oObject;
};
