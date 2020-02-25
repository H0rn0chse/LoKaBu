document.body.addEventListener('click', (oEvent) => {
    if (oEvent.target.classList.contains("nav-item")) {
        var oNavLink = oEvent.target.querySelectorAll(".nav-link[data-section]")[0];
        if (oNavLink) {
            navigateToSection(oNavLink.dataset.section);
        }
    } else if (oEvent.target.dataset.section) {
        navigateToSection(oEvent.target.dataset.section);
    }
});

function hideAllSectionsAndDeselectButtons () {
    const aSections = document.querySelectorAll(".section.is-shown");
    aSections.forEach((oSection) => {
        oSection.classList.remove("is-shown");
    });

    const aNavItems = document.querySelectorAll(".nav-item");
    aNavItems.forEach((oNavItem) => {
        oNavItem.classList.remove("is-shown");
    });
}

function navigateToSection (sSection) {
    const sSectionId = "section-" + sSection;
    const oSectionController = window[sSection + "Section"];

    if (!document.querySelectorAll("#" + sSectionId + ".is-shown").length) {
        hideAllSectionsAndDeselectButtons();
        document.getElementById(sSectionId).classList.add('is-shown');
        const aNavItems = document.querySelectorAll(".nav-item");
        aNavItems.forEach((oNavItem) => {
            if (hasChildByCss(oNavItem, ".nav-link[data-section=" + sSection + "]")) {
                oNavItem.classList.add("is-shown");
            }
        });
        oSectionController.init();
    }
}

function hasChildByCss (oNode, sSelector) {
    if (oNode.querySelectorAll(sSelector).length) {
        return true;
    }
    return false;
}

module.exports = {
    navigateToSection: navigateToSection
};
