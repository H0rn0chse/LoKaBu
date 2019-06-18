/**
 * Edit Tab
 */
GUI.Edit = {};

/**
 * default HTML content
 */
GUI.Edit.html = "";

/**
 * Returns a boolean whether this objectType is used in this tab
 * @returns {Boolean}
 */
GUI.Edit.isObjectRegistered = function(objectType){
	arr = ["types", "persons", "accounts", "stores", "receiptDetail"];	
	return arr.includes(objectType);
};
/**
 * Resets Tab to default
 */
GUI.Edit.resetTab = function(){
	$("#Edit").replaceWith(GUI.Edit.html);
	$("#Edit_Lines").empty();
};

/**
 * Builds Tab with data
 * @param {number} receiptId
 */
GUI.Edit.build = function(receiptId = 0){
	if(receiptId > 0){
		GUI.Edit.resetTab();
	
		var receipt = database.receipts.filter(x => x.id == receiptId)[0];

		//Receipt
		GUI.Helper.fillDropdown("#Edit_Account", database.accounts);
		GUI.Helper.fillDropdown("#Edit_Store", database.stores);	
		$("#Edit [name=ID]").val(receiptId);
		$("#Edit_Account").val(receipt.account);
		$("#Edit_Store").val(receipt.store);
		$("#Edit [name=Date]").val(FormatDate(receipt.date));
		$("#Edit_Comment").val(receipt.comment);

		//ReceiptLines
		receipt.lines.forEach(function(item){
			GUI.Edit.addLine("#Edit_Lines")
			$("#Edit [name=Value]:last").val(parseFloat(item.value)/100);
			$("#Edit .Typ:last").val(item.typ);
			$("#Edit .BillingAccount:last").val(item.billing);
		});
	}
};

/**
 * Adds a new line to a list
 * @param {string} list id of List
 * @returns {{}} new line object
 */
GUI.Edit.addLine = function(list){
	var elem = $($.parseHTML(GUI.Edit.html)).find(list).children().last();
	$(list).append(elem);

	switch(list){
		case "#Edit_Lines":
				GUI.Helper.fillDropdown("#Edit_Lines .BillingAccount:last", database.persons);
				GUI.Helper.fillDropdown("#Edit_Lines .Typ:last", database.types);
				$("#Edit_Lines").children().last().find(":input").val("");
				$("#Edit_Lines .BillingAccount:last").val(database.settings.defaultBillingAccount);
				$("#Edit_Lines .Typ:last").val(database.settings.defaultTyp);
				$("#Edit_Lines").children().last().find(":input").focus();
			break;
	}

	return elem;
};

/**
 * Returns available objects within tab
 * @returns {{receipt:receipt}}
 */
GUI.Edit.read = function(){
	var obj = {};
	var receipt = {};

	receipt.id = parseInt($("#Edit [name=ID]").val());
	receipt.date = Math.round(new Date($("#Edit [name=Date]").first().val()).getTime()/1000);
	receipt.account = parseInt($("#Edit_Account").val());
	receipt.store = parseInt($("#Edit_Store").val());
	receipt.comment = $("#Edit_Comment").val()
	receipt.lines = [];

	$.each($("#Edit_Lines").children(), function(i, elem){
		var line = {};

		line.id = GUI.Helper.nextLineId();
		line.billing = parseInt($(elem).find(".BillingAccount").val());
		line.typ = parseInt($(elem).find(".Typ").val());
		line.value = parseInt(GUI.Helper.evalValueInput($(elem).find("[name=Value]").val()).val2);

		receipt.lines.push(line);
	});

	obj.receipt = receipt;

	return obj;
};

/**
 * Handles tab specific events
 * @param {string} type type of event
 * @param {{}} event event object
 */
GUI.Edit.eventHandler = function(type, event){
	switch(type){
		case "click":
			//cancelEdit
			if($(event.target).hasClass("cancelEdit")){
				switchTab("button:contains('Verlauf')", "History");

			//updateReceipt
			}else if($(event.target).hasClass("updateReceipt")){
				var obj = GUI.Edit.read().receipt;
					
					if(database.validate("Receipt", obj)){
						if(confirm("Abschicken?")){
							database.receipts_update(obj);
						}
					}

			//removeReceipt
			}else if($(event.target).hasClass("removeReceipt")){
				if(confirm("Abschicken?")){
					database.receipts_delete(GUI.Edit.read().receipt);
					switchTab('button:contains("Verlauf")', "History");
				}
			
			//removeLine
			}else if($(event.target).hasClass("removeLine")){
				if($(event.target).closest(".flexLine").siblings().length > 0){
					$(event.target).closest(".flexLine").remove()
				}

			//addLine
			}else if($(event.target).hasClass("addLine")){
				GUI.Edit.addLine("#" + $(GUI.Helper.getContainer(event.target)).prop("id"));

			}
			break;
			
		case "focusout":
			//Sum values for result
			if(event.target.matches("#Edit_Lines [name=Value]")){
				elems = $("#Edit_Lines [name=Value]");
				var res = 0;

				$.each(elems, function(i, elem){

					if(GUI.Helper.evalValueInput($(elem).val()).isNaN){
						$(elem).css("background-color", "orangered");
					}else{
						$(elem).css("background-color", "");
					}

					res = res + GUI.Helper.evalValueInput($(elem).val()).val
				});

				res = Math.trunc(parseFloat((res*100).toFixed(2)))/100
				$("#Edit_Result").text(res);
				
			}
			break;
		
		case "keypress":
			//Add new line after enter
			if(event.which == 13 && event.target.matches("#Edit_Lines [name=Value]")){
				GUI.Edit.addLine("#Edit_Lines");
			}
			break;
	}
};