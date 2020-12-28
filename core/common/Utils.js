export function deepClone (oObject) {
    return JSON.parse(JSON.stringify(oObject));
};

export function deepEqual (vA, vB) {
    return JSON.stringify(vA) === JSON.stringify(vB);
};

export function removeDuplicates (aArr) {
    return [...new Set(aArr)];
}

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

    if (aPath.length === 0) {
        Object.keys(oObject).forEach(sKey => {
            delete oObject[sKey];
        });
        Object.keys(vValue).forEach(sKey => {
            oObject[sKey] = vValue[sKey];
        });
    } else {
        // build path
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
    }

    return oObject;
};

export function isConstructor (O) {
    try {
        // eslint-disable-next-line no-new
        new O();
    } catch (err) {
        if (err.message.indexOf('is not a constructor') >= 0) {
            return false;
        }
    }
    return true;
}

export function destroyObject (oObject) {
    oObject = typeof oObject === "object" ? oObject : {};
    Object.keys(oObject).forEach(sKey => {
        oObject[sKey] = null;
    });
}

export function findKeysInMap (mMap, fnCheck) {
    const aKeys = [];
    const it = mMap.keys();
    let oKey = it.next();
    while (!oKey.done) {
        if (fnCheck(oKey.value)) {
            aKeys.push(oKey.value);
        }
        oKey = it.next();
    }
    return aKeys;
}

/**
 * Filters a Map by keys starting with an identifier
 * Returns an array of all keys which pass the filter
 */
export function filterMapByKey (mMap, sStartsWith) {
    const fnCheck = sKey => {
        return sKey.startsWith(sStartsWith);
    };
    return findKeysInMap(mMap, fnCheck);
}

const aCssFiles = [];
export function loadCss (sPath) {
    if (!aCssFiles.includes(sPath)) {
        document.head.innerHTML += `<link type="text/css" rel="stylesheet" href=.${sPath}>`;
        aCssFiles.push(aCssFiles);
    }
}

export function textToHtml (sText) {
    var oTemplate = document.createElement('template');
    oTemplate.innerHTML = sText;
    return oTemplate.content.childNodes[0];
}

export function findAndSplice (aList, sIdentifier, vValue) {
    const iIndex = aList.findIndex(oEntry => {
        return oEntry[sIdentifier] === vValue;
    });
    if (iIndex > -1) {
        return aList.splice(iIndex, 1);
    }
}

export function clearObject (oObject) {
    Object.keys(oObject).forEach(sKey => {
        oObject[sKey] = null;
    });
}
