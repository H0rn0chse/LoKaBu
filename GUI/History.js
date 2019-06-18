/**
 * History Tab
 */
GUI.History = {};

/**
 * default HTML content
 */
GUI.History.html = "";

/**
 * Returns a boolean whether this objectType is used in this tab
 * @returns {bool}
 */
GUI.History.isObjectRegistered = function(objectType){
	arr = ["types", "persons", "accounts", "stores", "receiptList"];
	return arr.includes(objectType) && GUI.History.Temp.isWaiting;
};
/**
 * Resets Tab to default
 */
GUI.History.resetTab = function(){
	$("#History").replaceWith(GUI.History.html);
};

/**
 * Builds Tab with data
 * @param {string} sort
 * @param {boolean} asc
 */
GUI.History.build = function(sort = "date", asc = true){
	$("#History_Receipts").empty();

	console.log(sort)
	
	//sort
	if(sort == "account"){
		accountName = function(a){
			return database.accounts.find(x => x.id === parseInt(a.account)).displayName;
		}
		database.receipts.sort((a,b) => (accountName(a) > accountName(b) ? 1 : -1));
	}else if(sort == "value"){
		sumValues = function(a){
			var sum = 0;
			a.lines.forEach(function(i){
				sum += i.value;
			});
			return sum;
		}
		database.receipts.sort((a,b) => sumValues(a) - sumValues(b));
	}else if(sort == "id"){
		database.receipts.sort((a,b) => (a.id - b.id));
	}else if(sort == "date"){
		database.receipts.sort((a,b) => (a.date - b.date));
	}
	if(asc){
		database.receipts.reverse()
	}

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

			}else if($(event.target).hasClass("sortID")){
				GUI.History.build("id", $(event.target).hasClass("asc"));
				$(event.target).toggleClass("asc");
				$(event.target).toggleClass("desc");
			}else if($(event.target).hasClass("sortDate")){
				GUI.History.build("date", $(event.target).hasClass("asc"));
				$(event.target).toggleClass("asc");
				$(event.target).toggleClass("desc");
			}else if($(event.target).hasClass("sortAccount")){
				GUI.History.build("account", $(event.target).hasClass("asc"));
				$(event.target).toggleClass("asc");
				$(event.target).toggleClass("desc");
			}else if($(event.target).hasClass("sortValue")){
				GUI.History.build("value", $(event.target).hasClass("asc"));
				$(event.target).toggleClass("asc");
				$(event.target).toggleClass("desc");
			}
			break;
	}
};