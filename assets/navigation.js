document.body.addEventListener('click', (event) => {
	if (event.target.dataset.section) {
		navigateToSection(event.target.dataset.section)
	}
})

function hideAllSectionsAndDeselectButtons () {
	const sections = document.querySelectorAll('.section.is-shown')
	Array.prototype.forEach.call(sections, (section) => {
		section.classList.remove('is-shown')
	})
  
	const buttons = document.querySelectorAll('.nav-item.is-selected')
	Array.prototype.forEach.call(buttons, (button) => {
		button.classList.remove('is-selected')
	})
}

function navigateToSection (section) {
	const sectionId = "section-" + section
	if (!document.querySelectorAll("#" + sectionId + ".is-shown").length) {
		hideAllSectionsAndDeselectButtons()

		document.getElementById(sectionId).classList.add('is-shown')
		window[section + "Section"].init();
	}
}

//default section
navigateToSection("new")