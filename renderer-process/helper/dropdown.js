module.exports = {
    fill: function (oElement, aList) {
        let aElements;
        if (typeof oElement === "string") {
            aElements = document.querySelectorAll(oElement);
        } else {
            aElements = [oElement];
        }
        aElements.forEach((oElement) => {
            oElement.innerHTML = "";

            aList.sort((a, b) => {
                return a.DisplayName.localeCompare(b.DisplayName);
            });
            aList.forEach((oValue) => {
                oElement.innerHTML += "<option value='" + oValue.ID + "'>" + oValue.DisplayName + "</option>";
            });
        });
    }
};
