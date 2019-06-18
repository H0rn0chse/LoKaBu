/**
 * Settings Tab
 */
GUI.Settings = {};

/**
 * default HTML content
 */
GUI.Settings.html = "";

/**
 * Tab specific variables
 */
GUI.Settings.Temp = {
};

/**
 * Returns a boolean whether this objectType is used in this tab
 * @returns {bool}
 */
GUI.Settings.isObjectRegistered = function(objectType){
	arr = ["types", "persons", "accounts", "stores"];
	return arr.includes(objectType);
};

/**
 * Resets Tab to default
 */
GUI.Settings.resetTab = function(){
	var displayStatus = $("#Settings").css("display");
	$("#Settings").replaceWith(GUI.Settings.html);
	$("#Settings_Persons").empty();
	$("#Settings_Accounts").empty();
	$("#Settings_Types").empty();
	$("#Settings_Stores").empty();
	$("#Settings").css("display", displayStatus);
};

/**
 * Builds Tab with data
 */
GUI.Settings.build = function(){
	GUI.Settings.resetTab();

	//Settings
	GUI.Helper.fillDropdown("#Settings .BillingAccount", database.persons);
	GUI.Helper.fillDropdown("#Settings .Typ", database.types);
	$("#Settings .BillingAccount").val(database.settings.defaultBillingAccount);
	$("#Settings .Typ").val(database.settings.defaultTyp);

	//Persons
	database.persons.forEach(function(item){
		var newLine = $($.parseHTML(GUI.Settings.html)).find("#Settings_Persons").children().last();

		$("#Settings_Persons").append(newLine);
		$(newLine).find("[name=ID]").val(item.id);
		$(newLine).find("[name=DisplayName]").val(item.displayName);
	});

	//Accounts
	database.accounts.forEach(function(item){
		var newLine = $($.parseHTML(GUI.Settings.html)).find("#Settings_Accounts").children().last();

		$("#Settings_Accounts").append(newLine);
		$(newLine).find("[name=ID]").val(item.id);
		$(newLine).find("[name=DisplayName]").val(item.displayName);
		$(newLine).find("[name=Owner]").val(item.owner);
	});

	//Types
	database.types.forEach(function(item){
		var newLine = $($.parseHTML(GUI.Settings.html)).find("#Settings_Types").children().last();

		$("#Settings_Types").append(newLine);
		$(newLine).find("[name=ID]").val(item.id);
		$(newLine).find("[name=DisplayName]").val(item.displayName);
	});

	//Stores
	database.stores.forEach(function(item){
		var newLine = $($.parseHTML(GUI.Settings.html)).find("#Settings_Stores").children().last();

		$("#Settings_Stores").append(newLine);
		$(newLine).find("[name=ID]").val(item.id);
		$(newLine).find("[name=DisplayName]").val(item.displayName);
	});
};

/**
 * Adds a new line to a list
 * @param {string} list id of List
 * @returns {{}} new line object
 */
GUI.Settings.addLine = function(list){
	var elem = $($.parseHTML(GUI.Settings.html)).find(list).children().last();
	$(list).append(elem);

	switch(list){
		case "#Settings_Stores":
			$("#Settings_Stores [name=ID]:last").val($("#Settings_Stores").children().length);
			$("#Settings_Stores [name=DisplayName]:last").val("NewStore");
			break;

		case "#Settings_Persons":
			$("#Settings_Persons [name=ID]:last").val($("#Settings_Persons").children().length);
			$("#Settings_Persons [name=DisplayName]:last").val("NewPerson");
			break;

		case "#Settings_Accounts":
			$("#Settings_Accounts [name=ID]:last").val($("#Settings_Accounts").children().length);
			$("#Settings_Accounts [name=DisplayName]:last").val("NewAccount");
			$("#Settings_Accounts [name=Owner]:last").val(1);
			break;

		case "#Settings_Types":
			$("#Settings_Types [name=ID]:last").val($("#Settings_Types").children().length);
			$("#Settings_Types [name=DisplayName]:last").val("NewTyp");
			break;
	}

	return elem;
};

/**
 * Returns available objects within tab
 * @returns {{settings:settings, persons:person[], accounts:account[], types:typ[], stores:store[]}}
 */
GUI.Settings.read = function(){
	var obj = {};
	var settings = {};
	var persons = [];
	var accounts = [];
	var types = [];
	var stores = [];

	settings.defaultBillingAccount =  $("#Settings .BillingAccount").val();
	settings.defaultTyp = $("#Settings .Typ").val();
	
	$.each($("#Settings_Persons").children(),function(i, elem){
		var person = {};
		person.id = parseInt($(elem).find("[name=ID]").val());
		person.displayName = $(elem).find("[name=DisplayName]").val();
		persons.push(person);
	});

	$.each($("#Settings_Accounts").children(),function(i, elem){
		var account = {};
		account.id = parseInt($(elem).find("[name=ID]").val());
		account.displayName = $(elem).find("[name=DisplayName]").val();
		account.owner = parseInt($(elem).find("[name=Owner]").val());
		accounts.push(account);
	});
	
	$.each($("#Settings_Types").children(),function(i, elem){
		var typ = {};
		typ.id = parseInt($(elem).find("[name=ID]").val());
		typ.displayName = $(elem).find("[name=DisplayName]").val();
		types.push(typ);
	});

	$.each($("#Settings_Stores").children(),function(i, elem){
		var store = {};
		store.id = parseInt($(elem).find("[name=ID]").val());
		store.displayName = $(elem).find("[name=DisplayName]").val();
		stores.push(store);
	});

	obj.settings = settings;
	obj.persons = persons;
	obj.accounts = accounts;
	obj.types = types;
	obj.stores = stores;

	return obj;
};

/**
 * Handles tab specific events
 * @param {string} type type of event
 * @param {{}} event event object
 */
GUI.Settings.eventHandler = function(type, event){
	switch(type){
		case "click":
			//saveSettings
			if($(event.target).hasClass("saveSettings")){
				obj = GUI.Settings.read();
				validate = true;
				
				validate = database.validate("Settings", obj.settings) ? validate : false;
				validate = database.validate("Persons", obj.persons) ? validate : false;
				validate = database.validate("Accounts", obj.accounts, obj.persons) ? validate : false;
				validate = database.validate("Types", obj.types) ? validate : false;
				validate = database.validate("Stores", obj.stores) ? validate : false;

				if(validate){
					if(confirm("Abschicken?")){
						for(key in obj){
							var item = obj[key];
							if(key == "settings"){
								database.settings_set(item);
							}else{
								item.forEach(function(line){
									key = key.toLowerCase();
									temp = database[key].find(x => x.id == line.id);
									if(typeof temp === "undefined"){
										database[key + "_add"](line);
									}else if(!GUI.Helper.isEquivalent(temp, line)){
										database[key + "_update"](line);
									}
								});
							}
						};
					}
				}else{
					alert("Eingabefehler")
				}

			//addLine
			}else if($(event.target).hasClass("addLine")){
				GUI.Settings.addLine("#" + GUI.Helper.getContainer(event.target).prop("id"));
			}
			break;
	}
};