/**
 * New Tab
 */
GUI.New = {};

/**
 * default HTML content
 */
GUI.New.html = "";

/**
 * Tab specific variables
 */
GUI.New.Temp = {
};

/**
 * Returns a boolean whether this objectType is used in this tab
 * @returns {bool}
 */
GUI.New.isObjectRegistered = function(objectType){
	arr = ["types", "persons", "accounts", "stores"];
	return arr.includes(objectType);
};

/**
 * Resets Tab to default
 */
GUI.New.resetTab = function(){
	var displayStatus = $("#New").css("display");
	$("#New").replaceWith(GUI.New.html);
	$("#New").css("display", displayStatus);
};

/**
 * Builds Tab with data
 */
GUI.New.build = function(){
	GUI.New.resetTab();

	//Receipt
	GUI.Helper.fillDropdown("#New_Account", database.accounts);
	GUI.Helper.fillDropdown("#New_Store", database.stores);
	$("#New_Store").val(1);

	//ReceiptLines
	GUI.Helper.fillDropdown("#New .Typ", database.types);
	GUI.Helper.fillDropdown("#New .BillingAccount", database.persons)
	$("#New .Typ").val(database.settings.defaultTyp)
	$("#New .BillingAccount").val(database.settings.defaultBillingAccount);
};

/**
 * Adds a new line to a list
 * @param {string} list id of List
 * @returns {{}} new line object
 */
GUI.New.addLine = function(list){
	var elem = $($.parseHTML(GUI.New.html)).find(list).children().last();
	$(list).append(elem);

	switch(list){
		case "#New_Lines":
				GUI.Helper.fillDropdown("#New_Lines .BillingAccount:last", database.persons);
				GUI.Helper.fillDropdown("#New_Lines .Typ:last", database.types);
				$("#New_Lines").children().last().find(":input").val("");
				$("#New_Lines .BillingAccount:last").val(database.settings.defaultBillingAccount);
				$("#New_Lines .Typ:last").val(database.settings.defaultTyp);
				$("#New_Lines").children().last().find(":input").focus();
			break;
	}

	return elem;
};

/**
 * Returns available objects within tab
 * @returns {{receipt:receipt}}
 */
GUI.New.read = function(){
	var obj = {};
	var receipt = {};

	receipt.id = GUI.Helper.nextUniqueId(database.receipts, "id");
	receipt.date = Math.round(new Date($("#New [name=Date]").first().val()).getTime()/1000);
	receipt.account = parseInt($("#New_Account").val());
	receipt.store = parseInt($("#New_Store").val());
	receipt.comment = $("#New_Comment").val()
	receipt.lines = [];

	$.each($("#New_Lines").children(), function(i, elem){
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
GUI.New.eventHandler = function(type, event){
	switch(type){
		case "click":
			//addReceipt
			if($(event.target).hasClass("addReceipt")){
				var obj = GUI.New.read().receipt;

					if(database.validate("Receipt", obj)){
						if(confirm("Abschicken?")){							
							database.receipts_add(obj);
							GUI.New.build();
						}
					}else{
						alert("Eingabefehler");
					}

			//resetHtml
			}else if($(event.target).hasClass("resetHtml")){
				GUI.New.build();
			
			//removeLine
			}else if($(event.target).hasClass("removeLine")){
				if($(event.target).closest(".flexLine").siblings().length > 0){
					$(event.target).closest(".flexLine").remove()
				}
			
			//addLine
			}else if($(event.target).hasClass("addLine")){
				GUI.New.addLine("#" + $(GUI.Helper.getContainer(event.target)).prop("id"));

			}
			break;

		case "focusout":
			//Sum values for result
			if(event.target.matches("#New_Lines [name=Value]")){
				elems = $("#New_Lines [name=Value]");
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
				$("#New_Result").text(res);

			}
			break;

		case "keypress":
			//Add new line after enter
			if(event.which == 13 && event.target.matches("#New_Lines [name=Value]")){
				GUI.New.addLine("#New_Lines");
			}
			break;
	}
};