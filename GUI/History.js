/**
 * History Tab
 */
GUI.History = {};

/**
 * default HTML content
 */
GUI.History.html = "";

/**
 * @typedef {Object} HistoryTemp
 * @property {Boolean} isWaiting
 * @property {Boolean} initFilter
 * @property {String} sortField
 * @property {String} sortDirection
 * @property {Number} page
 * @property {Filter} filterInstance
 * @property {Function} requestData
 */

/**
 * Tab specific variables
 * @type {HistoryTemp}
 */
GUI.History.Temp = {
	isWaiting: false,
	initFilter: true,
	sortField: "ReceiptID",
	sortDirection: "ASC",
	page: 0,
	filterInstance: {},
	requestData: function(filterList, resetPage=true){
		this.isWaiting = true;
		GUI.History.resetTab()

		let order = "ORDER BY " + this.sortField + " " + this.sortDirection;

		if(resetPage){
			this.page = 0
		}

		database.receiptList_filter(filterList, order, this.page);
	}
};

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
	var displayStatus = $("#History").css("display");
	$("#History").replaceWith(GUI.History.html);
	$("#History_Receipts").empty();
	GUI.History.Temp.filterInstance.buildFilter();
	$("#History").css("display", displayStatus);
};

/**
 * Builds Tab with data
 * @param {string} sort
 * @param {boolean} asc
 */
GUI.History.build = function(){

	if(GUI.History.Temp.initFilter){
		GUI.History.Temp.initFilter = false;
		let defaultFilter = [{
			"name": "ReceiptID",
			"valConjunction": "greater",
			"varConjunction": "",
			"value": "0"
		}];

		let parent = function(){return document.getElementById("History_Filter");};
		let submitFilter = GUI.History.Temp.requestData.bind(GUI.History.Temp);

		GUI.History.Temp.filterInstance = new Filter(parent , submitFilter, database.ReceiptList_filterTypes, defaultFilter);
		GUI.History.Temp.filterInstance.buildFilter();
	}
	
	if(!GUI.History.Temp.isWaiting){
		GUI.History.Temp.isWaiting = true;

		GUI.History.Temp.filterInstance.applyFilter();
	}else{
		GUI.History.Temp.isWaiting = false;

		//Order Highlight
		let orderList = {};
		orderList["ReceiptID"] = "sortID";
		orderList["ReceiptDate"] = "sortDate";
		orderList["ReceiptAccount"] = "sortAccount";
		orderList["ReceiptValue"] = "sortValue";
		$("#History_Sort .button." + orderList[GUI.History.Temp.sortField]).addClass(GUI.History.Temp.sortDirection.toLowerCase());

		for(var i= 0; i < database.receiptList.length; i++){
			var elem = GUI.History.addLine("#History_Receipts");
			var item = database.receiptList[i];
			$(elem).find("[name=ID]").val(item.ReceiptID);
			$(elem).find("[name=Date]").val(FormatDate(item.ReceiptDate));
			$(elem).find("[name=Account]").val(item.ReceiptAccount);
			$(elem).find("[name=Value]").val(item.ReceiptValue/100);
		}
		let pageText = "";
		if(database.receiptList.length > 0){
			pageText = (GUI.History.Temp.page + 1) + " / " + database.receiptList[0].PageCount;
		}else{
			pageText = "0 / 0"
		}

		$("#History_Page span").text(pageText)
	}
};

/**
 * Adds a new line to a list
 * @param {string} list id of List
 * @returns {{}} new line object
 */
GUI.History.addLine = function(list){
	var elem = $($.parseHTML(GUI.History.html)).find(list).children().last();
	$(list).append(elem);

	switch(list){
		case "#History_Receipts":		
			break;
	}

	return elem;
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
				database.receiptDetail_filter($(event.target).parent().find("[name=ID]").val());
				switchTab('', "Edit");
			
			//sortID button
			}else if($(event.target).hasClass("sortID")){
				if(GUI.History.Temp.sortDirection == "ASC" && GUI.History.Temp.sortField == "ReceiptID"){
					GUI.History.Temp.sortDirection = "DESC";
				}else{
					GUI.History.Temp.sortDirection = "ASC";
					GUI.History.Temp.sortField = "ReceiptID";
				}

				GUI.History.build();
			
			//sortDate button
			}else if($(event.target).hasClass("sortDate")){
				if(GUI.History.Temp.sortDirection == "ASC" && GUI.History.Temp.sortField == "ReceiptDate"){
					GUI.History.Temp.sortDirection = "DESC";
				}else{
					GUI.History.Temp.sortDirection = "ASC";
					GUI.History.Temp.sortField = "ReceiptDate";
				}

				GUI.History.build();
			
			//sortAccount button
			}else if($(event.target).hasClass("sortAccount")){
				if(GUI.History.Temp.sortDirection == "ASC" && GUI.History.Temp.sortField == "ReceiptAccount"){
					GUI.History.Temp.sortDirection = "DESC";
				}else{
					GUI.History.Temp.sortDirection = "ASC";
					GUI.History.Temp.sortField = "ReceiptAccount";
				}

				GUI.History.build();

			//sortValue button
			}else if($(event.target).hasClass("sortValue")){
				if(GUI.History.Temp.sortDirection == "ASC" && GUI.History.Temp.sortField == "ReceiptValue"){
					GUI.History.Temp.sortDirection = "DESC";
				}else{
					GUI.History.Temp.sortDirection = "ASC";
					GUI.History.Temp.sortField = "ReceiptValue";
				}

				GUI.History.build();

			//removeLine
			}else if($(event.target).hasClass("removeLine")){
				if($(event.target).closest(".flexLine").siblings().length > 0){
					$(event.target).closest(".flexLine").remove()
				}

			//addLine
			}else if($(event.target).hasClass("addLine")){
				GUI.History.addLine("#" + $(GUI.Helper.getContainer(event.target)).prop("id"));
				GUI.History.build();

			//pageButton
			}else if($(event.target).is("#History_Page button")){
				switch(event.target.innerText){
					case ">":
						let pageCount = database.receiptList.length > 0 ? database.receiptList[0].PageCount : 0;
						
						if(pageCount > GUI.History.Temp.page + 1){
							GUI.History.Temp.page += 1;
						}
						break;
					case "<":
						if(GUI.History.Temp.page > 0){
							GUI.History.Temp.page -= 1;
						}
						break;
				}
				GUI.History.Temp.requestData(GUI.History.Temp.filterInstance.getFilterList(), false);
			}
			break;
	}
};