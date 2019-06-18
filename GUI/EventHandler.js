/**
 * Event handler of the GUI
 */
GUI.EventHandler = {};

GUI.EventHandler.ondatabasechange = function(objectType){
	GUI.Helper.getTabList().forEach(function(tab){
		if(tab != "EventHandler" && tab != "Helper"){
			if(GUI[tab].isObjectRegistered(objectType)){
				GUI[tab].build();
			}
		}
	});
}

/**
 * Focusout Event
 * @param {{}} event event object
 */
GUI.EventHandler.onfocusout = function(event){
	if(event.target !== window){
		tab = GUI.Helper.getTab(event.target)
		
		if(typeof tab !== "undefined"){
			GUI[tab].eventHandler("focusout", event);
		}
	}
}

/**
 * Keypress Event
 * @param {{}} event event object
 */
GUI.EventHandler.onkeypress = function(event){
	if(event.target !== window){
		tab = GUI.Helper.getTab(event.target)

		if(typeof tab !== "undefined"){
			GUI[tab].eventHandler("keypress", event);
		}
	}
}

/**
 * Click Event
 * @param {{}} event event object
 */
GUI.EventHandler.onclick = function(event){
	if(event.target !== window){
		tab = GUI.Helper.getTab(event.target)

		if(typeof tab !== "undefined"){
			GUI[tab].eventHandler("click", event);
		}
	}
};

/**
 * Change Event
 * @param {{}} event event object
 */
GUI.EventHandler.onchange = function(event){
	if(event.target !== window){
		tab = GUI.Helper.getTab(event.target)

		if(typeof tab !== "undefined"){
			GUI[tab].eventHandler("change", event);
		}
	}
};

/**
 * Resize Event
 * @param {{}} event event object
 */
GUI.EventHandler.onresize = function(event){
	var listeningTabs = ["Analysis"];

	listeningTabs.forEach(function(tab){
		GUI[tab].eventHandler("resize", event);
	})
};

/**
 * Callback function for a mutationObserver
 * @param {{}} mutationList
 */
GUI.EventHandler.mutationObserver = function(mutationsList, observer) {
	for(var mutation of mutationsList) {
		if (mutation.type == 'childList') {

			//Add datepicker to every date input
			if(mutation.target.querySelector("* [name=Date]") !== null){
				$(mutation.target).find($("[name=Date]")).datepicker();
			}
		}
	}
};