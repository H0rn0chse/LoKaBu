/**
 * Analysis Tab
 */
GUI.Analysis = {};

/**
 * default HTML content
 */
GUI.Analysis.html = "";

/**
 * Resets Tab to default
 */
GUI.Analysis.resetTab = function(){
	$("#Analysis").replaceWith(GUI.Analysis.html);
};

/**
 * Builds Tab with data
 */
GUI.Analysis.build = function(){
	let val = calcDiff()/100;
	if(val > 0){
		$("#Analysis_Result").text("Ergebnis: Aaron schuldet Julia " + val + "€");
	}else if(val < 0){
		$("#Analysis_Result").text("Ergebnis: Julia schuldet Aaron" + -val + "€");
	}else{
		$("#Analysis_Result").text("Ergebnis: Alles ausgeglichen.");
	}

	data = database.transformData("typ", "receiptCount", "time", [])
	if(!drawLineGraph("#Analysis_svg", data, $(".tabContent:visible:first").width())){
		//console.log("D3-Error: invalid data");
	}
};

/**
 * Adds a new line to a list
 * @param {string} list id of List
 * @returns {{}} new line object
 */
GUI.Analysis.addLine = function(list){

};

/**
 * Returns available objects within tab
 * @returns {{}}
 */
GUI.Analysis.read = function(){
	return{};
};

/**
 * Handles tab specific events
 * @param {string} type type of event
 * @param {{}} event event object
 */
GUI.Analysis.eventHandler = function(type, event){
	switch(type){
		case "resize":
				GUI.Analysis.build();
			break;
	}
};