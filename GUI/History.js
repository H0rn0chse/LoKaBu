/**
 * History Tab
 */
GUI.History = {};

/**
 * default HTML content
 */
GUI.History.html = "";

/**
 * Resets Tab to default
 */
GUI.History.resetTab = function(){
	$("#History").replaceWith(GUI.History.html);
};

/**
 * Builds Tab with data
 */
GUI.History.build = function(){
	$("#History_Receipts").empty();

	database.receipts.sort((a,b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0)); 

	for(var i=database.receipts.length - 1; i >= 0; i--){
		var item = database.receipts[i];
		var newLine = $($.parseHTML(GUI.History.html)).find("#History_Receipts").children().last();

		$("#History_Receipts").append(newLine);

		$(newLine).find("[name=ID]").val(item.id);
		$(newLine).find("[name=Date]").val(FormatDate(item.date));
		$(newLine).find("[name=Account]").val(database.accounts.find(x => x.id === parseInt(item.account)).displayName);

		var sum = 0;
		item.lines.forEach(function(i){
			sum += i.value;
		});

		$(newLine).find("[name=Value]").val(parseFloat(sum)/100);
	}
};

/**
 * Adds a new line to a list
 * @param {string} list id of List
 * @returns {{}} new line object
 */
GUI.History.addLine = function(list){

};

/**
 * Returns available objects within tab
 * @returns {{}}
 */
GUI.History.read = function(){
	return {};
};

/**
 * Handles tab specific events
 * @param {string} type type of event
 * @param {{}} event event object
 */
GUI.History.eventHandler = function(type, event){
	switch(type){
		case "click":
			//editReceipt
			if($(event.target).hasClass("editReceipt")){
				GUI.Edit.build($(event.target).parent().find("[name=ID]").val());
				switchTab('', "Edit");

			}
			break;
	}
};