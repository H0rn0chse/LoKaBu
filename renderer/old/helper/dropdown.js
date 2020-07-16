module.exports = {
    fill: function (oElement, aList, oPropertyMap = { value: "value", displayName: "displayName" }) {
        let aElements;
        if (typeof oElement === "string") {
            aElements = document.querySelectorAll(oElement);
        } else {
            aElements = [oElement];
        }
        aElements.forEach((oElement) => {
            oElement.innerHTML = "";

            aList.sort((a, b) => {
                const sDisplayNameA = (a && oPropertyMap && oPropertyMap.displayName && a[oPropertyMap.displayName]) || "";
                const sDisplayNameB = (b && oPropertyMap && oPropertyMap.displayName && b[oPropertyMap.displayName]) || "";
                return sDisplayNameA.localeCompare(sDisplayNameB);
            });
            aList.forEach((oValue) => {
                const sValue = (oValue && oPropertyMap && oPropertyMap.value && oValue[oPropertyMap.value]) || "";
                let sDisplayName = (oValue && oPropertyMap && oPropertyMap.displayName && oValue[oPropertyMap.displayName]) || "";
                const aParams = [];
                if (oValue.i18n) {
                    aParams.push("data-lang=" + oValue.i18n);
                    sDisplayName = "";
                }
                oElement.innerHTML += "<option " + aParams.join(" ") + " value='" + sValue + "'>" + sDisplayName + "</option>";
            });
        });
    },
    sort: function (oElement) {
        const aOptions = oElement.querySelectorAll("option");
        const aOrderedOptions = [];
        aOptions.forEach((oOption) => {
            aOrderedOptions.push({
                text: oOption.innerText,
                option: oOption
            });
            oOption.parentNode.removeChild(oOption);
        });
        aOrderedOptions.sort((a, b) => {
            return a.text.localeCompare(b.text);
        });
        aOrderedOptions.forEach((oOption) => {
            oElement.appendChild(oOption.option);
        });
    }
};
