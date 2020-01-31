document.body.addEventListener('click', (oEvent) => {
    if (oEvent.target.dataset.section) {
        navigateToSection(oEvent.target.dataset.section);
    }
});

function hideAllSectionsAndDeselectButtons () {
    const aSections = document.querySelectorAll('.section.is-shown');
    aSections.forEach((oSection) => {
        oSection.classList.remove('is-shown');
    });

    const aButtons = document.querySelectorAll('.nav-item.is-selected');
    aButtons.forEach((oButton) => {
        oButton.classList.remove('is-selected');
    });
}

function navigateToSection (sSection) {
    const sSectionId = "section-" + sSection;
    const oSectionController = window[sSection + "Section"];

    if (!document.querySelectorAll("#" + sSectionId + ".is-shown").length) {
        hideAllSectionsAndDeselectButtons();
        document.getElementById(sSectionId).classList.add('is-shown');
        oSectionController.init();
    }
}

// default section
navigateToSection("new");
